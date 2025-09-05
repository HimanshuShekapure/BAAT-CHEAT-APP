import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

import { connectDB } from "./lib/db.js"
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config()
const app = express();
const PORT = process.env.PORT;

// Define allowedOrigins BEFORE using it
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174","http://localhost:5175"];

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Online users map: userId -> socketId
const onlineUsers = new Map();

io.on("connection", (socket) => {
  // Listen for user to register their userId
  socket.on("user-online", (userId) => {
    console.log(`User ${userId} is now online with socket ${socket.id}`);
    onlineUsers.set(userId, socket.id);
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  // Listen for sending a message
  socket.on("send-message", (data) => {
    const { receiverId, message } = data;
    console.log(`Message from ${message.sender} to ${receiverId}:`, message);
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      console.log(`Sending message to receiver socket: ${receiverSocketId}`);
      io.to(receiverSocketId).emit("receive-message", message);
    } else {
      console.log(`Receiver ${receiverId} is not online`);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    for (const [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });
});


// Increased JSON payload size limit to handle base64 images
app.use(express.json({ limit: "10mb" }))

app.use(cookieParser());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

server.listen(PORT, () => {
  console.log("server is running on port: " + PORT);
  connectDB();
});

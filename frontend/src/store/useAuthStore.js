import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { data } from 'react-router-dom';
import { io } from "socket.io-client";

let socket = null;

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  socket: null,

  connectSocket: () => {
    const authUser = get().authUser;
    if (!authUser || socket?.connected) return;
    
    socket = io("http://localhost:5001", { withCredentials: true });
    set({ socket });

    socket.on("connect", () => {
      console.log("Socket connected!");
      if (authUser?._id) {
        console.log("Emitting user-online for:", authUser._id);
        socket.emit("user-online", authUser._id);
      }
    });

    socket.on("online-users", (users) => {
      set({ onlineUsers: users });
    });
  },

  disconnectSocket: () => {
    if (socket?.connected) {
      socket.disconnect();
    }
    socket = null;
    set({ socket: null, onlineUsers: [] });
  },

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });
      get().connectSocket();
    } catch (error) {
      console.error("Error checking authentication:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (formData, onSuccess) => {
  console.log(" Sending signup form data:", formData); 
  set({ isSigningUp: true });
  try {
    const response = await axiosInstance.post("/auth/signup", formData);
    set({ authUser: response.data });
    get().connectSocket();
    toast.success("Account created successfully!");
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error(" Error signing up:", error);
    toast.error(error?.response?.data?.message || "Sign up failed");
  } finally {
    set({ isSigningUp: false });
  }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      get().disconnectSocket();
      set({ authUser: null });
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Logout failed");
    }
  },
  login: async (data) => {
  set({ isLoggingIn: true });
  try {
    const res = await axiosInstance.post("/auth/login", data);
    set({ authUser: res.data });
    get().connectSocket();
    toast.success("Login successful!");
    // Navigate after login (optional)
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
  } finally {
    set({ isLoggingIn: false });
  }
  },
  updateProfile: async (data) => {
  set({ isUpdatingProfile: true });
  try {
    const res = await axiosInstance.put("/auth/update-profile", data);
    set({ authUser: res.data });
    toast.success("Profile updated successfully");
  } catch (error) {
    console.log("error in update profile:", error);
    toast.error("Failed to update profile");
  } finally {
    set({ isUpdatingProfile: false });
  }
}

}));

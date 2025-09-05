import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";


export const getUsersForSidebar=async(req,res)=>{
    try {
        const loggedInUserId= req.user._id;
        const filterUser=await User.find({_id:{$ne:loggedInUserId}}).select("-password");

        res.status(200).json(filterUser);
    } catch (error) {
        console.error("Error in getUserForSidebar:",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const getMessages=async(req,res)=>{
    try {
        const {id:userToChatId}=req.params
        const myId=req.user._id;

        const messages=await Message.find({
            $or: [
                { sender: myId, receiver: userToChatId },
                { sender: userToChatId, receiver: myId },
            ]

        })

        res.status(200).json(messages)
    } catch (error) {
        console.error("Error in getMessages:",error.message);
        res.status(500).json({message:"Internal Server Error"});

        
    }
};

export const sendMessage=async (req,res)=>{
    try {
        const {text,image}=req.body;
        const {id:userToChatId}=req.params;
        const myId=req.user._id;

        // Validation
        if (!userToChatId) {
            return res.status(400).json({ message: "Receiver user ID is required." });
        }
        if (!text && !image) {
            return res.status(400).json({ message: "Message text or image is required." });
        }

        let imageUrl = null;
        if(image){
            try {
                const upload=await cloudinary.uploader.upload(image);
                imageUrl=upload.secure_url;
            } catch (uploadErr) {
                console.error("Cloudinary upload error:", uploadErr);
                return res.status(500).json({ message: "Image upload failed." });
            }
        }
        const newMessage=new Message({
            sender: myId,
            receiver: userToChatId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        res.status(201).json(newMessage)
    } catch (error) {
        console.error("Error in sendMessage controller:", error);
        res.status(500).json({message:"Internal Server Error", error: error.message});
    }
}

export const searchUsersByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ message: "Email query is required" });
        }
        const loggedInUserId = req.user._id;
        const users = await User.find({
            email: { $regex: email, $options: "i" },
            _id: { $ne: loggedInUserId },
        }).select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in searchUsersByEmail:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

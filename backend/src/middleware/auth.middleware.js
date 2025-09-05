import jwt from "jsonwebtoken";
import User  from "../models/user.model.js";


export const protectRoute=async (req,res,next)=>{
    try {
        const token =req.cookies.jwt;

        if(!token){
            return res.status(401).json({msg:"Please login to access this route"})
        }
         
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({msg:"Please login to access this route"})
        }

        const user=await User.findById(decoded.userId).select("-password");
         
        if(!user){
            return res.status(401).json({msg:"User not found"})
        }
         
        req.user=user
        next()


    } catch (error) {

        console.log("Error in protectRoute middleware:",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

// ✅ Check Authentication
export const checkAuth = (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Return the user object (without password)
    return res.status(200).json(req.user);
  } catch (error) {
    console.error("Check Auth Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
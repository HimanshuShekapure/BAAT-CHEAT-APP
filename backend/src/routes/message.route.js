import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  searchUsersByEmail
} from "../controllers/message.controller.js";


const router= express.Router();


router.get("/user",protectRoute, getUsersForSidebar);
router.get("/search-user", protectRoute, searchUsersByEmail);
router.get("/:id",protectRoute, getMessages);

router.post("/send/:id",protectRoute, sendMessage);

export default router;
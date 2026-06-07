 import express from "express";
import multer from "multer";
import {
  createOrGetConversation,
  getUserConversations,
  createGroupConversation,
  updateGroupConversation,
} from "../controllers/conversationController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", protect, createOrGetConversation);
router.get("/", protect, getUserConversations);
router.post("/group", protect, upload.single("groupAvatar"), createGroupConversation);
router.put("/group/:id", protect, upload.single("groupAvatar"), updateGroupConversation);

export default router;

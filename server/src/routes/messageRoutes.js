 import express from "express";
import multer from "multer";
import { sendMessage, getMessages, markMessagesAsRead, deleteMessage, togglePinMessage } from "../controllers/messageController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", protect, upload.single("image"), sendMessage);
router.get("/:conversationId", protect, getMessages);
router.put("/read/:conversationId", protect, markMessagesAsRead);
router.delete("/:id", protect, deleteMessage);
router.put("/:id/pin", protect, togglePinMessage);

export default router;

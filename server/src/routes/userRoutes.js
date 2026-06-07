 import express from "express";
import multer from "multer";
import { searchUsers, getProfile, updateProfile } from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/search", protect, searchUsers);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, upload.single("avatar"), updateProfile);

export default router;

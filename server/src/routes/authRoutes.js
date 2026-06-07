 import express from "express";
import multer from "multer";
import { register, login, logout } from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.post("/logout", protect, logout);

export default router;
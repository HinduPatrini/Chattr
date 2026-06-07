 import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";

// @POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    let avatarUrl = "";
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, "chattr/avatars");
        avatarUrl = result.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary upload failed, using Base64 fallback:", uploadErr.message);
        avatarUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      }
    }

    const user = await User.create({
      username,
      email,
      password,
      avatar: avatarUrl,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @POST /api/auth/logout
export const logout = async (req, res, next) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

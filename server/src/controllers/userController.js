 import User from "../models/User.js";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";

// @GET /api/users/search?query=
export const searchUsers = async (req, res, next) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
      _id: { $ne: req.user._id },
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// @GET /api/users/profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// @PUT /api/users/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { username, bio, removeAvatar } = req.body;

    let avatarUrl = req.user.avatar;
    if (removeAvatar === "true") {
      avatarUrl = "";
    } else if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, "chattr/avatars");
        avatarUrl = result.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary avatar upload failed, using Base64 fallback:", uploadErr.message);
        avatarUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, bio, avatar: avatarUrl },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

 
import Conversation from "../models/Conversation.js";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";

// @POST /api/conversations
export const createOrGetConversation = async (req, res, next) => {
  try {
    const { receiverId } = req.body;

    let conversation = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [req.user._id, receiverId] },
    }).populate("participants", "-password")
      .populate("lastMessage");

    if (conversation) {
      return res.status(200).json(conversation);
    }

    conversation = await Conversation.create({
      participants: [req.user._id, receiverId],
      isGroup: false,
    });

    conversation = await conversation.populate("participants", "-password");
    res.status(201).json(conversation);
  } catch (error) {
    next(error);
  }
};

// @GET /api/conversations
export const getUserConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: { $in: [req.user._id] },
    })
      .populate("participants", "-password")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};

// @POST /api/conversations/group
export const createGroupConversation = async (req, res, next) => {
  try {
    const { name, members } = req.body;

    if (members.length < 2) {
      return res.status(400).json({ message: "Group needs at least 3 members" });
    }

    let groupAvatarUrl = "";
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, "chattr/groups");
        groupAvatarUrl = result.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary group avatar upload failed, using Base64 fallback:", uploadErr.message);
        groupAvatarUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      }
    }

    const conversation = await Conversation.create({
      isGroup: true,
      groupName: name,
      groupAvatar: groupAvatarUrl,
      participants: [req.user._id, ...members],
      admin: req.user._id,
    });

    const populated = await conversation.populate("participants", "-password");
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @PUT /api/conversations/group/:id
export const updateGroupConversation = async (req, res, next) => {
  try {
    const { name, members } = req.body;
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (conversation.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only admin can update group" });
    }

    let groupAvatarUrl = conversation.groupAvatar;
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, "chattr/groups");
        groupAvatarUrl = result.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary group avatar update failed, using Base64 fallback:", uploadErr.message);
        groupAvatarUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      }
    }

    conversation.groupName = name || conversation.groupName;
    conversation.participants = members || conversation.participants;
    conversation.groupAvatar = groupAvatarUrl;
    await conversation.save();

    const updated = await conversation.populate("participants", "-password");
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};
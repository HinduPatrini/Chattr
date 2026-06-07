 import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";

// @POST /api/messages
export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, text } = req.body;

    let imageUrl = "";
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, "chattr/messages");
        imageUrl = result.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary image upload failed, using Base64 fallback:", uploadErr.message);
        imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      }
    }

    const message = await Message.create({
      conversationId,
      sender: req.user._id,
      text,
      image: imageUrl,
      readBy: [req.user._id],
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
    });

    const populated = await message.populate("sender", "-password");
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @GET /api/messages/:conversationId
export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).populate("sender", "-password");

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

// @PUT /api/messages/read/:conversationId
export const markMessagesAsRead = async (req, res, next) => {
  try {
    await Message.updateMany(
      {
        conversationId: req.params.conversationId,
        readBy: { $nin: [req.user._id] },
      },
      { $push: { readBy: req.user._id } }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    next(error);
  }
};

// @DELETE /api/messages/:id
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only allow the sender of the message to delete it
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this message" });
    }

    await Message.findByIdAndDelete(req.params.id);

    // Update conversation lastMessage if this was the last message
    const conversation = await Conversation.findById(message.conversationId);
    if (conversation && conversation.lastMessage?.toString() === message._id.toString()) {
      // Find the message before this one
      const prevMessage = await Message.findOne({ conversationId: message.conversationId })
        .sort({ createdAt: -1 });
      conversation.lastMessage = prevMessage ? prevMessage._id : null;
      await conversation.save();
    }

    res.status(200).json({ message: "Message deleted successfully", messageId: message._id });
  } catch (error) {
    next(error);
  }
};

// @PUT /api/messages/:id/pin
export const togglePinMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    message.isPinned = !message.isPinned;
    await message.save();

    const populated = await message.populate("sender", "-password");
    res.status(200).json(populated);
  } catch (error) {
    next(error);
  }
};

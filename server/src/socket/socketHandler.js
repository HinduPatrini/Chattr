 import User from "../models/User.js";

const onlineUsers = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // User comes online
    socket.on("user:online", async (userId) => {
      onlineUsers.set(userId, socket.id);
      await User.findByIdAndUpdate(userId, { isOnline: true });
      io.emit("users:online", Array.from(onlineUsers.keys()));
    });

    // Join a conversation room
    socket.on("conversation:join", (conversationId) => {
      socket.join(conversationId);
    });

    // Leave a conversation room
    socket.on("conversation:leave", (conversationId) => {
      socket.leave(conversationId);
    });

    // Send message
    socket.on("message:send", (message) => {
      io.to(message.conversationId).emit("message:receive", message);
    });

    // Delete message
    socket.on("message:delete", ({ messageId, conversationId }) => {
      io.to(conversationId).emit("message:deleted", { messageId, conversationId });
    });

    // Pin message
    socket.on("message:pin", (message) => {
      io.to(message.conversationId).emit("message:pinned", message);
    });

    // Typing indicator
    socket.on("typing:start", ({ conversationId, userId, username }) => {
      socket.to(conversationId).emit("typing:start", { userId, username });
    });

    socket.on("typing:stop", ({ conversationId, userId }) => {
      socket.to(conversationId).emit("typing:stop", { userId });
    });

    // Mark messages as read
    socket.on("message:read", ({ conversationId, userId }) => {
      socket.to(conversationId).emit("message:read", { conversationId, userId });
    });

    // User disconnects
    socket.on("disconnect", async () => {
      let disconnectedUserId = null;
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          break;
        }
      }

      if (disconnectedUserId) {
        onlineUsers.delete(disconnectedUserId);
        await User.findByIdAndUpdate(disconnectedUserId, {
          isOnline: false,
          lastSeen: new Date(),
        });
        io.emit("users:online", Array.from(onlineUsers.keys()));
      }

      console.log("Socket disconnected:", socket.id);
    });
  });
};

export default socketHandler;

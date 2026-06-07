import { create } from "zustand";
import { io } from "socket.io-client";
import { useChatStore } from "./useChatStore";

const SOCKET_URL = "http://localhost:5000";

export const useSocketStore = create((set, get) => ({
  socket: null,

  connectSocket: (userId) => {
    // If socket is already connected, don't create a new one
    if (get().socket?.connected) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected! Emitting user:online for", userId);
      socket.emit("user:online", userId);
    });

    socket.on("message:receive", (message) => {
      useChatStore.getState().addMessage(message);
    });

    socket.on("message:deleted", ({ messageId }) => {
      useChatStore.getState().removeMessage(messageId);
    });

    socket.on("message:pinned", (message) => {
      useChatStore.getState().updateMessage(message);
    });

    socket.on("users:online", (userIds) => {
      useChatStore.getState().setOnlineUsers(userIds);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));

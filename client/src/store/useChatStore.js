import { create } from "zustand";
import axiosInstance from "../api/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  onlineUsers: [],
  unreadCounts: {}, // key: conversationId, value: number
  isLoadingMessages: false,
  isLoadingConversations: false,
  isDetailsOpen: false,

  setIsDetailsOpen: (open) => set({ isDetailsOpen: open }),

  fetchConversations: async () => {
    set({ isLoadingConversations: true });
    try {
      const response = await axiosInstance.get("/conversations");
      const conversations = response.data;
      
      // Calculate initial unread counts based on lastMessage
      const currentUser = useAuthStore.getState().user;
      const currentUserId = currentUser?._id;
      const unreadCounts = {};
      
      conversations.forEach((conv) => {
        unreadCounts[conv._id] = 0;
        if (conv.lastMessage && currentUserId) {
          const lastMsg = conv.lastMessage;
          const senderId = lastMsg.sender?._id || lastMsg.sender;
          const isFromMe = senderId === currentUserId;
          const readBy = lastMsg.readBy || [];
          
          if (!isFromMe && !readBy.includes(currentUserId)) {
            unreadCounts[conv._id] = 1; // Since we don't have all message history, start with 1
          }
        }
      });

      set({ conversations, unreadCounts, isLoadingConversations: false });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load conversations.");
      set({ isLoadingConversations: false });
    }
  },

  setActiveConversation: (conversation) => {
    set({ activeConversation: conversation, isDetailsOpen: false });
    if (conversation) {
      // Clear unread count for this conversation in local state
      set((state) => ({
        unreadCounts: {
          ...state.unreadCounts,
          [conversation._id]: 0,
        },
      }));
    }
  },

  fetchMessages: async (conversationId) => {
    set({ isLoadingMessages: true });
    try {
      const response = await axiosInstance.get(`/messages/${conversationId}`);
      set({ messages: response.data, isLoadingMessages: false });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages.");
      set({ isLoadingMessages: false });
    }
  },

  sendMessage: async (formData) => {
    try {
      const response = await axiosInstance.post("/messages", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const newMessage = response.data;
      
      // Update local messages array
      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
      
      // Update conversations lastMessage
      get().updateLastMessage(newMessage);

      return newMessage;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message.");
      throw error;
    }
  },

  addMessage: (message) => {
    const { activeConversation, messages } = get();
    const isCurrentActive = activeConversation && activeConversation._id === message.conversationId;

    if (isCurrentActive) {
      // Add message to current view if it's not already in there (avoid socket duplication)
      if (!messages.find((m) => m._id === message._id)) {
        set({ messages: [...messages, message] });
      }
    } else {
      // Increment unread count
      set((state) => {
        const count = state.unreadCounts[message.conversationId] || 0;
        return {
          unreadCounts: {
            ...state.unreadCounts,
            [message.conversationId]: count + 1,
          },
        };
      });
    }

    // Update last message in the conversations list
    get().updateLastMessage(message);
  },

  updateLastMessage: (message) => {
    set((state) => {
      const updatedConversations = state.conversations.map((conv) => {
        if (conv._id === message.conversationId) {
          return {
            ...conv,
            lastMessage: message,
            updatedAt: message.createdAt || new Date().toISOString(),
          };
        }
        return conv;
      });

      // Sort conversations so the one with the latest message is at the top
      updatedConversations.sort((a, b) => {
        const dateA = new Date(a.lastMessage?.createdAt || a.updatedAt);
        const dateB = new Date(b.lastMessage?.createdAt || b.updatedAt);
        return dateB - dateA;
      });

      return { conversations: updatedConversations };
    });
  },

  markAsRead: async (conversationId) => {
    try {
      await axiosInstance.put(`/messages/read/${conversationId}`);
      // Clear locally too
      set((state) => ({
        unreadCounts: {
          ...state.unreadCounts,
          [conversationId]: 0,
        },
      }));
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  },

  setOnlineUsers: (userIds) => {
    const prevOnline = get().onlineUsers || [];
    set({ onlineUsers: userIds });
    
    // Find users who just went offline
    const wentOffline = prevOnline.filter(id => !userIds.includes(id));
    if (wentOffline.length > 0) {
      set((state) => {
        if (!state.activeConversation) return {};
        
        const updatedParticipants = state.activeConversation.participants?.map((p) => {
          if (wentOffline.includes(p._id)) {
            return { ...p, lastSeen: new Date().toISOString() };
          }
          return p;
        });
        
        return {
          activeConversation: {
            ...state.activeConversation,
            participants: updatedParticipants,
          }
        };
      });
    }
  },


  createConversation: async (receiverId) => {
    try {
      const response = await axiosInstance.post("/conversations", { receiverId });
      const newConv = response.data;
      
      // Add to conversations if not already exists
      set((state) => {
        const exists = state.conversations.some((c) => c._id === newConv._id);
        if (exists) return state;
        return {
          conversations: [newConv, ...state.conversations],
        };
      });

      return newConv;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to start conversation.");
      throw error;
    }
  },

  createGroup: async (formData) => {
    try {
      const response = await axiosInstance.post("/conversations/group", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const newGroup = response.data;
      
      set((state) => ({
        conversations: [newGroup, ...state.conversations],
      }));
      
      toast.success("Group created successfully!");
      return newGroup;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group.");
      throw error;
    }
  },

  deleteMessage: async (messageId) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}`);
      get().removeMessage(messageId);
      toast.success("Message deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message.");
      throw error;
    }
  },

  togglePinMessage: async (messageId) => {
    try {
      const response = await axiosInstance.put(`/messages/${messageId}/pin`);
      const updatedMessage = response.data;
      get().updateMessage(updatedMessage);
      toast.success(updatedMessage.isPinned ? "Message pinned" : "Message unpinned");
      return updatedMessage;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to pin message.");
      throw error;
    }
  },

  removeMessage: (messageId) => {
    set((state) => {
      const updatedMessages = state.messages.filter((m) => m._id !== messageId);
      
      // Update conversation lastMessage if it was deleted
      const updatedConversations = state.conversations.map((conv) => {
        if (conv.lastMessage && (conv.lastMessage._id === messageId || conv.lastMessage === messageId)) {
          // Find new last message from remaining messages of this conversation
          const convMsgs = updatedMessages.filter((m) => m.conversationId === conv._id);
          const lastMsg = convMsgs[convMsgs.length - 1] || null;
          return {
            ...conv,
            lastMessage: lastMsg,
          };
        }
        return conv;
      });

      return {
        messages: updatedMessages,
        conversations: updatedConversations,
      };
    });
  },

  updateMessage: (updatedMessage) => {
    set((state) => {
      const updatedMessages = state.messages.map((m) =>
        m._id === updatedMessage._id ? updatedMessage : m
      );

      // Update in conversation lastMessage if matches
      const updatedConversations = state.conversations.map((conv) => {
        if (conv.lastMessage && (conv.lastMessage._id === updatedMessage._id || conv.lastMessage === updatedMessage._id)) {
          return {
            ...conv,
            lastMessage: updatedMessage,
          };
        }
        return conv;
      });

      return {
        messages: updatedMessages,
        conversations: updatedConversations,
      };
    });
  },
}));

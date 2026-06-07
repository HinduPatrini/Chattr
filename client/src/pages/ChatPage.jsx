import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useSocketStore } from "../store/useSocketStore";
import Sidebar from "../components/sidebar/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";

const ChatPage = () => {
  const user = useAuthStore((state) => state.user);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  const fetchConversations = useChatStore((state) => state.fetchConversations);
  const connectSocket = useSocketStore((state) => state.connectSocket);
  const activeConversation = useChatStore((state) => state.activeConversation);

  // Initialize profile data, connect socket, and fetch conversations
  useEffect(() => {
    const initializeChatPage = async () => {
      let currentUser = user;
      
      // If user profile is not fetched yet, fetch it
      if (!currentUser) {
        currentUser = await fetchProfile();
      }

      // Connect socket and load chats once user details are loaded
      if (currentUser && currentUser._id) {
        connectSocket(currentUser._id);
        fetchConversations();
      }
    };

    initializeChatPage();
  }, [user, fetchProfile, fetchConversations, connectSocket]);

  return (
    <div className="flex h-screen w-screen bg-background-primary overflow-hidden relative">
      
      {/* Sidebar - w-full on mobile, fixed width on desktop. Hide when active chat is open on mobile. */}
      <div
        className={`w-full lg:w-80 h-full flex-shrink-0 border-r border-border transition-all duration-300 ${
          activeConversation ? "hidden lg:block" : "block"
        }`}
      >
        <Sidebar />
      </div>

      {/* Chat Window - takes rest of space on desktop. Show only when chat is open on mobile. */}
      <div
        className={`flex-1 h-full transition-all duration-300 ${
          activeConversation ? "block" : "hidden lg:block"
        }`}
      >
        <ChatWindow />
      </div>

    </div>
  );
};

export default ChatPage;

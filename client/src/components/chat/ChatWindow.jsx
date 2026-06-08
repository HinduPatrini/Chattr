import React, { useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useSocket } from "../../hooks/useSocket";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import ConversationDetailsPanel from "./ConversationDetailsPanel";

const ChatWindow = () => {
  const { activeConversation, fetchMessages, markAsRead, messages, isDetailsOpen } = useChatStore();
  const { typingUser } = useSocket();

  useEffect(() => {
    if (activeConversation?._id) {
      fetchMessages(activeConversation._id);
      markAsRead(activeConversation._id);
    }
  }, [activeConversation?._id, fetchMessages, markAsRead]);

  // Empty State
  if (!activeConversation) {
    return (
      <div className="h-full flex-1 flex flex-col items-center justify-center bg-background-primary relative overflow-hidden select-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="flex flex-col items-center text-center max-w-sm px-6 relative z-10 space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-background-secondary border border-border flex items-center justify-center shadow-2xl text-accent animate-bounce1">
            <MessageCircle className="w-10 h-10" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-text-primary">Welcome to Chattr</h2>
            <p className="text-sm text-text-secondary">
              Select a conversation from the sidebar or search for users to start vibing.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex-1 flex bg-background-primary min-w-0 overflow-hidden relative">

      {/* ── Main chat feed ── */}
      <div className={`flex-1 h-full flex flex-col min-w-0 ${isDetailsOpen ? "hidden xl:flex" : "flex"}`}>
        <ChatHeader />

        <div className="flex-1 min-h-0 relative">
          <MessageList />
        </div>

        {typingUser && <TypingIndicator typingUser={typingUser} />}
        <MessageInput />
      </div>

      {/* ── Details panel — always pinned on xl, toggleable on mobile/tablet ── */}
      <div className={`${
        isDetailsOpen 
          ? "flex absolute inset-0 z-40 bg-background-secondary w-full h-full xl:relative xl:flex xl:w-72 xl:2xl:w-80" 
          : "hidden xl:flex w-72 2xl:w-80"
      } flex-shrink-0 h-full`}>
        <ConversationDetailsPanel messages={messages} />
      </div>

    </div>
  );
};

export default ChatWindow;

import React from "react";
import { MessageCircle } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import ConversationItem from "./ConversationItem";

const ConversationList = () => {
  const { conversations, isLoadingConversations } = useChatStore();

  // Skeleton Loader for Conversation List
  if (isLoadingConversations) {
    return (
      <div className="flex flex-col p-3 gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-background-hover/10 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-background-hover" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-background-hover rounded w-1/3" />
              <div className="h-3 bg-background-hover rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-16 h-16 rounded-full bg-background-hover flex items-center justify-center mb-4 text-text-secondary">
          <MessageCircle className="w-8 h-8" />
        </div>
        <h3 className="text-text-primary font-semibold text-lg mb-1">No conversations yet</h3>
        <p className="text-text-secondary text-sm max-w-[200px]">
          Search for users to start chatting
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-1.5 gap-0.5">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation._id}
          conversation={conversation}
        />
      ))}
    </div>
  );
};

export default ConversationList;

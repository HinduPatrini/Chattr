import React from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import Avatar from "../common/Avatar";
import { formatMessageTime } from "../../utils/dateHelper";

const ConversationItem = ({ conversation }) => {
  const currentUser = useAuthStore((state) => state.user);
  const { activeConversation, setActiveConversation, onlineUsers, unreadCounts } = useChatStore();

  const isSelected = activeConversation && activeConversation._id === conversation._id;
  const unreadCount = unreadCounts[conversation._id] || 0;

  // Determine conversation details (Group vs DM)
  let displayName = "";
  let displayAvatar = "";
  let isOnline = false;
  let showOnlineDot = false;

  if (conversation.isGroup) {
    displayName = conversation.groupName;
    displayAvatar = conversation.groupAvatar;
    showOnlineDot = false;
  } else {
    const otherUser = conversation.participants?.find((p) => p._id !== currentUser?._id);
    displayName = otherUser ? otherUser.username : "Unknown User";
    displayAvatar = otherUser ? otherUser.avatar : "";
    isOnline = otherUser ? onlineUsers.includes(otherUser._id) : false;
    showOnlineDot = true;
  }

  const getLastMessageText = () => {
    if (!conversation.lastMessage) return "No messages yet";
    const lastMsg = conversation.lastMessage;
    
    // Check if lastMessage is populated as object or string ID
    const text = typeof lastMsg === "object" ? lastMsg.text : "";
    const image = typeof lastMsg === "object" ? lastMsg.image : "";
    const sender = typeof lastMsg === "object" ? lastMsg.sender : null;
    
    let senderPrefix = "";
    if (conversation.isGroup && sender) {
      const senderId = typeof sender === "object" ? sender._id : sender;
      const senderName = typeof sender === "object" ? sender.username : "";
      senderPrefix = senderId === currentUser?._id ? "You: " : `${senderName}: `;
    }

    if (image && !text) {
      return `${senderPrefix}📷 Image`;
    }
    return `${senderPrefix}${text}`;
  };

  const lastMessageTime = conversation.lastMessage?.createdAt || conversation.updatedAt;

  return (
    <div
      onClick={() => setActiveConversation(conversation)}
      className={`flex items-center gap-3 p-4 cursor-pointer transition-all duration-200 rounded-xl ${
        isSelected
          ? "bg-background-hover border-l-2 border-accent"
          : "hover:bg-background-hover/50"
      }`}
    >
      {/* Avatar */}
      <Avatar
        src={displayAvatar}
        name={displayName}
        size="md"
        showOnline={showOnlineDot}
        isOnline={isOnline}
      />

      {/* Details Area */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h4 className="font-medium text-text-primary text-sm truncate pr-2">
            {displayName}
          </h4>
          <span className="text-xs text-text-muted flex-shrink-0">
            {formatMessageTime(lastMessageTime)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <p className={`text-sm truncate pr-2 ${unreadCount > 0 ? "text-text-primary font-medium" : "text-text-secondary"}`}>
            {getLastMessageText()}
          </p>
          
          {unreadCount > 0 && (
            <span className="flex-shrink-0 bg-accent text-white text-xs font-semibold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;

import React from "react";
import { ArrowLeft, Phone, Video, MoreVertical, Image as ImageIcon } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import Avatar from "../common/Avatar";
import { formatLastSeen } from "../../utils/dateHelper";

const ChatHeader = () => {
  const currentUser = useAuthStore((state) => state.user);
  const { activeConversation, setActiveConversation, onlineUsers, isDetailsOpen, setIsDetailsOpen } = useChatStore();

  if (!activeConversation) return null;

  let displayName = "";
  let displayAvatar = "";
  let isOnline = false;
  let statusText = "";

  if (activeConversation.isGroup) {
    displayName = activeConversation.groupName;
    displayAvatar = activeConversation.groupAvatar;
    statusText = `${activeConversation.participants?.length || 0} members`;
  } else {
    const otherUser = activeConversation.participants?.find((p) => p._id !== currentUser?._id);
    displayName = otherUser ? otherUser.username : "Unknown User";
    displayAvatar = otherUser ? otherUser.avatar : "";
    isOnline = otherUser ? onlineUsers.includes(otherUser._id) : false;
    statusText = isOnline ? "Online" : formatLastSeen(otherUser?.lastSeen);
  }


  return (
    <div className="h-16 flex items-center justify-between px-4 bg-background-secondary border-b border-border select-none z-10 flex-shrink-0">
      
      {/* Left side: Back Button, Avatar, Name & Status */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Back Button */}
        <button
          onClick={() => setActiveConversation(null)}
          className="lg:hidden p-2 -ml-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-background-hover transition-all focus:outline-none"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Profile Info (Clickable to show details) */}
        <div
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="flex items-center gap-3 min-w-0 cursor-pointer select-none group"
        >
          {/* Profile Avatar */}
          <Avatar
            src={displayAvatar}
            name={displayName}
            size="md"
            showOnline={!activeConversation.isGroup}
            isOnline={isOnline}
          />

          {/* Name and Status Info */}
          <div className="min-w-0">
            <h3 className="font-semibold text-text-primary text-sm truncate leading-snug group-hover:text-accent transition-colors">
              {displayName}
            </h3>
            <p className={`text-xs truncate ${isOnline && !activeConversation.isGroup ? "text-online font-medium" : "text-text-secondary"}`}>
              {statusText}
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Action Icons */}
      <div className="flex items-center gap-1.5">
        <button
          title="Voice Call"
          className="p-2 rounded-xl text-text-secondary hover:text-accent hover:bg-background-hover transition-all focus:outline-none"
        >
          <Phone className="w-4.5 h-4.5" />
        </button>
        <button
          title="Video Call"
          className="p-2 rounded-xl text-text-secondary hover:text-accent hover:bg-background-hover transition-all focus:outline-none"
        >
          <Video className="w-4.5 h-4.5" />
        </button>
        <button
          title="Shared Media & Details"
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className={`p-2 rounded-xl transition-all focus:outline-none ${
            isDetailsOpen ? "text-accent bg-accent/10" : "text-text-secondary hover:text-accent hover:bg-background-hover"
          }`}
        >
          <ImageIcon className="w-4.5 h-4.5" />
        </button>
        <button
          title="More Options"
          className="p-2 rounded-xl text-text-secondary hover:text-accent hover:bg-background-hover transition-all focus:outline-none"
        >
          <MoreVertical className="w-4.5 h-4.5" />
        </button>
      </div>

    </div>
  );
};

export default ChatHeader;

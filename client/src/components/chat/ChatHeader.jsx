import React from "react";
import { ArrowLeft, Phone, Video, Image as ImageIcon } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import Avatar from "../common/Avatar";
import { formatLastSeen } from "../../utils/dateHelper";

const ChatHeader = () => {
  const currentUser = useAuthStore((state) => state.user);
  const {
    activeConversation,
    setActiveConversation,
    onlineUsers,
    isDetailsOpen,
    setIsDetailsOpen,
  } = useChatStore();

  if (!activeConversation) return null;

  let displayName = "";
  let displayAvatar = "";
  let isOnline = false;
  let statusText = "";
  let otherUser = null;

  if (activeConversation.isGroup) {
    displayName = activeConversation.groupName;
    displayAvatar = activeConversation.groupAvatar;
    statusText = `${activeConversation.participants?.length || 0} members`;
  } else {
    otherUser = activeConversation.participants?.find(
      (p) => p._id !== currentUser?._id
    );
    displayName = otherUser ? otherUser.username : "Unknown User";
    displayAvatar = otherUser ? otherUser.avatar : "";
    isOnline = otherUser ? onlineUsers.includes(otherUser._id) : false;
    statusText = isOnline ? "Online" : formatLastSeen(otherUser?.lastSeen);
  }

  return (
    <div className="flex items-center justify-between px-2 sm:px-4 bg-background-secondary border-b border-border select-none z-20 flex-shrink-0 shadow-sm min-h-[60px]">

      {/* ── Left: Back Arrow + Avatar + Name + Status ── */}
      <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">

        {/* Back Arrow — mobile/tablet only */}
        <button
          onClick={() => setActiveConversation(null)}
          aria-label="Back to chats"
          className="lg:hidden flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-text-secondary hover:text-text-primary active:bg-background-hover transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Avatar + Name + Status (tapping opens details) */}
        <button
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="flex items-center gap-2.5 min-w-0 flex-1 py-1.5 rounded-xl hover:bg-background-hover/40 transition-colors px-1"
        >
          {/* Avatar with online indicator dot */}
          <div className="flex-shrink-0">
            <Avatar
              src={displayAvatar}
              name={displayName}
              size="md"
              showOnline={!activeConversation.isGroup}
              isOnline={isOnline}
            />
          </div>

          {/* Name + Status text */}
          <div className="min-w-0 text-left">
            <h3 className="font-semibold text-text-primary text-sm leading-tight truncate">
              {displayName}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              {/* Coloured status dot for DMs */}
              {!activeConversation.isGroup && (
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    isOnline ? "bg-green-400" : "bg-gray-500"
                  }`}
                />
              )}
              <p
                className={`text-xs leading-none truncate ${
                  isOnline && !activeConversation.isGroup
                    ? "text-green-400 font-medium"
                    : "text-text-secondary"
                }`}
              >
                {statusText}
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* ── Right: Action Buttons ── */}
      <div className="flex items-center gap-0.5 flex-shrink-0 ml-1">
        {/* Phone & Video — hidden on mobile to keep bar clean */}
        <button
          title="Voice Call"
          className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-text-secondary hover:text-accent hover:bg-background-hover transition-colors focus:outline-none"
        >
          <Phone className="w-4 h-4" />
        </button>
        <button
          title="Video Call"
          className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-text-secondary hover:text-accent hover:bg-background-hover transition-colors focus:outline-none"
        >
          <Video className="w-4 h-4" />
        </button>

        {/* Shared Media — always visible on all screen sizes */}
        <button
          title="Shared Media & Details"
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors focus:outline-none ${
            isDetailsOpen
              ? "text-accent bg-accent/15"
              : "text-text-secondary hover:text-accent hover:bg-background-hover"
          }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};

export default ChatHeader;

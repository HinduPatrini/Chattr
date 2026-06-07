import React, { useState } from "react";
import { Check, CheckCheck, X, MoreVertical, Copy, Pin, Trash2 } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useSocketStore } from "../../store/useSocketStore";
import Avatar from "../common/Avatar";
import toast from "react-hot-toast";

const formatMessageTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const MessageBubble = ({ message, isSent, showAvatar = false, isLastInGroup = false }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const activeConversation = useChatStore((state) => state.activeConversation);
  const onlineUsers = useChatStore((state) => state.onlineUsers);
  const currentUser = useAuthStore((state) => state.user);
  
  const { deleteMessage, togglePinMessage } = useChatStore();
  const socket = useSocketStore((state) => state.socket);

  const senderName = message.sender?.username || "Someone";
  const senderAvatar = message.sender?.avatar || "";

  const handleCopy = () => {
    if (!message.text) return;
    navigator.clipboard.writeText(message.text);
    toast.success("Copied to clipboard!");
    setShowMenu(false);
  };

  const handlePin = async () => {
    try {
      const updated = await togglePinMessage(message._id);
      if (socket) {
        socket.emit("message:pin", updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setShowMenu(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMessage(message._id);
      if (socket) {
        socket.emit("message:delete", {
          messageId: message._id,
          conversationId: message.conversationId,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setShowMenu(false);
    }
  };

  // Determine read status for checkmarks
  const getReadStatus = () => {
    if (!isSent || !activeConversation) return null;

    const readBy = message.readBy || [];
    const participants = activeConversation.participants || [];

    // Filter out current user from participants to check others
    const otherParticipants = participants.filter((p) => p._id !== currentUser?._id);
    
    // Check if everyone else has read it
    const otherParticipantsIds = otherParticipants.map((p) => p._id);
    const readByOthers = readBy.filter((uid) => uid !== currentUser?._id);
    
    const isReadByAll = otherParticipantsIds.every((id) => readByOthers.includes(id)) && readByOthers.length > 0;

    if (isReadByAll) {
      return "read";
    }

    // Otherwise, check if "delivered" vs "sent"
    // For DMs: if the other person is online, it is "delivered". Else "sent"
    if (!activeConversation.isGroup) {
      const otherUser = otherParticipants[0];
      if (otherUser && onlineUsers.includes(otherUser._id)) {
        return "delivered";
      }
    } else {
      // For groups, if at least one other participant read it, or if anyone is online, mark as delivered
      if (readByOthers.length > 0) {
        return "delivered";
      }
    }

    return "sent";
  };

  const readStatus = getReadStatus();

  return (
    <div className={`flex w-full ${isSent ? "justify-end" : "justify-start"} items-end gap-2.5`}>
      
      {/* Received Group Chat Avatar */}
      {!isSent && showAvatar && (
        <div className={`flex-shrink-0 ${isLastInGroup ? "opacity-100" : "opacity-0 h-0 w-8"}`}>
          {isLastInGroup && (
            <Avatar src={senderAvatar} name={senderName} size="sm" />
          )}
        </div>
      )}
      
      {/* Spacer when avatar is hidden in consecutive received group messages */}
      {!isSent && !showAvatar && activeConversation?.isGroup && (
        <div className="w-8 flex-shrink-0" />
      )}

      {/* Bubble Box with Hover Actions */}
      <div 
        onMouseLeave={() => setShowMenu(false)}
        className={`relative group flex items-center gap-2 max-w-[70%] sm:max-w-[60%] md:max-w-[50%] ${
          isSent ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div className={`flex flex-col ${isSent ? "items-end" : "items-start"} w-full`}>
          
          {/* Sender Username inside Received Group Chat Bubbles */}
          {!isSent && activeConversation?.isGroup && isLastInGroup && (
            <span className="text-xs text-accent font-medium mb-1 ml-1 select-none">
              {senderName}
            </span>
          )}

          {/* The Actual Bubble Bubble */}
          <div
            className={`px-4 py-2.5 shadow-md flex flex-col gap-1 transition-all duration-150 ${
              isSent
                ? `bg-message-sent text-white rounded-[18px_18px_4px_18px] ${message.isPinned ? "ring-2 ring-accent-light/50 bg-opacity-95" : ""}`
                : `bg-message-received text-text-primary rounded-[18px_18px_18px_4px] ${message.isPinned ? "ring-2 ring-accent/30 bg-background-tertiary" : ""}`
            }`}
          >
            {/* Image Attachment */}
            {message.image && (
              <div className="mb-1 rounded-xl overflow-hidden max-w-[240px] max-h-[240px] border border-white/5 cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
                <img
                  src={message.image}
                  alt="Uploaded media"
                  className="w-full h-full object-cover max-w-full hover:scale-[1.02] transition-transform duration-200"
                />
              </div>
            )}

            {/* Text Message */}
            {message.text && (
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {message.text}
              </p>
            )}

            {/* Timestamp and Status Row */}
            <div className="flex items-center justify-end gap-1.5 self-end mt-0.5 select-none">
              {message.isPinned && (
                <Pin className="w-3 h-3 text-accent rotate-45 mr-0.5 animate-pulse" />
              )}
              <span className={`text-[10px] ${isSent ? "text-white/60" : "text-text-muted font-normal"}`}>
                {formatMessageTime(message.createdAt)}
              </span>
              
              {/* Read status checkmarks (Sent messages only) */}
              {isSent && (
                <span className="flex items-center">
                  {readStatus === "sent" && (
                    <Check className="w-3.5 h-3.5 text-white/55" />
                  )}
                  {readStatus === "delivered" && (
                    <CheckCheck className="w-3.5 h-3.5 text-white/55" />
                  )}
                  {readStatus === "read" && (
                    <CheckCheck className="w-3.5 h-3.5 text-accent-light" />
                  )}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3-dots actions trigger */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center flex-shrink-0">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-full hover:bg-background-hover text-text-muted hover:text-text-primary transition-colors focus:outline-none"
            title="Message options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Dropdown Menu */}
        {showMenu && (
          <div 
            className={`absolute z-30 bg-background-tertiary/95 backdrop-blur-md border border-border/80 shadow-2xl rounded-xl py-1.5 min-w-[130px] animate-fade-in ${
              isSent ? "right-full mr-2" : "left-full ml-2"
            } bottom-2`}
          >
            {message.text && (
              <button
                onClick={handleCopy}
                className="w-full px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-background-hover flex items-center gap-2 transition-colors text-left"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Text</span>
              </button>
            )}
            <button
              onClick={handlePin}
              className="w-full px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-background-hover flex items-center gap-2 transition-colors text-left"
            >
              <Pin className="w-3.5 h-3.5 text-accent" />
              <span>{message.isPinned ? "Unpin Message" : "Pin Message"}</span>
            </button>
            {isSent && (
              <button
                onClick={handleDelete}
                className="w-full px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-background-hover flex items-center gap-2 transition-colors text-left border-t border-border/40 mt-1 pt-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal overlay */}
      {isLightboxOpen && message.image && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center animate-fade-in p-4 cursor-zoom-out"
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
          
          <img
            src={message.image}
            alt="Full-size attachment preview"
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10 select-none cursor-default"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
          />
        </div>
      )}

    </div>
  );
};

export default MessageBubble;

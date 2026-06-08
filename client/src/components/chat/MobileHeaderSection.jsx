import React, { useState } from "react";
import { ArrowLeft, Mail, FileText, Image as ImageIcon, Users, X } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import Avatar from "../common/Avatar";

const MobileHeaderSection = ({ messages }) => {
  const { activeConversation, setActiveConversation, onlineUsers } = useChatStore();
  const currentUser = useAuthStore((state) => state.user);
  const [selectedImage, setSelectedImage] = useState(null);

  if (!activeConversation) return null;

  // Filter messages that contain images
  const mediaMessages = messages.filter((msg) => msg.image);

  let displayName = "";
  let displayAvatar = "";
  let isOnline = false;
  let otherUser = null;

  if (activeConversation.isGroup) {
    displayName = activeConversation.groupName;
    displayAvatar = activeConversation.groupAvatar;
  } else {
    otherUser = activeConversation.participants?.find((p) => p._id !== currentUser?._id);
    displayName = otherUser ? otherUser.username : "Unknown User";
    displayAvatar = otherUser ? otherUser.avatar : "";
    isOnline = otherUser ? onlineUsers.includes(otherUser._id) : false;
  }

  return (
    <>
      <div className="w-full bg-background-secondary border-b border-border flex flex-col p-3 pb-2.5 gap-2 flex-shrink-0 select-none z-20">
        
        {/* Top Row: Back button, Avatar, Name, Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveConversation(null)}
            className="p-1.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-background-hover transition-all focus:outline-none"
            title="Leave Chat"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <Avatar
            src={displayAvatar}
            name={displayName}
            size="sm"
            showOnline={!activeConversation.isGroup}
            isOnline={isOnline}
          />

          <div className="min-w-0">
            <h3 className="font-semibold text-text-primary text-sm truncate leading-tight">
              {displayName}
            </h3>
            <p className={`text-[10px] truncate leading-none mt-0.5 ${isOnline && !activeConversation.isGroup ? "text-online font-medium" : "text-text-secondary"}`}>
              {activeConversation.isGroup 
                ? `${activeConversation.participants?.length || 0} members` 
                : (isOnline ? "Online" : "Offline")
              }
            </p>
          </div>
        </div>

        {/* Info Row: Email / Bio / Members */}
        <div className="text-xs text-text-secondary px-1 flex flex-col gap-1 border-t border-border/40 pt-1.5">
          {!activeConversation.isGroup ? (
            <div className="flex flex-col gap-1">
              {otherUser?.email && (
                <div className="flex items-center gap-2 text-text-muted">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0 text-accent/70" />
                  <span className="truncate text-xs">{otherUser.email}</span>
                </div>
              )}
              <div className="flex items-start gap-2 text-text-muted">
                <FileText className="w-3.5 h-3.5 flex-shrink-0 text-accent/70 mt-0.5" />
                <span className="line-clamp-1 text-xs">{otherUser?.bio || "Hey there! I am using Chattr."}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 text-text-muted">
              <Users className="w-3.5 h-3.5 flex-shrink-0 text-accent/70 mt-0.5" />
              <span className="line-clamp-1 text-xs">
                Members: {activeConversation.participants?.map((p) => p.username).join(", ")}
              </span>
            </div>
          )}
        </div>

        {/* Media Row: Horizontal list of shared images */}
        {mediaMessages.length > 0 && (
          <div className="flex items-center gap-2 border-t border-border/40 pt-1.5">
            <div className="flex-shrink-0 text-text-muted flex items-center pr-1">
              <ImageIcon className="w-3.5 h-3.5 text-accent/70" />
            </div>
            <div className="flex-1 flex overflow-x-auto gap-2 py-0.5 scrollbar-none">
              {mediaMessages.map((msg) => (
                <div
                  key={msg._id}
                  onClick={() => setSelectedImage(msg.image)}
                  className="w-10 h-10 rounded-lg overflow-hidden border border-border flex-shrink-0 bg-background-tertiary cursor-zoom-in hover:border-accent/40 transition-colors"
                >
                  <img
                    src={msg.image}
                    alt="Shared"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center animate-fade-in p-4 cursor-zoom-out"
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={selectedImage}
            alt="Full-size media"
            className="max-w-full max-h-[88vh] object-contain rounded-xl shadow-2xl border border-white/10 select-none cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default MobileHeaderSection;

import React, { useState } from "react";
import {
  Image as ImageIcon,
  Mail,
  FileText,
  Shield,
  Users,
  X,
  ArrowLeft,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import Avatar from "../common/Avatar";
import { formatLastSeen } from "../../utils/dateHelper";

const ConversationDetailsPanel = ({ messages }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const currentUser = useAuthStore((state) => state.user);
  const { activeConversation, onlineUsers, setIsDetailsOpen } = useChatStore();

  if (!activeConversation) return null;

  // Filter messages that contain images
  const mediaMessages = messages.filter((msg) => msg.image);

  // DM participant details
  let otherUser = null;
  let isOnline = false;

  if (!activeConversation.isGroup) {
    otherUser = activeConversation.participants?.find(
      (p) => p._id !== currentUser?._id
    );
    isOnline = otherUser ? onlineUsers.includes(otherUser._id) : false;
  }

  return (
    <>
      {/* ── Panel ── */}
      <div className="w-full h-full border-l border-border bg-background-secondary flex flex-col">

        {/* Header */}
        <div className="h-16 border-b border-border flex items-center gap-3 px-5 flex-shrink-0 bg-background-tertiary">
          {/* Back Button on Mobile/Tablet */}
          <button
            onClick={() => setIsDetailsOpen(false)}
            className="xl:hidden p-2 -ml-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-background-hover transition-all focus:outline-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-text-primary text-sm tracking-wide uppercase">
            {activeConversation.isGroup ? "Group Info" : "Contact Info"}
          </span>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin flex flex-col divide-y divide-border/50">

          {/* ── Avatar + Name ── */}
          <div className="p-6 flex flex-col items-center text-center gap-3">
            {activeConversation.isGroup ? (
              <>
                <Avatar
                  src={activeConversation.groupAvatar}
                  name={activeConversation.groupName}
                  size="xl"
                />
                <div>
                  <h3 className="font-bold text-text-primary text-base">
                    {activeConversation.groupName}
                  </h3>
                  <span className="text-xs text-accent bg-accent/10 px-2.5 py-0.5 rounded-full inline-block mt-1 font-medium">
                    Group Chat
                  </span>
                </div>
              </>
            ) : (
              <>
                <Avatar
                  src={otherUser?.avatar}
                  name={otherUser?.username || "Unknown"}
                  size="xl"
                  showOnline={true}
                  isOnline={isOnline}
                />
                <div>
                  <h3 className="font-bold text-text-primary text-base">
                    {otherUser?.username || "Unknown User"}
                  </h3>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full inline-block mt-1 font-medium ${
                      isOnline
                        ? "text-online bg-online/10"
                        : "text-text-secondary bg-background-tertiary"
                    }`}
                  >
                    {isOnline ? "Online" : formatLastSeen(otherUser?.lastSeen)}
                  </span>
                </div>
              </>
            )}
          </div>


          {/* ── Metadata ── */}
          <div className="p-4 space-y-4">
            {!activeConversation.isGroup ? (
              <>
                <InfoRow icon={<Mail className="w-4 h-4 text-accent" />} label="Email">
                  {otherUser?.email || "—"}
                </InfoRow>
                <InfoRow icon={<FileText className="w-4 h-4 text-accent" />} label="Bio">
                  {otherUser?.bio || "Hey there! I am using Chattr."}
                </InfoRow>
              </>
            ) : (
              <>
                <InfoRow icon={<Shield className="w-4 h-4 text-accent" />} label="Admin">
                  {activeConversation.participants?.find(
                    (p) => p._id === activeConversation.admin
                  )?.username || "—"}
                </InfoRow>

                {/* Member list */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Users className="w-4 h-4 text-accent" />
                    <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">
                      Members ({activeConversation.participants?.length || 0})
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto scrollbar-thin pr-1">
                    {activeConversation.participants?.map((member) => {
                      const online = onlineUsers.includes(member._id);
                      return (
                        <div
                          key={member._id}
                          className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-background-hover/50 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Avatar src={member.avatar} name={member.username} size="sm" />
                            <span className="text-xs text-text-secondary font-medium truncate">
                              {member.username}
                            </span>
                          </div>
                          {online && (
                            <span className="w-2 h-2 rounded-full bg-online flex-shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── Shared Media ── */}
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3 select-none">
              <div className="flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-accent" />
                <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">
                  Shared Media
                </span>
              </div>
              <span className="text-xs text-text-muted bg-background-hover px-2 py-0.5 rounded-full font-bold">
                {mediaMessages.length}
              </span>
            </div>

            {mediaMessages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8 select-none">
                <ImageIcon className="w-9 h-9 text-text-muted opacity-40 mb-2" />
                <p className="text-xs text-text-muted">No shared media yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1.5">
                {mediaMessages.map((msg) => (
                  <div
                    key={msg._id}
                    onClick={() => setSelectedImage(msg.image)}
                    className="aspect-square rounded-md overflow-hidden border border-border bg-background-tertiary cursor-zoom-in group relative hover:border-accent/40 transition-all duration-200"
                  >
                    <img
                      src={msg.image}
                      alt="Shared media"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Lightbox ── */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center animate-fade-in p-4 cursor-zoom-out"
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

// ── Helper: Info row ──────────────────────────────────────────────────────────
const InfoRow = ({ icon, label, children }) => (
  <div className="flex gap-3">
    <div className="mt-0.5 flex-shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold">{label}</p>
      <p className="text-xs text-text-secondary mt-0.5 break-words">{children}</p>
    </div>
  </div>
);

export default ConversationDetailsPanel;

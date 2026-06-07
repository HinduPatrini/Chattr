import React from "react";
import { useChatStore } from "../../store/useChatStore";
import Avatar from "../common/Avatar";

const TypingIndicator = ({ typingUser }) => {
  const activeConversation = useChatStore((state) => state.activeConversation);

  if (!typingUser) return null;

  // Look up typing user's avatar from active conversation participants
  const typingParticipant = activeConversation?.participants?.find(
    (p) => p._id === typingUser.userId
  );
  const typingAvatar = typingParticipant ? typingParticipant.avatar : "";
  const typingName = typingUser.username || "Someone";

  return (
    <div className="flex items-center gap-3 px-6 py-2 bg-gradient-to-t from-background-primary to-transparent select-none z-10 flex-shrink-0 animate-fade-in">
      
      {/* Typing User Avatar */}
      <Avatar src={typingAvatar} name={typingName} size="sm" />

      {/* Typing Bubble */}
      <div className="flex flex-col">
        {/* Bouncing Dots Bubble */}
        <div className="flex items-center gap-1.5 bg-message-received px-4 py-2.5 rounded-[18px_18px_18px_4px] shadow-sm max-w-[80px]">
          <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce1" />
          <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce2" />
          <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce3" />
        </div>
        
        {/* Typing Notification Text Label */}
        <span className="text-[10px] text-text-secondary mt-1 ml-1 font-medium">
          {typingName} is typing...
        </span>
      </div>

    </div>
  );
};

export default TypingIndicator;

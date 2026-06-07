import React, { useRef, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import MessageBubble from "./MessageBubble";

const MessageList = () => {
  const currentUser = useAuthStore((state) => state.user);
  const { messages, isLoadingMessages, activeConversation } = useChatStore();

  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Autoscroll to bottom on initial message load or when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      // Use instant scroll for first fetch, smooth scroll for increments
      const scrollBehavior = messages.length <= 15 ? "auto" : "smooth";
      scrollToBottom(scrollBehavior);
    }
  }, [messages.length, activeConversation?._id]);

  // Monitor scroll height to toggle the floating bottom arrow button
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    
    // User is more than 200px away from the bottom of the container
    const isFarFromBottom = scrollHeight - scrollTop - clientHeight > 200;
    setShowScrollBtn(isFarFromBottom);
  };

  // Group messages by their dates to render dividers
  const groupMessagesByDate = () => {
    const groupedList = [];
    let lastDateString = null;

    messages.forEach((msg, idx) => {
      const msgDate = new Date(msg.createdAt || new Date());
      const dateString = msgDate.toDateString();

      // If the date changes, insert a date separator row
      if (dateString !== lastDateString) {
        lastDateString = dateString;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toDateString();
        const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toDateString();

        let dateLabel = "";
        if (dateString === today) {
          dateLabel = "Today";
        } else if (dateString === yesterday) {
          dateLabel = "Yesterday";
        } else {
          dateLabel = msgDate.toLocaleDateString([], {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        }

        groupedList.push({
          type: "separator",
          label: dateLabel,
          key: `sep-${msg._id || idx}-${dateString}`,
        });
      }

      // Add message details along with its position info in the stream
      const currentSender = msg.sender?._id || msg.sender;
      const isSent = currentSender === currentUser?._id;
      
      const nextMsg = messages[idx + 1];
      const nextSender = nextMsg?.sender?._id || nextMsg?.sender;
      const prevMsg = messages[idx - 1];
      const prevSender = prevMsg?.sender?._id || prevMsg?.sender;

      // Has date changed from previous message?
      const isDateChangedFromPrev = prevMsg && new Date(prevMsg.createdAt).toDateString() !== dateString;

      const isLastInGroup = !nextMsg || nextSender !== currentSender;
      const isSameAsPrev = prevMsg && prevSender === currentSender && !isDateChangedFromPrev;

      groupedList.push({
        type: "message",
        data: msg,
        isSent,
        isLastInGroup,
        isSameAsPrev,
        showAvatar: activeConversation?.isGroup && !isSent,
        key: msg._id || `msg-${idx}`,
      });
    });

    return groupedList;
  };

  // Display Skeleton View when fetching
  if (isLoadingMessages) {
    return (
      <div className="h-full w-full flex flex-col p-4 gap-4 overflow-y-auto select-none">
        {[...Array(4)].map((_, i) => {
          const isRight = i % 2 === 1;
          return (
            <div
              key={i}
              className={`flex items-end gap-3 max-w-[70%] animate-pulse ${
                isRight ? "self-end flex-row-reverse" : "self-start flex-row"
              }`}
            >
              {!isRight && <div className="w-8 h-8 rounded-full bg-background-hover flex-shrink-0" />}
              <div className="space-y-1.5 flex flex-col items-start">
                <div
                  className={`h-12 w-48 rounded-2xl bg-background-hover ${
                    isRight ? "rounded-br-sm" : "rounded-bl-sm"
                  }`}
                />
                <div className="h-3 w-12 bg-background-hover rounded" />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Display Empty Message view
  if (messages.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-16 h-16 rounded-full bg-background-hover flex items-center justify-center mb-4 text-text-muted">
          <ChevronDown className="w-8 h-8 animate-bounce" />
        </div>
        <h3 className="text-text-primary font-semibold text-lg mb-1">No messages yet</h3>
        <p className="text-text-secondary text-sm max-w-[240px]">
          Type a message below to start this conversation!
        </p>
      </div>
    );
  }

  const groupedElements = groupMessagesByDate();

  return (
    <div className="h-full w-full relative">
      {/* Scrollable Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-auto px-4 py-3 flex flex-col gap-1.5 scrollbar-thin"
      >
        {groupedElements.map((elem) => {
          if (elem.type === "separator") {
            return (
              <div key={elem.key} className="flex justify-center select-none">
                <span className="text-xs text-text-secondary bg-background-tertiary px-3.5 py-1 rounded-full my-4 border border-border">
                  {elem.label}
                </span>
              </div>
            );
          }

          // Render Message Bubble
          const gapClass = elem.isSameAsPrev ? "mt-0.5" : "mt-3";

          return (
            <div key={elem.key} id={`msg-${elem.data._id}`} className={`${gapClass}`}>
              <MessageBubble
                message={elem.data}
                isSent={elem.isSent}
                showAvatar={elem.showAvatar}
                isLastInGroup={elem.isLastInGroup}
              />
            </div>
          );
        })}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} className="h-1 flex-shrink-0" />
      </div>

      {/* Floating Scroll to Bottom Button */}
      {showScrollBtn && (
        <button
          onClick={() => scrollToBottom("smooth")}
          className="absolute bottom-4 right-4 p-2.5 rounded-full bg-accent hover:bg-accent-hover text-white shadow-lg shadow-black/40 border border-white/10 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none z-20"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default MessageList;

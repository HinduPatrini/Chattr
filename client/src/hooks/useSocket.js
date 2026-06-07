import { useEffect, useState, useRef } from "react";
import { useSocketStore } from "../store/useSocketStore";
import { useChatStore } from "../store/useChatStore";

export const useSocket = () => {
  const socket = useSocketStore((state) => state.socket);
  const activeConversation = useChatStore((state) => state.activeConversation);
  const [typingUser, setTypingUser] = useState(null);
  const prevActiveIdRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    // Join/leave rooms on active conversation change
    const prevId = prevActiveIdRef.current;
    const currentId = activeConversation?._id;

    if (prevId && prevId !== currentId) {
      socket.emit("conversation:leave", prevId);
    }

    if (currentId) {
      socket.emit("conversation:join", currentId);
      prevActiveIdRef.current = currentId;
    } else {
      prevActiveIdRef.current = null;
    }
  }, [activeConversation, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleTypingStart = ({ userId, username }) => {
      // Only set if we are in the active conversation
      setTypingUser({ userId, username });
    };

    const handleTypingStop = ({ userId }) => {
      setTypingUser((prev) => (prev && prev.userId === userId ? null : prev));
    };

    const handleMessageRead = ({ conversationId, userId }) => {
      // Update read receipts in the messages in useChatStore
      useChatStore.setState((state) => {
        const updatedMessages = state.messages.map((msg) => {
          if (msg.conversationId === conversationId) {
            const readBy = msg.readBy || [];
            if (!readBy.includes(userId)) {
              return { ...msg, readBy: [...readBy, userId] };
            }
          }
          return msg;
        });

        // Also update conversations lastMessage read receipts if it matches
        const updatedConversations = state.conversations.map((conv) => {
          if (conv._id === conversationId && conv.lastMessage) {
            const readBy = conv.lastMessage.readBy || [];
            if (!readBy.includes(userId)) {
              return {
                ...conv,
                lastMessage: {
                  ...conv.lastMessage,
                  readBy: [...readBy, userId],
                },
              };
            }
          }
          return conv;
        });

        return { messages: updatedMessages, conversations: updatedConversations };
      });
    };

    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);
    socket.on("message:read", handleMessageRead);

    return () => {
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
      socket.off("message:read", handleMessageRead);
    };
  }, [socket, activeConversation]);

  // When active conversation changes, reset typing indicator
  useEffect(() => {
    setTypingUser(null);
  }, [activeConversation]);

  return { typingUser };
};

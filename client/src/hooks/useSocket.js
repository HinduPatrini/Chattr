import { useEffect, useState, useRef } from "react";
import { useSocketStore } from "../store/useSocketStore";
import { useChatStore } from "../store/useChatStore";

export const useSocket = () => {
  const socket = useSocketStore((state) => state.socket);
  const activeConversation = useChatStore((state) => state.activeConversation);
  const [typingUser, setTypingUser] = useState(null);
  const prevActiveIdRef = useRef(null);

  // Join/leave conversation rooms when active conversation changes
  useEffect(() => {
    if (!socket) return;

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

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleTypingStart = ({ userId, username }) => {
      setTypingUser({ userId, username });
    };

    const handleTypingStop = ({ userId }) => {
      setTypingUser((prev) => (prev?.userId === userId ? null : prev));
    };

    const handleMessageRead = ({ conversationId, userId }) => {
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

        return {
          messages: updatedMessages,
          conversations: updatedConversations,
        };
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

  // Reset typing indicator when conversation changes
  useEffect(() => {
    setTypingUser(null);
  }, [activeConversation]);

  return { typingUser };
};
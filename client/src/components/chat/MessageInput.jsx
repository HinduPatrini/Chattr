import React, { useState, useRef, useEffect } from "react";
import { Paperclip, SendHorizontal, X } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { useSocketStore } from "../../store/useSocketStore";
import Loader from "../common/Loader";
import toast from "react-hot-toast";

const MessageInput = () => {
  const currentUser = useAuthStore((state) => state.user);
  const { activeConversation, sendMessage } = useChatStore();
  const socket = useSocketStore((state) => state.socket);

  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSending, setIsSending] = useState(false);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef(null);

  // Auto-grow textarea height up to max-h-32
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
    }
  }, [text]);

  // Emit typing:stop when user changes conversation
  useEffect(() => {
    return () => {
      stopTyping();
    };
  }, [activeConversation?._id]);

  const stopTyping = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (isTypingRef.current && socket && activeConversation?._id && currentUser?._id) {
      socket.emit("typing:stop", {
        conversationId: activeConversation._id,
        userId: currentUser._id,
      });
    }
    isTypingRef.current = false;
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setText(val);

    if (!socket || !activeConversation?._id || !currentUser?._id) return;

    // Trigger typing:start if not currently typing
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit("typing:start", {
        conversationId: activeConversation._id,
        userId: currentUser._id,
        username: currentUser.username,
      });
    }

    // Reset stop typing timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    // Limit image size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSending || (!text.trim() && !imageFile)) return;

    setIsSending(true);
    stopTyping();

    try {
      const formData = new FormData();
      formData.append("conversationId", activeConversation._id);
      if (text.trim()) {
        formData.append("text", text.trim());
      }
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const newMsg = await sendMessage(formData);

      // Notify other participants via socket
      if (socket) {
        socket.emit("message:send", newMsg);
      }

      // Reset values
      setText("");
      handleRemoveImage();
      
      // Focus back to input
      textareaRef.current?.focus();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-background-secondary border-t border-border p-4 select-none flex-shrink-0 z-10">
      
      {/* Selected Image Preview Box */}
      {imagePreview && (
        <div className="relative inline-block mb-3 border border-border bg-background-tertiary rounded-xl p-1.5 animate-fade-in group">
          <img
            src={imagePreview}
            alt="Selected thumbnail"
            className="w-16 h-16 object-cover rounded-lg"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md transition-colors focus:outline-none"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Input Row */}
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        {/* Hidden Attachment input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isSending}
        />

        {/* Paperclip Button */}
        <button
          type="button"
          disabled={isSending}
          onClick={() => fileInputRef.current?.click()}
          className="p-3.5 rounded-xl bg-background-tertiary border border-border text-text-secondary hover:text-accent hover:border-accent/40 active:scale-95 transition-all focus:outline-none disabled:opacity-50"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Text Box */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          disabled={isSending}
          className="flex-1 bg-background-tertiary text-text-primary placeholder:text-text-muted text-sm rounded-2xl px-4 py-3.5 border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-200 resize-none max-h-32 overflow-y-auto scrollbar-none"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={isSending || (!text.trim() && !imageFile)}
          className="p-3.5 rounded-xl bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20 disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed hover:scale-[1.03] active:scale-95 transition-all focus:outline-none"
        >
          {isSending ? <Loader className="w-5 h-5" /> : <SendHorizontal className="w-5 h-5" />}
        </button>
      </form>

    </div>
  );
};

export default MessageInput;

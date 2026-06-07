import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import axiosInstance from "../../api/axios";
import { useChatStore } from "../../store/useChatStore";
import Avatar from "../common/Avatar";
import Loader from "../common/Loader";
import toast from "react-hot-toast";

const NewChatModal = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { createConversation, setActiveConversation } = useChatStore();

  // Handle animate scale-95 opacity-0 -> scale-100 opacity-100 on mount
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Debounce search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const response = await axiosInstance.get(`/users/search?query=${encodeURIComponent(query)}`);
        setResults(response.data);
      } catch (err) {
        console.error("NewChatModal search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelectUser = async (user) => {
    try {
      const conv = await createConversation(user._id);
      setActiveConversation(conv);
      toast.success(`Chat started with ${user.username}!`);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay Background */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Card Body */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-background-secondary rounded-2xl border border-border shadow-2xl shadow-black/80 w-full max-w-md p-6 relative z-10 transform transition-all duration-300 ${
          isMounted ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-text-primary">New Message</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-hover transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Field */}
        <div className="relative flex items-center mb-4">
          <div className="absolute left-3.5 text-text-muted pointer-events-none">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            placeholder="Search users by username or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-background-tertiary text-text-primary placeholder:text-text-muted text-sm rounded-xl pl-10 pr-10 py-2.5 border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-200"
          />
          {isLoading && (
            <div className="absolute right-3.5">
              <Loader className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-64 overflow-y-auto scrollbar-thin space-y-1.5">
          {query.trim() === "" ? (
            <div className="text-center py-8 text-sm text-text-secondary">
              Type a username or email to search for people.
            </div>
          ) : results.length > 0 ? (
            results.map((u) => (
              <div
                key={u._id}
                onClick={() => handleSelectUser(u)}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-background-hover cursor-pointer transition-all duration-200"
              >
                <Avatar
                  src={u.avatar}
                  name={u.username}
                  size="sm"
                  showOnline={true}
                  isOnline={u.isOnline}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">
                    {u.username}
                  </p>
                  <p className="text-xs text-text-secondary truncate">
                    {u.email}
                  </p>
                </div>
              </div>
            ))
          ) : (
            !isLoading && (
              <div className="text-center py-8 text-sm text-text-secondary">
                No users found.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;

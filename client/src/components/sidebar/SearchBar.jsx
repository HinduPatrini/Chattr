import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import axiosInstance from "../../api/axios";
import { useChatStore } from "../../store/useChatStore";
import Avatar from "../common/Avatar";
import Loader from "../common/Loader";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const containerRef = useRef(null);
  
  const { createConversation, setActiveConversation } = useChatStore();

  // Debounce query search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const response = await axiosInstance.get(`/users/search?query=${encodeURIComponent(query)}`);
        setResults(response.data);
        setShowDropdown(true);
      } catch (error) {
        console.error("Search users error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Click outside to close results dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectUser = async (userId) => {
    try {
      const conv = await createConversation(userId);
      setActiveConversation(conv);
      setQuery("");
      setShowDropdown(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full z-20">
      
      {/* Search Input Container */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-text-muted pointer-events-none">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search users to start chatting..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setShowDropdown(true)}
          className="w-full bg-background-tertiary text-text-primary placeholder:text-text-muted text-sm rounded-xl pl-10 pr-10 py-2.5 border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-200"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setShowDropdown(false);
            }}
            className="absolute right-3 text-text-muted hover:text-text-secondary focus:outline-none transition-colors"
          >
            {isLoading ? <Loader className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background-secondary border border-border rounded-xl shadow-2xl shadow-black/80 max-h-64 overflow-y-auto overflow-x-hidden scrollbar-thin">
          {results.length > 0 ? (
            <div className="p-1.5 space-y-0.5">
              {results.map((u) => (
                <div
                  key={u._id}
                  onClick={() => handleSelectUser(u._id)}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-background-hover cursor-pointer transition-all duration-200"
                >
                  <Avatar src={u.avatar} name={u.username} size="sm" showOnline={true} isOnline={u.isOnline} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">{u.username}</p>
                    <p className="text-xs text-text-secondary truncate">{u.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-text-secondary">
              No users found matching "{query}"
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default SearchBar;

import React, { useState, useEffect, useRef } from "react";
import { X, Camera, Search, User } from "lucide-react";
import axiosInstance from "../../api/axios";
import { useChatStore } from "../../store/useChatStore";
import Avatar from "../common/Avatar";
import Loader from "../common/Loader";
import toast from "react-hot-toast";

const CreateGroupModal = ({ onClose }) => {
  const [groupName, setGroupName] = useState("");
  
  // Member Search States
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Avatar Upload States
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const fileInputRef = useRef(null);

  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createGroup, setActiveConversation } = useChatStore();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Debounce member search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const response = await axiosInstance.get(`/users/search?query=${encodeURIComponent(query)}`);
        // Filter out users already selected
        const filtered = response.data.filter(
          (u) => !selectedMembers.some((m) => m._id === u._id)
        );
        setResults(filtered);
      } catch (err) {
        console.error("Group member search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query, selectedMembers]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Avatar size must be under 5MB.");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAddMember = (user) => {
    setSelectedMembers([...selectedMembers, user]);
    setQuery("");
    setResults([]);
  };

  const handleRemoveMember = (userId) => {
    setSelectedMembers(selectedMembers.filter((m) => m._id !== userId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || selectedMembers.length < 2) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", groupName.trim());
      
      // Append each member ID individually to key 'members'
      selectedMembers.forEach((member) => {
        formData.append("members", member._id);
      });

      if (avatarFile) {
        formData.append("groupAvatar", avatarFile);
      }

      const newGroup = await createGroup(formData);
      setActiveConversation(newGroup);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Card Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-background-secondary rounded-2xl border border-border shadow-2xl shadow-black/80 w-full max-w-md p-6 relative z-10 transform transition-all duration-300 ${
          isMounted ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-text-primary">Create Group</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-hover transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center space-y-1">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-16 h-16 rounded-full overflow-hidden group cursor-pointer border-2 border-dashed border-border hover:border-accent flex items-center justify-center transition-all bg-background-tertiary"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Group Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-5 h-5 text-text-muted group-hover:text-text-secondary transition-colors" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
            <span className="text-xs text-text-secondary">Group Icon</span>
          </div>

          {/* Group Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Group Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. The Cool Club"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full bg-background-tertiary text-text-primary placeholder:text-text-muted text-sm rounded-xl px-4 py-2.5 border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-200"
            />
          </div>

          {/* Member Selection Chips */}
          {selectedMembers.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Members ({selectedMembers.length})
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-background-tertiary rounded-xl border border-border">
                {selectedMembers.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center gap-1.5 bg-background-hover border border-border rounded-full pl-1.5 pr-1 py-0.5 text-xs text-text-primary"
                  >
                    <Avatar src={member.avatar} name={member.username} size="sm" className="w-4 h-4" />
                    <span className="max-w-[70px] truncate">{member.username}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member._id)}
                      className="p-0.5 rounded-full hover:bg-background-tertiary text-text-secondary hover:text-red-400 focus:outline-none transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Members Input */}
          <div className="space-y-1.5 relative">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Add Members (Min 2)
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-text-muted">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search by username or email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-background-tertiary text-text-primary placeholder:text-text-muted text-sm rounded-xl pl-9 pr-4 py-2.5 border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-200"
              />
            </div>

            {/* Live Search Results Dropdown */}
            {query.trim() !== "" && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-background-tertiary border border-border rounded-xl shadow-2xl max-h-40 overflow-y-auto z-35 space-y-0.5 p-1">
                {isSearching ? (
                  <div className="flex justify-center p-4">
                    <Loader className="w-4 h-4" />
                  </div>
                ) : results.length > 0 ? (
                  results.map((u) => (
                    <div
                      key={u._id}
                      onClick={() => handleAddMember(u)}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-background-hover cursor-pointer transition-colors"
                    >
                      <Avatar src={u.avatar} name={u.username} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-text-primary truncate">{u.username}</p>
                        <p className="text-[10px] text-text-secondary truncate">{u.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 text-xs text-text-secondary">
                    No matching users found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !groupName.trim() || selectedMembers.length < 2}
            className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3.5 mt-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            {isSubmitting ? (
              <>
                <Loader />
                <span>Creating group...</span>
              </>
            ) : (
              <span>Create Group ({selectedMembers.length + 1} Members)</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;

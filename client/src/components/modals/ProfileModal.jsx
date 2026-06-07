import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Camera, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useSocketStore } from "../../store/useSocketStore";
import Avatar from "../common/Avatar";
import Loader from "../common/Loader";
import toast from "react-hot-toast";

const ProfileModal = ({ onClose }) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { updateProfile, logout, isLoading } = useAuthStore();
  const disconnectSocket = useSocketStore((state) => state.disconnectSocket);

  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const fileInputRef = useRef(null);

  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

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

    setAvatarRemoved(false);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleRemoveAvatar = (e) => {
    e.stopPropagation(); // Avoid opening file dialog
    setAvatarRemoved(true);
    setAvatarFile(null);
    setAvatarPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("username", username.trim());
      formData.append("bio", bio.trim());
      formData.append("removeAvatar", avatarRemoved ? "true" : "false");
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await updateProfile(formData);
      onClose(); // Close modal on success
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoutClick = async () => {
    try {
      disconnectSocket();
      await logout();
      navigate("/auth");
      toast.success("See you soon!");
      onClose();
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("An error occurred during logout.");
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
          <h3 className="text-lg font-bold text-text-primary">Profile Details</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-hover transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Avatar Upload Preview */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative group">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-20 h-20 rounded-full overflow-hidden cursor-pointer ring-4 ring-accent/30 group-hover:ring-accent/70 transition-all duration-200"
              >
                <Avatar
                  src={avatarPreview}
                  name={username}
                  size="xl"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>

              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="absolute -top-1 -right-1 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md transition-colors focus:outline-none z-10"
                  title="Remove photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
              disabled={isLoading || isSaving}
            />
            <span className="text-xs text-text-secondary">Tap photo to update</span>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading || isSaving}
                className="w-full bg-background-tertiary text-text-primary text-sm rounded-xl px-4 py-2.5 border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-200"
              />
            </div>

            {/* Bio Field with Char Counter */}
            <div className="space-y-1.5 relative">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Bio (Max 150 chars)
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={150}
                disabled={isLoading || isSaving}
                rows={3}
                placeholder="Write something about yourself..."
                className="w-full bg-background-tertiary text-text-primary placeholder:text-text-muted text-sm rounded-xl px-4 py-2.5 pb-8 border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-200 resize-none"
              />
              <span className="text-[10px] text-text-muted absolute bottom-2.5 right-3 select-none">
                {bio.length}/150
              </span>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={isLoading || isSaving || !username.trim()}
              className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              {isSaving ? (
                <>
                  <Loader />
                  <span>Saving changes...</span>
                </>
              ) : (
                <span>Save Profile</span>
              )}
            </button>
          </form>

          {/* Divider Line */}
          <div className="h-px bg-border w-full my-4" />

          {/* Logout Button */}
          <button
            onClick={handleLogoutClick}
            disabled={isLoading || isSaving}
            className="w-full border border-red-500/50 text-red-400 hover:bg-red-500/10 active:scale-[0.99] rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;

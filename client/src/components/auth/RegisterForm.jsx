import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Camera, X } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useSocketStore } from "../../store/useSocketStore";
import Loader from "../common/Loader";
import toast from "react-hot-toast";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const connectSocket = useSocketStore((state) => state.connectSocket);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB.");
      return;
    }

    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  const handleRemoveAvatar = (e) => {
    e.stopPropagation(); // Avoid triggering file selection
    setAvatarFile(null);
    setAvatarPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) return;

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username.trim());
      formData.append("email", email.trim());
      formData.append("password", password);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const user = await register(formData);
      if (user && user._id) {
        connectSocket(user._id);
        navigate("/chat");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Avatar Upload */}
      <div className="flex flex-col items-center justify-center space-y-2 mb-2">
        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
          <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-accent/30 group-hover:ring-accent/70 transition-all duration-200 bg-background-tertiary flex items-center justify-center">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-text-muted" />
            )}
          </div>
          
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Camera className="w-6 h-6 text-white" />
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
          disabled={isLoading}
        />
        <span className="text-xs text-text-secondary">Upload Profile Photo</span>
      </div>

      {/* Username Input */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-text-secondary">Username</label>
        <div className="relative flex items-center">
          <div className="absolute left-4 text-text-muted pointer-events-none">
            <User className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="john_doe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            required
            className="w-full bg-background-tertiary border border-border rounded-xl pl-12 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-200"
          />
        </div>
      </div>

      {/* Email Input */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-text-secondary">Email Address</label>
        <div className="relative flex items-center">
          <div className="absolute left-4 text-text-muted pointer-events-none">
            <Mail className="w-5 h-5" />
          </div>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            className="w-full bg-background-tertiary border border-border rounded-xl pl-12 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-200"
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-text-secondary">Password</label>
        <div className="relative flex items-center">
          <div className="absolute left-4 text-text-muted pointer-events-none">
            <Lock className="w-5 h-5" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="•••••••• (Min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            className="w-full bg-background-tertiary border border-border rounded-xl pl-12 pr-12 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            className="absolute right-4 text-text-muted hover:text-text-secondary focus:outline-none transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !username.trim() || !email.trim() || !password.trim()}
        className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3.5 mt-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
      >
        {isLoading ? (
          <>
            <Loader />
            <span>Creating account...</span>
          </>
        ) : (
          <span>Create Account</span>
        )}
      </button>
    </form>
  );
};

export default RegisterForm;

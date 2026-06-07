import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useSocketStore } from "../../store/useSocketStore";
import Loader from "../common/Loader";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const connectSocket = useSocketStore((state) => state.connectSocket);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    try {
      const user = await login(email, password);
      if (user && user._id) {
        connectSocket(user._id);
        navigate("/chat");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-text-secondary">Password</label>
          <button
            type="button"
            className="text-xs text-accent-light hover:underline font-medium focus:outline-none"
            onClick={(e) => e.preventDefault()}
          >
            Forgot password?
          </button>
        </div>
        <div className="relative flex items-center">
          <div className="absolute left-4 text-text-muted pointer-events-none">
            <Lock className="w-5 h-5" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
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
        disabled={isLoading || !email.trim() || !password.trim()}
        className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
      >
        {isLoading ? (
          <>
            <Loader />
            <span>Signing in...</span>
          </>
        ) : (
          <span>Sign In</span>
        )}
      </button>
    </form>
  );
};

export default LoginForm;

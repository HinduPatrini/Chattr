import React from "react";
import { MessageCircle } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-background-primary flex flex-col items-center justify-center z-50 select-none">

      {/* Ambient glow blobs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-accent-light/5 rounded-full blur-3xl pointer-events-none" />

      {/* Logo + spinner stack */}
      <div className="relative flex flex-col items-center gap-8 z-10">

        {/* Spinning ring around icon */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Outer spinning ring */}
          <svg
            className="absolute inset-0 w-full h-full animate-spin"
            style={{ animationDuration: "2.2s" }}
            viewBox="0 0 96 96"
            fill="none"
          >
            <circle
              cx="48"
              cy="48"
              r="44"
              stroke="url(#spinGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="138 138"
              strokeDashoffset="110"
            />
            <defs>
              <linearGradient id="spinGrad" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity="0" />
                <stop offset="60%" stopColor="#7C3AED" stopOpacity="1" />
                <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>

          {/* Icon background */}
          <div className="w-16 h-16 rounded-2xl bg-background-secondary border border-border shadow-2xl flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-accent" />
          </div>
        </div>

        {/* Brand name */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-3xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent tracking-tight">
            Chattr
          </span>
          <span className="text-sm text-text-muted font-medium tracking-widest uppercase">
            Initializing…
          </span>
        </div>

        {/* Three-dot pulse */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>

    </div>
  );
};

export default LoadingScreen;

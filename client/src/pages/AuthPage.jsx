import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login"); // "login" | "register"

  return (
    <div className="min-h-screen w-full bg-background-primary flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      {/* Container holding left panel (branding) & right panel (form) */}
      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-background-secondary rounded-2xl border border-border shadow-2xl overflow-hidden min-h-[600px]">
        
        {/* Left Side: Decorative Branding Panel (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-accent/25 via-background-secondary to-background-primary relative overflow-hidden select-none border-r border-border">
          {/* Subtle background glow bubbles */}
          <div className="absolute top-1/4 -left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-accent-light/10 rounded-full blur-3xl" />
          
          {/* Brand header */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent tracking-tight">Chattr</span>
          </div>

          {/* Decorative floating bubbles & tagline */}
          <div className="my-auto relative z-10 space-y-8">
            <div className="space-y-3">
              <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Connect. Chat.<br />
                <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">Vibe.</span>
              </h1>
              <p className="text-text-secondary text-lg max-w-sm">
                A premium space designed for seamless, secure, and beautiful real-time conversations.
              </p>
            </div>

            {/* Glassmorphic floating bubble decoration */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-black/30 backdrop-blur-md border border-white/10 p-4 rounded-[18px_18px_18px_4px] max-w-xs shadow-xl animate-bounce1">
                <span className="text-sm text-text-primary">Hey, did you check the new Chattr update? 💬</span>
              </div>
              <div className="flex items-start gap-3 bg-accent/20 backdrop-blur-md border border-accent/20 p-4 rounded-[18px_18px_4px_18px] max-w-xs shadow-xl self-end ml-16 animate-bounce2">
                <span className="text-sm text-white font-medium">It looks absolutely stunning! 💜</span>
              </div>
            </div>
          </div>

          {/* Bottom text info */}
          <div className="text-text-muted text-xs relative z-10">
            © {new Date().getFullYear()} Chattr Inc. All rights reserved.
          </div>
        </div>

        {/* Right Side: Auth Card Form Panel */}
        <div className="flex flex-col justify-center p-8 md:p-12 w-full">
          <div className="w-full max-w-md mx-auto space-y-8">
            
            {/* Logo and Brand header for Mobile */}
            <div className="flex flex-col items-center space-y-2 lg:items-start lg:space-y-0 lg:hidden">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Welcome to Chattr</h2>
              <p className="text-sm text-text-secondary">Connect. Chat. Vibe.</p>
            </div>

            {/* Desktop Brand Greeting */}
            <div className="hidden lg:block space-y-1">
              <h2 className="text-2xl font-bold text-white tracking-tight">Get Started</h2>
              <p className="text-sm text-text-secondary">Please log in or create a new account to continue.</p>
            </div>

            {/* Tab Switched Header Container */}
            <div className="relative border-b border-border flex pb-0.5">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 text-center py-2.5 font-medium transition-colors focus:outline-none ${
                  activeTab === "login" ? "text-white" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`flex-1 text-center py-2.5 font-medium transition-colors focus:outline-none ${
                  activeTab === "register" ? "text-white" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Register
              </button>

              {/* Animated underline indicator in purple */}
              <div
                className={`absolute bottom-0 h-0.5 bg-accent transition-all duration-300`}
                style={{
                  width: "50%",
                  left: activeTab === "login" ? "0%" : "50%",
                }}
              />
            </div>

            {/* Render form with transition */}
            <div className="transition-all duration-300 origin-top">
              {activeTab === "login" ? (
                <div className="animate-[fadeIn_0.25s_ease-out]">
                  <LoginForm />
                </div>
              ) : (
                <div className="animate-[fadeIn_0.25s_ease-out]">
                  <RegisterForm />
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;

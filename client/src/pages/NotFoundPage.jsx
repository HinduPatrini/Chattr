import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Home, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const handleGoBack = () => {
    if (token) {
      navigate("/chat", { replace: true });
    } else {
      navigate("/auth", { replace: true });
    }
  };

  return (
    <div className="fixed inset-0 bg-background-primary flex flex-col items-center justify-center select-none overflow-hidden">

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md gap-8">

        {/* 404 number — large gradient */}
        <div className="relative">
          <span
            className="text-[10rem] font-black leading-none bg-gradient-to-br from-accent via-accent-light to-accent/30 bg-clip-text text-transparent select-none"
            style={{ letterSpacing: "-0.05em" }}
          >
            404
          </span>
          {/* Floating icon badge */}
          <div className="absolute -top-4 -right-6 w-14 h-14 rounded-2xl bg-background-secondary border border-border shadow-2xl flex items-center justify-center rotate-12">
            <MessageCircle className="w-7 h-7 text-accent" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-text-primary">Page not found</h1>
          <p className="text-text-secondary text-sm leading-relaxed">
            Looks like this page went offline. The conversation you're looking for doesn't exist or was moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            onClick={handleGoBack}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 focus:outline-none shadow-lg shadow-accent/20"
          >
            <Home className="w-4 h-4" />
            {token ? "Back to Chattr" : "Go to Login"}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-background-secondary border border-border hover:bg-background-hover text-text-secondary hover:text-text-primary font-medium rounded-xl transition-all duration-200 focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

      </div>
    </div>
  );
};

export default NotFoundPage;

import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { useChatStore } from "./store/useChatStore";
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";

const App = () => {
  const token = useAuthStore((state) => state.token);
  const unreadCounts = useChatStore((state) => state.unreadCounts);
  
  const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

  useEffect(() => {
    document.title = totalUnread > 0 ? `Chattr (${totalUnread})` : "Chattr";
  }, [totalUnread]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Root Redirect */}
        <Route
          path="/"
          element={token ? <Navigate to="/chat" replace /> : <Navigate to="/auth" replace />}
        />

        {/* Auth Route - Redirects to chat if logged in */}
        <Route
          path="/auth"
          element={token ? <Navigate to="/chat" replace /> : <AuthPage />}
        />

        {/* Chat Route - Protected, redirects to auth if no token */}
        <Route
          path="/chat"
          element={token ? <ChatPage /> : <Navigate to="/auth" replace />}
        />

        {/* Catch-all Redirect */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>

      {/* Dark Theme React Hot Toaster */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1A1A2E",
            color: "#F1F5F9",
            border: "1px solid rgba(255,255,255,0.06)",
          },
        }}
      />
    </BrowserRouter>
  );
};

export default App;
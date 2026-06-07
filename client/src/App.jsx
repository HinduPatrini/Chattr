import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { useChatStore } from "./store/useChatStore";
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoadingScreen from "./components/common/LoadingScreen";

const App = () => {
  const { token, isInitializing, fetchProfile } = useAuthStore();
  const unreadCounts = useChatStore((state) => state.unreadCounts);

  const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

  // Run exactly once on mount: verify the stored token is still valid
  useEffect(() => {
    fetchProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update browser tab title with unread count
  useEffect(() => {
    document.title = totalUnread > 0 ? `Chattr (${totalUnread})` : "Chattr";
  }, [totalUnread]);

  // Block rendering until the session check is complete
  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route
          path="/"
          element={token ? <Navigate to="/chat" replace /> : <Navigate to="/auth" replace />}
        />

        {/* Auth — redirect to chat if already logged in */}
        <Route
          path="/auth"
          element={token ? <Navigate to="/chat" replace /> : <AuthPage />}
        />

        {/* Chat — protected */}
        <Route
          path="/chat"
          element={token ? <ChatPage /> : <Navigate to="/auth" replace />}
        />

        {/* 404 — any unknown path */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Dark-theme toast overlay */}
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
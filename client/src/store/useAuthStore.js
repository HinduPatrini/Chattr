import { create } from "zustand";
import axiosInstance from "../api/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("chattr_token") || null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      // Server returns flat object: { _id, username, email, avatar, bio, token }
      const { token, ...user } = response.data;

      localStorage.setItem("chattr_token", token);
      set({ token, user, isLoading: false });
      toast.success("Welcome back!");
      return user;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(message);
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (formData) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Server returns flat object: { _id, username, email, avatar, bio, token }
      const { token, ...user } = response.data;

      localStorage.setItem("chattr_token", token);
      set({ token, user, isLoading: false });
      toast.success("Account created successfully!");
      return user;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed.";
      toast.error(message);
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      // Even if endpoint fails or no network, we want to clear local session
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem("chattr_token");
      set({ token: null, user: null, isLoading: false });
    }
  },

  updateProfile: async (formData) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put("/users/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const updatedUser = response.data;
      set({ user: updatedUser, isLoading: false });
      toast.success("Profile updated!");
      return updatedUser;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update profile.";
      toast.error(message);
      set({ isLoading: false });
      throw error;
    }
  },

  fetchProfile: async () => {
    // Only fetch if token is present
    if (!get().token) return null;
    
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/users/profile");
      const user = response.data;
      set({ user, isLoading: false });
      return user;
    } catch (error) {
      console.error("Fetch profile failed:", error);
      // If unauthorized, clear the token
      if (error.response?.status === 401) {
        localStorage.removeItem("chattr_token");
        set({ token: null, user: null });
      }
      set({ isLoading: false });
      return null;
    }
  },
}));

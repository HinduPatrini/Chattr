import axios from "axios";

// Base server origin — dynamically fallback to current domain if deployed, or localhost in development
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 
  (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
    ? window.location.origin
    : "http://localhost:5000");

const axiosInstance = axios.create({
  baseURL: `${SERVER_URL}/api`,
  withCredentials: true,
});

// Attach JWT token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("chattr_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
export { SERVER_URL };

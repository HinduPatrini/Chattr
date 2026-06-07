import axios from "axios";

// Base server origin — /api prefix is added in the baseURL below
const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

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

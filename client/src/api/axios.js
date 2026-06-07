import axios from "axios";

const BASE_URL = "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true, // If needed for cookies, though token is stored in localStorage
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("chattr_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { BASE_URL };

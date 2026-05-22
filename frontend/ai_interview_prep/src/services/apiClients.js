// src/services/apiClient.js

import axios from "axios";
import toast from "react-hot-toast";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 30000,
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    // Unauthorized
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");

      if (window.location.pathname !== "/login") {
        toast.error("Session expired. Please login again.");

        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      }
    }

    // Server Error
    if (error?.response?.status >= 500) {
      toast.error("Server error. Please try again.");
    }

    return Promise.reject({
      ...error,
      customMessage: message,
    });
  }
);

export default apiClient;
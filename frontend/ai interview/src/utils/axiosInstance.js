import axios from "axios";
import { BASE_URL } from "./apiPaths";

// Utility to get token from localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // optional: to catch ECONNABORTED
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    let customError = {
      message: "An unexpected error occurred.",
      status: null,
      original: error,
    };

    if (error.code === "ECONNABORTED") {
      customError.message = "Request timed out. Please try again.";
    } else if (error.response) {
      const { status, data } = error.response;
      customError.status = status;

      switch (status) {
        case 400:
          customError.message = data.message || "Bad Request.";
          break;
        case 401:
          customError.message = "Unauthorized. Please login again.";
          break;
        case 403:
          customError.message = "Forbidden. You don't have permission.";
          break;
        case 404:
          customError.message = "Resource not found.";
          break;
        case 500:
          customError.message = "Server error. Please try again later.";
          break;
        default:
          customError.message = data.message || "Something went wrong.";
      }
    } else {
      customError.message = "Network error. Please check your connection.";
    }

    console.error(`❌ Response Error [${customError.status || "NO STATUS"}]:`, customError.message);

    return Promise.reject(customError);
  }
);

export default axiosInstance;

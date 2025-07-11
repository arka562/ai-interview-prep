import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_ROUTES } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Authenticated user data
  const [loading, setLoading] = useState(true); // Loading state for app init

  // Load user profile if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchUserProfile();
    else setLoading(false);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get(API_ROUTES.PROFILE);
      setUser(response.data);
    } catch (error) {
      console.error("Failed to load user profile", error.message);
      logoutUser(); // Invalid token, clear everything
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    try {
      const response = await axiosInstance.post(API_ROUTES.LOGIN, {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
      await fetchUserProfile();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Login failed",
      };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        loginUser,
        logoutUser,
        fetchUserProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

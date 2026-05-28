// src/routes/ProtectedRoute.jsx

import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  const { userInfo } = useSelector((state) => state.auth);

  // CHECK AUTH
  if (!userInfo) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
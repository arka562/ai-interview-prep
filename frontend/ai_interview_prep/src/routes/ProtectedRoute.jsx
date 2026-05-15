import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  const { userInfo, token } = useSelector(
    (state) => state.auth || {}
  );

  const storedToken = localStorage.getItem("token");

  const isAuthenticated = Boolean(
    (userInfo && token) || storedToken
  );

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
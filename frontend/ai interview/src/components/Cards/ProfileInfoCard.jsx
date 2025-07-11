import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

const ProfileInfoCard = () => {
  const { user, logoutUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(); // context logout method
    localStorage.removeItem("token"); // cleanup token
    navigate("/login"); // redirect to login page
  };

  return (
    user && (
      <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
        <img
          src={user?.profilePic || "/default-profile.png"}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-gray-800">
            {user?.name || "User"}
          </span>
          <button
            onClick={handleLogout}
            className="mt-2 text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
};

export default ProfileInfoCard;

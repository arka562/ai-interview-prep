import React from "react";
import ProfileInfoCard from "../Cards/ProfileInfoCard";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      {/* Logo / Brand */}
      <Link to="/dashboard">
        <h2 className="text-xl font-bold text-blue-600 hover:text-blue-800 transition">
          Interview Prep AI
        </h2>
      </Link>

      {/* User Info */}
      <div className="flex items-center gap-4">
        <ProfileInfoCard />
      </div>
    </nav>
  );
};

export default Navbar;

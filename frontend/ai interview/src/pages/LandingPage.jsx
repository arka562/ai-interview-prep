import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { APP_FEATURES } from "../utils/data";
import { Hero } from "../assets/asset";
import { LuSparkles } from "react-icons/lu";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Model from "../components/Model";
import { UserContext } from "../context/userContext";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard";

const LandingPage = () => {
  const navigate = useNavigate();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const { user } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if (!user) setOpenAuthModal(true);
    else {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="w-full py-4 px-6 flex justify-between items-center bg-white shadow-md">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Interview Prep AI
          </h1>
          {user ? (
            <ProfileInfoCard />
          ) : (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={() => setOpenAuthModal(true)}
            >
              Login / Sign Up
            </button>
          )}
        </header>

        {/* Hero Section */}
        <main className="flex-grow flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 gap-12">
          {/* Left Side - Text */}
          <div className="w-full md:w-1/2 max-w-xl text-center md:text-left">
            <p className="text-blue-600 font-semibold text-sm md:text-base uppercase mb-2 flex items-center gap-2 justify-center md:justify-start">
              <LuSparkles />
              AI powered
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 leading-tight">
              Ace Interviews with <br />
              <span className="text-blue-600">AI-Powered</span> Learning
            </h1>
            <p className="mt-4 text-gray-600 text-sm md:text-base">
              Get role-specific interview questions, detailed answers to expand
              your understanding, and a structured path from preparation to
              mastery.
            </p>
            <button
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              onClick={handleCTA}
            >
              Get Started
            </button>
          </div>

          {/* Right Side - Image */}
          <div className="w-full md:w-1/2">
            <img
              src={Hero}
              alt="AI Interview Preparation"
              className="w-full h-auto object-contain rounded-xl shadow-xl"
            />
          </div>
        </main>

        {/* Features Section */}
        <section className="px-6 md:px-20 py-16 bg-white">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10">
            Features That Make You Shine
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {APP_FEATURES.map((feature) => (
              <div
                key={feature.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-blue-600 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-gray-500 py-4 text-sm border-t">
          Made for pure development...
        </div>
      </div>
      <Model
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Model>
    </>
  );
};

export default LandingPage;

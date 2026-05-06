import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { APP_FEATURES } from "../utils/data";
import { Hero } from "../assets/asset";
import { LuSparkles, LuArrowRight } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Modal from "../components/Modal";
import { UserContext } from "../context/userContext";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard";

const LandingPage = () => {
  const navigate = useNavigate();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const { user } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if (!user) setOpenAuthModal(true);
    else navigate("/dashboard");
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <h1 className="logo">Interview Prep AI</h1>
        {user ? (
          <ProfileInfoCard />
        ) : (
          <button className="auth-btn" onClick={() => setOpenAuthModal(true)}>
            Login / Sign Up
          </button>
        )}
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <p className="tagline">
              <LuSparkles className="icon" />
              AI powered
            </p>
            <h1>Ace Interviews with AI-Powered Learning</h1>
            <p className="description">
              Get role-specific interview questions, detailed answers to expand
              your understanding, and a structured path from preparation to
              mastery.
            </p>

            <div className="benefits">
              <p>
                <FiCheckCircle className="icon" /> Personalized learning paths
              </p>
              <p>
                <FiCheckCircle className="icon" /> Real-time feedback
              </p>
            </div>

            <button className="cta-btn" onClick={handleCTA}>
              Get Started <LuArrowRight className="icon" />
            </button>
          </div>

          <div className="hero-image">
            <img src={Hero} alt="AI Interview Preparation" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Features That Make You Shine</h2>
        <div className="features-grid">
          {APP_FEATURES.map((feature) => (
            <div key={feature.id} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Interview Prep AI</p>
      </footer>

      {/* Auth Modal */}
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div className="auth-modal">
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>

      <style jsx>{`
        .landing-page {
          font-family: Arial, sans-serif;
          color: #333;
        }

        /* Header Styles */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: white;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0;
          color: #2563eb;
        }

        .auth-btn {
          background: #2563eb;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
        }

        .auth-btn:hover {
          background: #1d4ed8;
        }

        /* Hero Section */
        .hero {
          padding: 3rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .hero-content {
            flex-direction: row;
            align-items: center;
          }
        }

        .hero-text {
          flex: 1;
        }

        .hero-text h1 {
          font-size: 2.5rem;
          margin: 1rem 0;
          color: #1e293b;
        }

        .tagline {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #2563eb;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.9rem;
        }

        .description {
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .benefits p {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0.5rem 0;
          color: #334155;
        }

        .benefits .icon {
          color: #10b981;
        }

        .cta-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #2563eb;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-weight: 600;
          margin-top: 1.5rem;
          cursor: pointer;
        }

        .cta-btn:hover {
          background: #1d4ed8;
        }

        .hero-image {
          flex: 1;
        }

        .hero-image img {
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        /* Features Section */
        .features {
          padding: 3rem 2rem;
          background: #f8fafc;
        }

        .features h2 {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 2rem;
          color: #1e293b;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .feature-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }

        .feature-card h3 {
          color: #2563eb;
          margin-top: 0;
        }

        .feature-card p {
          color: #64748b;
          line-height: 1.6;
        }

        /* Footer */
        .footer {
          text-align: center;
          padding: 2rem;
          background: white;
          border-top: 1px solid #e2e8f0;
          color: #64748b;
        }

        /* Modal */
        .auth-modal {
          padding: 1rem;
        }

        /* Icons */
        .icon {
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;

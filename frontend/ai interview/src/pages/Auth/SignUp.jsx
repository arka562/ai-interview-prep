import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_ROUTES } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name) {
      setError("Please enter full name");
      setIsLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      setError("Enter a valid email address");
      setIsLoading(false);
      return;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    setError("");

    try {
      let imageUrl = "";
      if (profilePic) {
        const imageRes = await uploadImage(profilePic);
        imageUrl = imageRes.data?.imageUrl || "";
      }

      const registerRes = await axiosInstance.post(API_ROUTES.REGISTER, {
        name,
        email,
        password,
        profileImageUrl: imageUrl,
      });

      const { token, user } = registerRes.data;

      if (token) {
        localStorage.setItem("token", token);
        loginUser(user);
        navigate("/dashboard");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const switchToLogin = () => {
    setIsVisible(false);
    setTimeout(() => setCurrentPage("login"), 300);
  };

  return (
    <div className="signup-container">
      <div className={`signup-card ${isVisible ? "visible" : "hidden"}`}>
        <div className="signup-header">
          <div className="signup-icon">
            <svg viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h3 className="signup-title">Create Account</h3>
          <p className="signup-subtitle">
            Join us and start your journey today
          </p>
        </div>

        <form onSubmit={handleSignUp} className="signup-form">
          <div className="form-group">
            <label className="input-label">Profile Picture</label>
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          </div>

          <div className="form-group">
            <label className="input-label">Full Name</label>
            <Input
              value={name}
              onChange={({ target }) => setName(target.value)}
              placeholder="e.g. John Doe"
              type="text"
            />
          </div>

          <div className="form-group">
            <label className="input-label">Email Address</label>
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder="your@email.com"
              type="email"
            />
          </div>

          <div className="form-group">
            <label className="input-label">Password</label>
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder="Enter at least 8 characters"
              type="password"
            />
          </div>

          {error && (
            <div className="error-message">
              <svg viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              {error}
            </div>
          )}

          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? (
              <span className="button-text">Creating Account...</span>
            ) : (
              <span className="button-text">Sign Up</span>
            )}
          </button>

          <div className="login-link">
            Already have an account?{" "}
            <button type="button" className="login-btn" onClick={switchToLogin}>
              Login
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .signup-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          padding: 2rem;
        }

        .signup-card {
          width: 100%;
          max-width: 28rem;
          background: white;
          border-radius: 1.5rem;
          padding: 2.5rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .signup-card.hidden {
          opacity: 0;
          transform: translateY(1rem);
        }

        .signup-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .signup-icon {
          width: 5rem;
          height: 5rem;
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          box-shadow: 0 10px 15px -3px rgba(139, 92, 246, 0.3);
        }

        .signup-icon svg {
          width: 2rem;
          height: 2rem;
          color: white;
        }

        .signup-title {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(to right, #8b5cf6, #6366f1);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .signup-subtitle {
          color: #6b7280;
          font-size: 1rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .input-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #4b5563;
          margin-bottom: 0.5rem;
        }

        .error-message {
          color: #dc2626;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 0.75rem;
          padding: 1rem;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }

        .error-message svg {
          width: 1rem;
          height: 1rem;
          flex-shrink: 0;
        }

        .signup-button {
          width: 100%;
          background: linear-gradient(to right, #8b5cf6, #6366f1);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.3);
          position: relative;
          overflow: hidden;
        }

        .signup-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(139, 92, 246, 0.4);
        }

        .signup-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .signup-button::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.3)
          );
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }

        .signup-button:hover::after {
          transform: translateX(100%);
        }

        .login-link {
          text-align: center;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .login-btn {
          color: #8b5cf6;
          font-weight: 700;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .login-btn:hover {
          color: #7c3aed;
          text-decoration: underline;
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }
      `}</style>
    </div>
  );
};

export default SignUp;

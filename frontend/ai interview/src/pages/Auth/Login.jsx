import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import { UserContext } from "../../context/userContext";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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
      const result = await loginUser(email, password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const switchToSignup = () => {
    setIsVisible(false);
    setTimeout(() => setCurrentPage("signup"), 300);
  };

  return (
    <div className="login-container">
      <div className={`login-card ${isVisible ? "visible" : "hidden"}`}>
        <div className="login-header">
          <div className="login-icon">
            <svg viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
          </div>
          <h3 className="login-title">Welcome Back</h3>
          <p className="login-subtitle">Please enter your details to login</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
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
              placeholder="Enter your password"
              type="password"
            />
          </div>

          <div className="forgot-password">
            <button type="button" className="forgot-password-btn">
              Forgot Password?
            </button>
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

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <span className="button-text">Logging in...</span>
            ) : (
              <span className="button-text">Login</span>
            )}
          </button>

          <div className="signup-link">
            Don't have an account?{" "}
            <button
              type="button"
              className="signup-btn"
              onClick={switchToSignup}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          padding: 2rem;
        }

        .login-card {
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

        .login-card.hidden {
          opacity: 0;
          transform: translateY(1rem);
        }

        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .login-icon {
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

        .login-icon svg {
          width: 2rem;
          height: 2rem;
          color: white;
        }

        .login-title {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(to right, #8b5cf6, #6366f1);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .login-subtitle {
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

        .forgot-password {
          text-align: right;
          margin-bottom: 1.5rem;
        }

        .forgot-password-btn {
          color: #8b5cf6;
          font-size: 0.875rem;
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .forgot-password-btn:hover {
          color: #7c3aed;
          text-decoration: underline;
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

        .login-button {
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

        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(139, 92, 246, 0.4);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .login-button::after {
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

        .login-button:hover::after {
          transform: translateX(100%);
        }

        .signup-link {
          text-align: center;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .signup-btn {
          color: #8b5cf6;
          font-weight: 700;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .signup-btn:hover {
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

export default Login;

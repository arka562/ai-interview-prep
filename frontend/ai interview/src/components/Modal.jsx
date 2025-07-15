import React, { useEffect } from "react";

const Modal = ({ children, isOpen, onClose, title, hideHeader }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        {!hideHeader && (
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
          </div>
        )}

        {/* Close Button */}
        <button
          className="modal-close-btn"
          type="button"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            className="close-icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M1 1l12 12M13 1L1 13"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="modal-content">{children}</div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }

        .modal-container {
          background: linear-gradient(145deg, #ffffff, #f8fafc);
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          width: 90%;
          max-width: 500px;
          padding: 2rem;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: slideUp 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .modal-header {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .modal-close-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          color: #64748b;
          transition: all 0.2s ease;
          background: rgba(226, 232, 240, 0.5);
          border-radius: 50%;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
        }

        .modal-close-btn:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
          transform: rotate(90deg);
        }

        .close-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .modal-content {
          margin-top: 1rem;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Modal;

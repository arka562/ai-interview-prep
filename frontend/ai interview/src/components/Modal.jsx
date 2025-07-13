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
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6 relative">
        {/* Header */}
        {!hideHeader && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          </div>
        )}

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          type="button"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5"
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
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

import React from "react";
import { FiTrash2 } from "react-icons/fi";
import { initial } from "../../utils/helper";

const SummaryCard = ({
  colors,
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
  onSelect,
  onDelete,
}) => {
  return (
    <div className="summary-card-container">
      <div
        className="summary-card"
        onClick={onSelect}
        style={{ background: colors?.bgcolor || "#6366f1" }}
      >
        {/* Initial Badge with Glass Morphism Effect */}
        <div className="initial-badge">{initial(role || "")}</div>

        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="delete-button"
        >
          <FiTrash2 className="delete-icon" />
        </button>

        {/* Role */}
        <h3 className="role-title">{role}</h3>

        {/* Experience */}
        <div className="detail-row">
          <span className="detail-label">Experience:</span>
          <span className="detail-value">{experience}</span>
        </div>

        {/* Questions */}
        <div className="detail-row">
          <span className="detail-label">Questions:</span>
          <span className="detail-value">{questions}</span>
        </div>

        {/* Topics to focus */}
        <div className="detail-row">
          <span className="detail-label">Topics:</span>
          <span className="detail-value">
            {topicsToFocus?.join?.(", ") || topicsToFocus}
          </span>
        </div>

        {/* Description */}
        <div className="description">
          <span className="detail-label">Description:</span>
          <p className="detail-value">{description}</p>
        </div>

        {/* Last Updated */}
        <div className="last-updated">Updated: {lastUpdated}</div>
      </div>

      <style jsx>{`
        .summary-card-container {
          perspective: 1000px;
        }

        .summary-card {
          position: relative;
          border-radius: 1rem;
          padding: 1.5rem;
          color: white;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          cursor: pointer;
          overflow: hidden;
          transform-style: preserve-3d;
        }

        .summary-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
        }

        .summary-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0) 100%
          );
          z-index: 1;
        }

        .initial-badge {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
          z-index: 2;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .delete-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 2;
        }

        .delete-button:hover {
          background: rgba(239, 68, 68, 0.3);
          transform: scale(1.1);
        }

        .delete-icon {
          color: white;
          font-size: 1rem;
        }

        .role-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          text-transform: capitalize;
          z-index: 2;
          position: relative;
        }

        .detail-row {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          z-index: 2;
          position: relative;
        }

        .detail-label {
          font-weight: 600;
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .detail-value {
          font-size: 0.875rem;
          opacity: 0.8;
        }

        .description {
          margin-top: 0.75rem;
          margin-bottom: 1rem;
          z-index: 2;
          position: relative;
        }

        .description .detail-value {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .last-updated {
          font-size: 0.75rem;
          opacity: 0.7;
          margin-top: 1rem;
          z-index: 2;
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default SummaryCard;

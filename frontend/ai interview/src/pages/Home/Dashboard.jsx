import React, { useState, useEffect } from "react";
import { LuPlus } from "react-icons/lu";
import moment from "moment";
import axiosInstance from "../../utils/axiosInstance";
import { API_ROUTES } from "../../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import { CARD_BG } from "../../utils/data";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import SummaryCard from "../../components/Cards/SummaryCard";
import Modal from "../../components/Modal";
import CreateSessionForm from "./CreateSessionForm";

// Import or define the initial function
const initial = (title) => {
  // Check if title exists and is a string
  if (!title || typeof title !== "string") return "";

  // Trim whitespace and check if empty
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return "";

  const word = trimmedTitle.split(" ");
  let initials = "";
  for (let i = 0; i < Math.min(word.length, 2); i++) {
    if (word[i] && word[i].length > 0) {
      initials += word[i][0];
    }
  }
  return initials.toUpperCase();
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    sessionId: null,
  });

  const fetchAllSession = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_ROUTES.GET_MY_SESSIONS);
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching sessions", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (id) => {
    try {
      setDeleteLoading(true);

      if (!id) {
        throw new Error("Session ID is required for deletion");
      }

      const deleteUrl =
        typeof API_ROUTES.DELETE_SESSION === "function"
          ? API_ROUTES.DELETE_SESSION(id)
          : `${API_ROUTES.DELETE_SESSION}/${id}`;

      console.log("Delete URL:", deleteUrl);
      console.log("Session ID:", id);

      const response = await axiosInstance.delete(deleteUrl);
      console.log("Delete response:", response);

      await fetchAllSession();
      console.log("Session deleted successfully");
    } catch (error) {
      console.error("Error deleting session", error);

      if (error.response?.status === 404) {
        console.error("Session not found - it may have already been deleted");
        await fetchAllSession();
      } else if (error.response?.status === 403) {
        console.error("You don't have permission to delete this session");
      } else {
        console.error("Failed to delete session:", error.message);
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!sessionId) {
      console.error("Invalid session ID provided for deletion");
      return;
    }

    await deleteSession(sessionId);
    setDeleteConfirm({ show: false, sessionId: null });
  };

  useEffect(() => {
    fetchAllSession();
  }, []);

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Your Interview Sessions</h1>
          <button
            className="create-session-btn"
            onClick={() => setOpenCreateModal(true)}
          >
            <LuPlus className="plus-icon" />
            Add New Session
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="empty-state">
            <p>No sessions found. Let's create your first one!</p>
            <button
              className="create-session-btn"
              onClick={() => setOpenCreateModal(true)}
            >
              <LuPlus className="plus-icon" />
              Create Session
            </button>
          </div>
        ) : (
          <div className="sessions-grid">
            {sessions.map((data, index) => (
              <div key={data?._id} className="session-card-wrapper">
                {/* Display initials avatar - moved to left */}
                <div className="session-avatar">
                  {initial(data?.role || "Session")}
                </div>

                <SummaryCard
                  colors={CARD_BG[index % CARD_BG.length]}
                  role={data?.role || ""}
                  topicsToFocus={data?.topicsToFocus || ""}
                  experience={data?.experience || "-"}
                  questions={data?.questions?.length || "-"}
                  description={data?.description || ""}
                  lastUpdated={
                    data?.updatedAt
                      ? moment(data.updatedAt).format("Do MMM YYYY")
                      : ""
                  }
                  onSelect={() => navigate(`/interview-prep/${data?._id}`)}
                  onDelete={() => {
                    if (data?._id) {
                      setDeleteConfirm({
                        show: true,
                        sessionId: data._id,
                      });
                    } else {
                      console.error(
                        "Cannot delete session: Invalid session ID"
                      );
                    }
                  }}
                />

                {/* Demo section to show initials functionality - only for role */}
                <div className="initials-demo">
                  <small>
                    Role Initials: <strong>{initial(data?.role)}</strong>
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal
          isOpen={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          hideHeader
        >
          <CreateSessionForm onSuccess={fetchAllSession} />
        </Modal>

        <Modal
          isOpen={deleteConfirm.show}
          onClose={() => setDeleteConfirm({ show: false, sessionId: null })}
          title="Confirm Deletion"
        >
          <div className="delete-confirmation">
            <p>Are you sure you want to delete this session?</p>
            <div className="action-buttons">
              <button
                className="cancel-btn"
                onClick={() =>
                  setDeleteConfirm({ show: false, sessionId: null })
                }
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteSession(deleteConfirm.sessionId)}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </Modal>
      </div>

      <style jsx>{`
        .dashboard-container {
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          min-height: calc(100vh - 4rem);
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .dashboard-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .create-session-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 1rem;
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .create-session-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4);
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
        }

        .plus-icon {
          font-size: 1.25rem;
        }

        .sessions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .session-card-wrapper {
          position: relative;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.2s ease;
        }

        .session-card-wrapper:hover {
          transform: translateY(-2px);
        }

        .session-avatar {
          position: absolute;
          top: 1rem;
          left: 1rem;
          width: 3rem;
          height: 3rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.1rem;
          z-index: 10;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .initials-demo {
          padding: 1rem;
          background: #f8fafc;
          color: #64748b;
          border-top: 1px solid #e2e8f0;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          gap: 1.5rem;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .loading-spinner {
          width: 3rem;
          height: 3rem;
          border: 4px solid rgba(99, 102, 241, 0.1);
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          gap: 1.5rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          text-align: center;
          color: #64748b;
          font-size: 1.125rem;
        }

        .delete-confirmation {
          padding: 1.5rem;
          background: white;
          border-radius: 0.75rem;
        }

        .delete-confirmation p {
          margin-bottom: 1.5rem;
          color: #334155;
          font-size: 1.125rem;
        }

        .action-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }

        .cancel-btn {
          padding: 0.75rem 1.5rem;
          background: #f1f5f9;
          color: #475569;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cancel-btn:hover:not(:disabled) {
          background: #e2e8f0;
        }

        .cancel-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .delete-btn {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.3);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .delete-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.4);
        }

        .delete-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default Dashboard;

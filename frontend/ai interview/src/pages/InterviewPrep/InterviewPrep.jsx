import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { LuCircleAlert, LuPin, LuPlus } from "react-icons/lu";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import { toast } from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_ROUTES } from "../../utils/apiPaths";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import RoleInfoHeader from "../InterviewPrep/components/RoleInfoHeader";
import QuestionCard from "../../components/Cards/QuestionCard";
import AIResponse from "./components/AIResponsePreview";

const InterviewPrep = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMoreQuestions, setIsLoadingMoreQuestions] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [progress, setProgress] = useState(0);

  const sortQuestions = (questions) => {
    if (!questions || !Array.isArray(questions)) return [];
    return [...questions].sort((a, b) => {
      const aPinned = a.pinned || a.isPinned || false;
      const bPinned = b.pinned || b.isPinned || false;
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      const aDate = new Date(a.createdAt || a.updatedAt || 0);
      const bDate = new Date(b.createdAt || b.updatedAt || 0);
      return bDate - aDate;
    });
  };

  const getSortedQuestions = () => sortQuestions(sessionData?.questions || []);

  const getPinnedAndUnpinnedQuestions = () => {
    const questions = sessionData?.questions || [];
    const pinnedQuestions = questions.filter((q) => q.pinned || q.isPinned);
    const unpinnedQuestions = questions.filter(
      (q) => !(q.pinned || q.isPinned)
    );

    const sortByDate = (a, b) => {
      const aDate = new Date(a.createdAt || a.updatedAt || 0);
      const bDate = new Date(b.createdAt || b.updatedAt || 0);
      return bDate - aDate;
    };

    return {
      pinnedQuestions: pinnedQuestions.sort(sortByDate),
      unpinnedQuestions: unpinnedQuestions.sort(sortByDate),
    };
  };

  const fetchSessionDetailById = async () => {
    if (!sessionId) {
      setErrorMsg("Session ID is required");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await axiosInstance.get(
        API_ROUTES.GET_SESSION_BY_ID(sessionId),
        { timeout: 60000 }
      );

      if (res.data?.session) {
        setSessionData({
          ...res.data.session,
          questions: sortQuestions(res.data.session.questions),
        });
      } else {
        setErrorMsg("Session data not found");
      }
    } catch (err) {
      console.error("Fetch session error:", err);
      setErrorMsg(err.response?.data?.message || "Failed to load session");
    } finally {
      setIsLoading(false);
    }
  };

  const generateMoreQuestions = async () => {
    if (!sessionData) {
      toast.error("Session data not available");
      return;
    }

    setIsLoadingMoreQuestions(true);
    setErrorMsg("");
    setProgress(0);

    try {
      const response = await axiosInstance.post(
        API_ROUTES.GENERATE_QUESTIONS,
        {
          sessionId,
          role: sessionData.role,
          experience: sessionData.experience,
          topicsToFocus: sessionData.topicsToFocus,
          numberOfQuestions: 5,
        },
        { timeout: 120000 }
      );

      if (response.data?.success) {
        setSessionData((prev) => ({
          ...prev,
          questions: sortQuestions([
            ...prev.questions,
            ...response.data.structured_questions,
          ]),
        }));
        toast.success(
          `${response.data.structured_questions.length} new questions added`
        );
      }
    } catch (err) {
      console.error("Generate more questions error:", err);
      if (err.code === "ECONNABORTED") {
        setErrorMsg(
          "Request timed out. Generating questions may take longer than expected."
        );
      } else {
        setErrorMsg(
          err.response?.data?.message || "Failed to generate questions"
        );
      }
    } finally {
      setIsLoadingMoreQuestions(false);
    }
  };

  const handleLearnMore = (question) => {
    setSelectedQuestion(question);
    setShowExplanation(true);
  };

  const toggleQuestionPinAnswer = async (questionId, currentStatus) => {
    try {
      const apiUrl =
        typeof API_ROUTES.TOGGLE_PIN_QUESTION === "function"
          ? API_ROUTES.TOGGLE_PIN_QUESTION(questionId)
          : API_ROUTES.TOGGLE_PIN_QUESTION.replace(":id", questionId);

      const response = await axiosInstance.patch(apiUrl);

      if (response.data?.success) {
        setSessionData((prev) => {
          const updatedQuestions = prev.questions.map((q) =>
            q._id === questionId ? { ...q, pinned: response.data.pinned } : q
          );
          return { ...prev, questions: sortQuestions(updatedQuestions) };
        });
      }
    } catch (err) {
      console.error("Toggle pin error:", err);
      toast.error("Failed to update pin status");
    }
  };

  const closeExplanationDrawer = () => {
    setShowExplanation(false);
    setSelectedQuestion(null);
  };

  useEffect(() => {
    if (sessionId) fetchSessionDetailById();
  }, [sessionId]);

  const { pinnedQuestions, unpinnedQuestions } =
    getPinnedAndUnpinnedQuestions();

  return (
    <DashboardLayout>
      <div className="interview-prep-container">
        <RoleInfoHeader
          role={sessionData?.role || ""}
          topicsToFocus={sessionData?.topicsToFocus || []}
          experience={sessionData?.experience || "-"}
          questions={sessionData?.questions?.length || 0}
          description={sessionData?.description || ""}
          lastUpdated={
            sessionData?.updatedAt
              ? moment(sessionData.updatedAt).format("Do MMM YYYY")
              : ""
          }
        />

        <div className="content-grid">
          <div
            className={`questions-column ${
              showExplanation ? "with-explanation" : ""
            }`}
          >
            {/* Generate More Questions Section */}
            <div className="generate-section">
              <button
                onClick={generateMoreQuestions}
                disabled={isLoadingMoreQuestions}
                className="generate-button"
              >
                {isLoadingMoreQuestions ? (
                  <span className="button-content">
                    <SpinnerLoader className="spinner" />
                    Generating ({progress}%)...
                  </span>
                ) : (
                  <span className="button-content">
                    <LuPlus className="plus-icon" />
                    Generate More Questions
                  </span>
                )}
              </button>

              {/* Status messages */}
              {errorMsg && (
                <div className="error-message">
                  <LuCircleAlert className="alert-icon" />
                  {errorMsg}
                </div>
              )}

              {pinnedQuestions.length > 0 && (
                <div className="pinned-count">
                  <LuPin className="pin-icon" />
                  {pinnedQuestions.length} pinned question
                  {pinnedQuestions.length !== 1 ? "s" : ""}
                </div>
              )}
            </div>

            {/* Questions List */}
            <AnimatePresence>
              {isLoading ? (
                <div className="loading-state">
                  <SpinnerLoader className="large-spinner" />
                </div>
              ) : sessionData?.questions?.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="empty-state"
                >
                  <p className="empty-text">🎯 No questions available yet.</p>
                  <button
                    onClick={generateMoreQuestions}
                    disabled={isLoadingMoreQuestions}
                    className="generate-first-button"
                  >
                    {isLoadingMoreQuestions
                      ? "Generating..."
                      : "Generate First Questions"}
                  </button>
                </motion.div>
              ) : (
                <>
                  {pinnedQuestions.length > 0 && (
                    <div className="pinned-section">
                      <div className="section-header">
                        <LuPin className="section-icon" />
                        <h3 className="section-title">
                          Pinned Questions ({pinnedQuestions.length})
                        </h3>
                      </div>
                      {pinnedQuestions.map((data) => (
                        <motion.div
                          key={`pinned-${data._id}`}
                          layout
                          className="pinned-question-container"
                        >
                          <QuestionCard
                            question={data.question}
                            answer={data.answer}
                            onLearnMore={() => handleLearnMore(data)}
                            isPinned={true}
                            onTogglePin={() =>
                              toggleQuestionPinAnswer(data._id, true)
                            }
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {unpinnedQuestions.length > 0 && (
                    <div className="unpinned-section">
                      {pinnedQuestions.length > 0 && (
                        <h3 className="section-title">
                          Other Questions ({unpinnedQuestions.length})
                        </h3>
                      )}
                      {unpinnedQuestions.map((data) => (
                        <motion.div
                          key={`unpinned-${data._id}`}
                          layout
                          className="unpinned-question-container"
                        >
                          <QuestionCard
                            question={data.question}
                            answer={data.answer}
                            onLearnMore={() => handleLearnMore(data)}
                            isPinned={false}
                            onTogglePin={() =>
                              toggleQuestionPinAnswer(data._id, false)
                            }
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </AnimatePresence>
          </div>

          {/* AI Explanation Drawer */}
          {showExplanation && selectedQuestion && (
            <div className="explanation-column">
              <AIResponse
                question={selectedQuestion.question}
                questionId={selectedQuestion._id}
                onClose={closeExplanationDrawer}
              />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .interview-prep-container {
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          min-height: calc(100vh - 4rem);
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-top: 1.5rem;
        }

        @media (min-width: 768px) {
          .content-grid {
            grid-template-columns: ${showExplanation ? "2fr 1fr" : "1fr"};
          }
        }

        .questions-column {
          transition: all 0.3s ease;
        }

        .questions-column.with-explanation {
          padding-right: 2rem;
        }

        .generate-section {
          margin-bottom: 2rem;
        }

        .generate-button {
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.3);
          display: flex;
          align-items: center;
        }

        .generate-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(139, 92, 246, 0.4);
        }

        .generate-button:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .button-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .plus-icon {
          font-size: 1.25rem;
        }

        .spinner {
          width: 1rem;
          height: 1rem;
          margin-right: 0.5rem;
        }

        .error-message {
          background: #fee2e2;
          border-left: 4px solid #ef4444;
          color: #b91c1c;
          padding: 0.75rem;
          margin-top: 1rem;
          border-radius: 0.375rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .alert-icon {
          font-size: 1.25rem;
        }

        .pinned-count {
          color: #6366f1;
          font-size: 0.875rem;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .pin-icon {
          font-size: 1rem;
        }

        .loading-state {
          display: flex;
          justify-content: center;
          padding: 3rem 0;
        }

        .large-spinner {
          width: 2.5rem;
          height: 2.5rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 0;
          color: #64748b;
        }

        .empty-text {
          font-size: 1.125rem;
          margin-bottom: 1.5rem;
        }

        .generate-first-button {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .generate-first-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
        }

        .pinned-section {
          margin-bottom: 2rem;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          color: #6366f1;
        }

        .section-icon {
          font-size: 1.25rem;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .pinned-question-container {
          border-left: 4px solid #6366f1;
          padding-left: 1rem;
          margin-bottom: 1.5rem;
        }

        .unpinned-section {
          margin-top: ${pinnedQuestions.length > 0 ? "2rem" : "0"};
        }

        .unpinned-question-container {
          margin-bottom: 1.5rem;
        }

        .explanation-column {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
          height: fit-content;
          position: sticky;
          top: 1rem;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default InterviewPrep;

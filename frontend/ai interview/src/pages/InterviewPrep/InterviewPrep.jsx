import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { LuCircleAlert, LuPin } from "react-icons/lu";
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
  const [progress, setProgress] = useState(0); // New progress state

  // Sort questions (pinned first)
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

  // Get sorted questions
  const getSortedQuestions = () => sortQuestions(sessionData?.questions || []);

  // Get pinned and unpinned questions separately
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

  // Fetch session details
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
        { timeout: 60000 } // 60s timeout for initial load
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

  // Generate more questions with progress tracking
  const generateMoreQuestions = async () => {
    if (!sessionData) {
      toast.error("Session data not available");
      return;
    }

    setIsLoadingMoreQuestions(true);
    setErrorMsg("");
    setProgress(0);
    console.log("Generating more questions...");

    try {
      // Create an EventSource connection for progress updates
      const eventSource = new EventSource(
        `${API_ROUTES.GENERATE_QUESTIONS_PROGRESS}?sessionId=${sessionId}` +
          `&role=${encodeURIComponent(sessionData.role)}` +
          `&experience=${encodeURIComponent(sessionData.experience)}` +
          `&topicsToFocus=${encodeURIComponent(
            sessionData.topicsToFocus.join(",")
          )}` +
          `&numberOfQuestions=5`
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.progress) {
          setProgress(data.progress);
        }
        if (data.complete) {
          eventSource.close();
          setSessionData((prev) => ({
            ...prev,
            questions: sortQuestions([...prev.questions, ...data.questions]),
          }));
          toast.success(`${data.questions.length} new questions added`);
          setIsLoadingMoreQuestions(false);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setIsLoadingMoreQuestions(false);
        setErrorMsg("Connection to progress updates failed");
      };

      // Fallback - regular API call if SSE fails
      const response = await axiosInstance.post(
        API_ROUTES.GENERATE_QUESTIONS,
        {
          sessionId,
          role: sessionData.role,
          experience: sessionData.experience,
          topicsToFocus: sessionData.topicsToFocus,
          numberOfQuestions: 5,
        },
        { timeout: 120000 } // 120s timeout
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

  // Handle "Learn More"
  const handleLearnMore = (question) => {
    setSelectedQuestion(question);
    setShowExplanation(true);
  };

  // Toggle pin/unpin question
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

  // Close explanation drawer
  const closeExplanationDrawer = () => {
    setShowExplanation(false);
    setSelectedQuestion(null);
  };

  // Initialize component
  useEffect(() => {
    if (sessionId) fetchSessionDetailById();
  }, [sessionId]);

  const { pinnedQuestions, unpinnedQuestions } =
    getPinnedAndUnpinnedQuestions();

  return (
    <DashboardLayout>
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

      <div className="grid grid-cols-12 gap-4 mt-5 mb-10">
        <div
          className={`col-span-12 ${
            showExplanation ? "md:col-span-7" : "md:col-span-8"
          }`}
        >
          {/* Generate More Questions Section */}
          <div className="mb-4">
            <button
              onClick={generateMoreQuestions}
              disabled={isLoadingMoreQuestions}
              className={`px-6 py-3 text-white rounded-lg font-medium transition ${
                isLoadingMoreQuestions
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isLoadingMoreQuestions ? (
                <span className="flex items-center">
                  <SpinnerLoader className="w-4 h-4 mr-2" />
                  Generating ({progress}%)...
                </span>
              ) : (
                "➕ Generate More Questions (5)"
              )}
            </button>

            {/* Progress bar */}
            {isLoadingMoreQuestions && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}

            {/* Status messages */}
            {errorMsg && (
              <div className="mt-2 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
                <p className="flex items-center">
                  <LuCircleAlert className="mr-2" />
                  {errorMsg}
                </p>
              </div>
            )}

            {pinnedQuestions.length > 0 && (
              <p className="text-sm text-blue-600 mt-2">
                📌 {pinnedQuestions.length} pinned question
                {pinnedQuestions.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Questions List */}
          <AnimatePresence>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <SpinnerLoader className="w-8 h-8" />
              </div>
            ) : sessionData?.questions?.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-gray-500 py-8"
              >
                <p className="text-lg mb-4">🎯 No questions available yet.</p>
                <button
                  onClick={generateMoreQuestions}
                  disabled={isLoadingMoreQuestions}
                  className={`px-6 py-3 text-white rounded-lg font-medium ${
                    isLoadingMoreQuestions
                      ? "bg-gray-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isLoadingMoreQuestions
                    ? "Generating..."
                    : "Generate First Questions"}
                </button>
              </motion.div>
            ) : (
              <>
                {pinnedQuestions.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center mb-4 text-blue-600">
                      <LuPin className="w-5 h-5 mr-2" />
                      <h3 className="font-semibold text-lg">
                        Pinned Questions ({pinnedQuestions.length})
                      </h3>
                    </div>
                    {pinnedQuestions.map((data) => (
                      <motion.div
                        key={`pinned-${data._id}`}
                        layout
                        className="border-l-4 border-blue-500 pl-4 mb-4"
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
                  <div>
                    {pinnedQuestions.length > 0 && (
                      <h3 className="font-semibold text-lg mb-4 text-gray-600">
                        Other Questions ({unpinnedQuestions.length})
                      </h3>
                    )}
                    {unpinnedQuestions.map((data) => (
                      <motion.div
                        key={`unpinned-${data._id}`}
                        layout
                        className="mb-4"
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
          <div className="col-span-12 md:col-span-5">
            <AIResponse
              question={selectedQuestion.question}
              questionId={selectedQuestion._id}
              onClose={closeExplanationDrawer}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;

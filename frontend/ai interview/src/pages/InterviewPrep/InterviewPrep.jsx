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

  // 🎯 NEW: Function to sort questions (pinned first)
  const sortQuestions = (questions) => {
    if (!questions || !Array.isArray(questions)) return [];

    return [...questions].sort((a, b) => {
      // First sort by pinned status (pinned questions first)
      const aPinned = a.pinned || a.isPinned || false;
      const bPinned = b.pinned || b.isPinned || false;

      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;

      // If both have same pinned status, sort by creation date (newest first)
      const aDate = new Date(a.createdAt || a.updatedAt || 0);
      const bDate = new Date(b.createdAt || b.updatedAt || 0);
      return bDate - aDate;
    });
  };

  // 🎯 NEW: Get sorted questions
  const getSortedQuestions = () => {
    return sortQuestions(sessionData?.questions || []);
  };

  // 🎯 NEW: Get pinned and unpinned questions separately
  const getPinnedAndUnpinnedQuestions = () => {
    const questions = sessionData?.questions || [];

    const pinnedQuestions = questions.filter((q) => q.pinned || q.isPinned);
    const unpinnedQuestions = questions.filter(
      (q) => !(q.pinned || q.isPinned)
    );

    // Sort each group by creation date (newest first)
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

  // 📥 Fetch session details
  const fetchSessionDetailById = async () => {
    if (!sessionId) {
      setErrorMsg("Session ID is required");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await axiosInstance.get(
        API_ROUTES.GET_SESSION_BY_ID(sessionId)
      );

      if (res.data && res.data.session) {
        console.log("✅ Session data fetched:", res.data.session);

        // 🎯 FIX: Sort questions after fetching
        const sortedSession = {
          ...res.data.session,
          questions: sortQuestions(res.data.session.questions),
        };

        setSessionData(sortedSession);
        console.log(
          "📌 Pinned questions:",
          sortedSession.questions.filter((q) => q.pinned || q.isPinned).length
        );
      } else {
        console.error("❌ No session data in response:", res.data);
        setErrorMsg("Session data not found");
      }
    } catch (err) {
      console.error("❌ Fetch session error:", err);
      // ... error handling
    } finally {
      setIsLoading(false);
    }
  };

  // 🔄 Generate more questions
  const generateMoreQuestions = async () => {
    if (!sessionData) {
      toast.error("Session data not available");
      return;
    }

    setIsLoadingMoreQuestions(true);
    console.log("🔄 Generating more questions...");

    try {
      const response = await axiosInstance.post(API_ROUTES.GENERATE_QUESTIONS, {
        sessionId,
        role: sessionData.role,
        experience: sessionData.experience,
        topicsToFocus: sessionData.topicsToFocus,
        numberOfQuestions: 5,
      });

      if (response.data?.success && response.data?.structured_questions) {
        console.log(
          "✅ New questions generated:",
          response.data.structured_questions.length
        );

        // Refresh session data to get updated questions
        await fetchSessionDetailById();

        toast.success(
          `${response.data.structured_questions.length} new questions added successfully`
        );
      } else {
        console.error("❌ Unexpected response format:", response.data);
        toast.error("Failed to generate new questions");
      }
    } catch (err) {
      console.error("❌ Generate more questions error:", err);
      toast.error("Could not generate more questions. Please try again.");
    } finally {
      setIsLoadingMoreQuestions(false);
    }
  };

  // 📚 Handle "Learn More"
  const handleLearnMore = (question) => {
    console.log("🔍 Learn More clicked for:", question.question);
    setSelectedQuestion(question);
    setShowExplanation(true);
  };

  // 📌 Toggle pin/unpin question
  const toggleQuestionPinAnswer = async (questionId, currentStatus) => {
    if (!questionId) {
      toast.error("Question ID is required");
      return;
    }

    try {
      let apiUrl;
      if (typeof API_ROUTES.TOGGLE_PIN_QUESTION === "function") {
        apiUrl = API_ROUTES.TOGGLE_PIN_QUESTION(questionId);
      } else if (typeof API_ROUTES.TOGGLE_PIN_QUESTION === "string") {
        apiUrl = API_ROUTES.TOGGLE_PIN_QUESTION.replace(":id", questionId);
      } else {
        apiUrl = `/api/questions/${questionId}/pin`;
      }

      console.log("📌 Toggling pin for question:", questionId);
      console.log("📌 Current status:", currentStatus);

      const response = await axiosInstance.patch(apiUrl);

      if (response.data?.success) {
        // 🎯 FIX: Update sessionData and re-sort questions
        setSessionData((prevData) => {
          const updatedQuestions = prevData.questions.map((q) =>
            q._id === questionId
              ? {
                  ...q,
                  pinned: response.data.pinned,
                  isPinned: response.data.pinned,
                }
              : q
          );

          // Sort the updated questions
          const sortedQuestions = sortQuestions(updatedQuestions);

          return {
            ...prevData,
            questions: sortedQuestions,
          };
        });

        toast.success(
          response.data.pinned
            ? "📌 Question pinned to top"
            : "📌 Question unpinned"
        );
      } else {
        throw new Error(response.data?.message || "Failed to toggle pin");
      }
    } catch (err) {
      console.error("❌ Toggle pin error:", err);
      toast.error("Failed to update pin status. Please try again.");
    }
  };

  // ❌ Close explanation drawer
  const closeExplanationDrawer = () => {
    setShowExplanation(false);
    setSelectedQuestion(null);
  };

  // 🚀 Initialize component
  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailById();
    } else {
      setErrorMsg("No session ID provided");
    }
  }, [sessionId]);

  // ... Loading and error states remain the same ...

  // 🎯 NEW: Get questions data for rendering
  const { pinnedQuestions, unpinnedQuestions } =
    getPinnedAndUnpinnedQuestions();
  const allQuestions = getSortedQuestions();

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
          {/* 🔄 Generate More Questions Button */}
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
                  Generating Questions...
                </span>
              ) : (
                "➕ Generate More Questions"
              )}
            </button>

            {/* 🎯 NEW: Show pin status info */}
            {sessionData?.questions?.length > 0 && (
              <div className="text-sm text-gray-500 mt-2">
                <p>💡 This will generate 5 new questions with answers only.</p>
                {pinnedQuestions.length > 0 && (
                  <p className="text-blue-600 font-medium">
                    📌 {pinnedQuestions.length} pinned question
                    {pinnedQuestions.length > 1 ? "s" : ""} shown at top
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 📝 Questions List */}
          <AnimatePresence>
            {!sessionData?.questions || sessionData.questions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-gray-500 py-8"
              >
                <p className="text-lg mb-4">🎯 No questions available yet.</p>
                <p className="text-sm mb-6">
                  Generate your first set of interview questions to get started!
                </p>
                <button
                  onClick={generateMoreQuestions}
                  disabled={isLoadingMoreQuestions}
                  className={`px-6 py-3 text-white rounded-lg font-medium transition ${
                    isLoadingMoreQuestions
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isLoadingMoreQuestions
                    ? "🔄 Generating..."
                    : "🚀 Generate First Questions"}
                </button>
              </motion.div>
            ) : (
              <>
                {/* 🎯 NEW: Pinned Questions Section */}
                {pinnedQuestions.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center mb-4 text-blue-600">
                      <LuPin className="w-5 h-5 mr-2" />
                      <h3 className="font-semibold text-lg">
                        Pinned Questions ({pinnedQuestions.length})
                      </h3>
                    </div>

                    {pinnedQuestions.map((data, index) => (
                      <motion.div
                        key={`pinned-${data._id || index}`}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                          duration: 0.4,
                          type: "spring",
                          stiffness: 100,
                          delay: index * 0.1,
                          damping: 15,
                        }}
                        layout
                        layoutId={`question-${data._id || index}`}
                        className="border-l-4 border-blue-500 pl-4 mb-4"
                      >
                        <QuestionCard
                          question={data?.question || ""}
                          answer={data?.answer || ""}
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

                {/* 🎯 NEW: Regular Questions Section */}
                {unpinnedQuestions.length > 0 && (
                  <div>
                    {pinnedQuestions.length > 0 && (
                      <div className="flex items-center mb-4 text-gray-600">
                        <h3 className="font-semibold text-lg">
                          Other Questions ({unpinnedQuestions.length})
                        </h3>
                      </div>
                    )}

                    {unpinnedQuestions.map((data, index) => (
                      <motion.div
                        key={`unpinned-${data._id || index}`}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                          duration: 0.4,
                          type: "spring",
                          stiffness: 100,
                          delay: (pinnedQuestions.length + index) * 0.1,
                          damping: 15,
                        }}
                        layout
                        layoutId={`question-${data._id || index}`}
                      >
                        <QuestionCard
                          question={data?.question || ""}
                          answer={data?.answer || ""}
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

        {/* 📚 AI Explanation Drawer */}
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

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { LuCircleAlert } from "react-icons/lu";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import { toast } from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_ROUTES } from "../../utils/apiPaths";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import RoleInfoHeader from "../InterviewPrep/components/RoleInfoHeader";

const InterviewPrep = () => {
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);

  // 1. Fetch session details
  const fetchSessionDetailById = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(
        `${API_ROUTES.GET_SESSION_BY_ID}/${sessionId}`
      );
      setSessionData(res.data.session);
    } catch (err) {
      console.error("Fetch session error:", err);
      setErrorMsg("Failed to load session data.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Generate explanation for a question
  const generateConceptExplanation = async (questionId, questionText) => {
    setIsUpdateLoader(true);
    try {
      const res = await axiosInstance.post(API_ROUTES.GENERATE_EXPLANATIONS, {
        question: questionText,
      });
      const explanationText = res.data.explanation;

      setExplanation(explanationText);
      setOpenLearnMoreDrawer(true);
    } catch (err) {
      toast.error("Failed to generate explanation.");
    } finally {
      setIsUpdateLoader(false);
    }
  };

  // 3. Toggle pin/unpin answer
  const toggleQuestionPinAnswer = async (questionId, currentStatus) => {
    try {
      await axiosInstance.patch(API_ROUTES.TOGGLE_PIN_QUESTION, {
        questionId,
        pinned: !currentStatus,
      });
      fetchSessionDetailById(); // refresh state
    } catch (err) {
      toast.error("Failed to update pin status.");
    }
  };

  // 4. Upload more questions
  const uploadMoreQuestions = async () => {
    try {
      await axiosInstance.post(API_ROUTES.GENERATE_MORE_QUESTIONS, {
        sessionId,
        numberOfQuestions: 5,
      });
      fetchSessionDetailById();
    } catch (err) {
      toast.error("Could not load more questions.");
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailById();
    }
  }, [sessionId]);

  if (isLoading) return <SpinnerLoader />;

  if (errorMsg) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        <LuCircleAlert className="inline-block text-3xl mb-1" />
        <p>{errorMsg}</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicsToFocus={sessionData?.topicsToFocus || ""}
        experience={sessionData?.experience || "-"}
        questions={sessionData?.questions?.length || "-"}
        description={sessionData?.description || ""}
        lastUpdated={
          sessionData?.updatedAt
            ? moment(sessionData.updatedAt).format("Do MMM YYYY")
            : ""
        }
      />

      <div className="p-4 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Interview Session</h2>

        <div className="space-y-4">
          {sessionData?.questions?.map((q) => (
            <div key={q._id} className="p-4 border rounded shadow">
              <div className="flex justify-between items-start">
                <p className="font-medium text-gray-800">{q.question}</p>
                <button
                  onClick={() => toggleQuestionPinAnswer(q._id, q.pinned)}
                  className={`text-sm ${
                    q.pinned ? "text-blue-600" : "text-gray-400"
                  } hover:text-blue-700`}
                >
                  📌 {q.pinned ? "Unpin" : "Pin"}
                </button>
              </div>

              <div className="mt-2">
                <button
                  onClick={() => generateConceptExplanation(q._id, q.question)}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Learn More →
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={uploadMoreQuestions}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Load More Questions
          </button>
        </div>

        <AnimatePresence>
          {openLearnMoreDrawer && explanation && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg z-50 p-6 overflow-y-auto"
            >
              <button
                onClick={() => setOpenLearnMoreDrawer(false)}
                className="text-gray-500 hover:text-gray-800 mb-4"
              >
                Close ✖
              </button>
              <h3 className="text-lg font-semibold mb-2">Explanation</h3>
              <p className="text-gray-700 whitespace-pre-line">{explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;

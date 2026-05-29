// src/pages/interview/SessionPage.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import apiClient from "../../services/apiClients.js";

const SessionPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }, [elapsedSeconds]);

  // TIMER
  useEffect(() => {
    let timer;

    if (session?.status === "active") {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [session]);

  // FETCH SESSION
  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await apiClient.get(
          `/sessions/${sessionId}`
        );

        const sessionData = data?.session || data;

        setSession(sessionData);

        if (sessionData?.questions?.length > 0) {
          setCurrentQuestion(sessionData.questions[0]);
          setCurrentQuestionIndex(0);
        }
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.customMessage ||
          "Failed to load session";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  // REFRESH SESSION
  const refreshSession = async () => {
    const { data } = await apiClient.get(
      `/sessions/${sessionId}`
    );

    const sessionData = data?.session || data;

    setSession(sessionData);

    return sessionData;
  };

  // SUBMIT ANSWER
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    if (!currentQuestion) {
      toast.error("No active question");
      return;
    }

    if (!answer.trim()) {
      toast.error("Please write your answer");
      return;
    }

    try {
      setSubmitting(true);
      setFeedback(null);

      const payload = {
        sessionId,
        questionId: currentQuestion._id,
        userAnswer: answer.trim(),
        timeTaken: elapsedSeconds,
      };

      const { data } = await apiClient.post(
        "/answers/evaluate",
        payload
      );

      const evaluation =
        data?.data?.evaluation || data?.evaluation;

      setFeedback(evaluation);

      toast.success("Answer evaluated");

      await refreshSession();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.customMessage ||
        "Failed to evaluate answer";

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // NEXT ADAPTIVE QUESTION
  const handleGenerateNextQuestion = async () => {
    try {
      setGenerating(true);

      const { data } = await apiClient.get(
        `/adaptive/next?sessionId=${sessionId}`
      );

      const nextQuestion =
        data?.data?.question || data?.question;

      if (!nextQuestion) {
        toast.error("No next question generated");
        return;
      }

      setCurrentQuestion(nextQuestion);
      setCurrentQuestionIndex((prev) => prev + 1);

      setAnswer("");
      setFeedback(null);
      setElapsedSeconds(0);

      toast.success("Adaptive question generated");

      await refreshSession();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.customMessage ||
        "Failed to generate next question";

      toast.error(message);
    } finally {
      setGenerating(false);
    }
  };

  // CHANGE QUESTION
  const handleSelectQuestion = (question, index) => {
    setCurrentQuestion(question);
    setCurrentQuestionIndex(index);

    setAnswer("");
    setFeedback(null);
    setElapsedSeconds(0);
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-300">Loading session...</p>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
          <h2 className="text-2xl font-semibold">
            Failed to load session
          </h2>

          <p className="text-slate-400 mt-3">{error}</p>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-6 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[1.8fr_1fr] gap-6">
        {/* MAIN */}
        <div className="space-y-6">
          {/* HEADER */}
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-indigo-400">
                  Adaptive Interview Session
                </p>

                <h1 className="text-2xl md:text-3xl font-bold mt-1">
                  {session?.jobRole}
                </h1>

                <p className="text-slate-400 mt-2">
                  {session?.experienceLevel} •{" "}
                  {session?.difficulty}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-slate-700 px-4 py-3 text-center min-w-28">
                  <p className="text-xs text-slate-400">
                    Timer
                  </p>

                  <p className="text-lg font-semibold">
                    {formattedTime}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-700 px-4 py-3 text-center min-w-28">
                  <p className="text-xs text-slate-400">
                    Progress
                  </p>

                  <p className="text-lg font-semibold">
                    {currentQuestionIndex + 1}/
                    {session?.questions?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* QUESTION */}
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
            <div className="flex justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-slate-400">
                  Current Question
                </p>

                <h2 className="text-xl md:text-2xl font-semibold mt-1">
                  {currentQuestion?.question}
                </h2>
              </div>

              <div className="text-right text-sm text-slate-400">
                <p>{currentQuestion?.type}</p>
                <p>{currentQuestion?.difficulty}</p>
              </div>
            </div>

            <form
              onSubmit={handleSubmitAnswer}
              className="space-y-4"
            >
              <textarea
                rows={10}
                value={answer}
                onChange={(e) =>
                  setAnswer(e.target.value)
                }
                placeholder="Write your answer here..."
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-white outline-none focus:border-indigo-500 resize-none"
              />

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-3 font-semibold transition-all disabled:opacity-60"
                >
                  {submitting
                    ? "Evaluating..."
                    : "Submit Answer"}
                </button>

                <button
                  type="button"
                  onClick={handleGenerateNextQuestion}
                  disabled={generating}
                  className="rounded-xl border border-slate-700 hover:border-indigo-500 px-5 py-3 font-semibold transition-all disabled:opacity-60"
                >
                  {generating
                    ? "Generating..."
                    : "Next Adaptive Question"}
                </button>
              </div>
            </form>
          </section>

          {/* FEEDBACK */}
          {feedback && (
            <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h3 className="text-xl font-semibold">
                  AI Feedback
                </h3>

                <span className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300">
                  Score: {feedback?.score || 0}
                </span>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-slate-400 mb-2">
                    Strengths
                  </p>

                  <ul className="list-disc list-inside text-slate-200 space-y-1">
                    {(feedback?.strengths || []).map(
                      (item, index) => (
                        <li key={index}>{item}</li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <p className="text-slate-400 mb-2">
                    Weaknesses
                  </p>

                  <ul className="list-disc list-inside text-slate-200 space-y-1">
                    {(feedback?.weaknesses || []).map(
                      (item, index) => (
                        <li key={index}>{item}</li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <p className="text-slate-400 mb-2">
                    Feedback
                  </p>

                  <p className="text-slate-200 leading-6">
                    {feedback?.feedback}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 mb-2">
                    Ideal Answer
                  </p>

                  <p className="text-slate-200 leading-6">
                    {feedback?.idealAnswer}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 mb-2">
                    Follow-up Question
                  </p>

                  <p className="text-slate-200 leading-6">
                    {feedback?.followUpQuestion}
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6">
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-lg font-semibold mb-4">
              Session Questions
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-auto">
              {(session?.questions || []).map(
                (question, index) => (
                  <button
                    key={question._id}
                    onClick={() =>
                      handleSelectQuestion(
                        question,
                        index
                      )
                    }
                    className={`w-full text-left rounded-2xl border px-4 py-3 transition-all ${
                      currentQuestion?._id ===
                      question._id
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-800 bg-slate-950/60 hover:border-slate-600"
                    }`}
                  >
                    <p className="text-sm text-slate-400 mb-1">
                      Question {index + 1}
                    </p>

                    <p className="text-sm font-medium text-slate-200 line-clamp-2">
                      {question.question}
                    </p>
                  </button>
                )
              )}
            </div>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-lg font-semibold mb-3">
              Session Info
            </h3>

            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">
                  Status
                </span>

                <span>{session?.status}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">
                  Questions
                </span>

                <span>
                  {session?.questions?.length || 0}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">
                  Score
                </span>

                <span>
                  {Math.round(session?.score || 0)}
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default SessionPage;

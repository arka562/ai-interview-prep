import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import Loader from "../../components/ui/Loader.jsx";
import apiClient from "../../services/apiClient.js";
import { downloadSessionReport } from "../../utils/reportPdf.js";

const SessionDetailPage = () => {
  const { sessionId } = useParams();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await apiClient.get(`/sessions/${sessionId}`);
        const sessionData = data?.data || data?.session || data;

        setSession(sessionData);
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.customMessage ||
          "Failed to load session details";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) fetchSession();
  }, [sessionId]);

  const handleDownloadReport = async () => {
    try {
      setDownloading(true);
      await downloadSessionReport(session);
    } catch {
      toast.error("Failed to generate report");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Loader label="Loading session details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-6 text-center">
          <h2 className="text-2xl font-semibold">Could not load session</h2>
          <p className="text-slate-400 mt-3">{error}</p>
          <Link
            to="/interview/history"
            className="inline-flex mt-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 font-medium"
          >
            Back to History
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-6 md:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card as="section" className="rounded-3xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <p className="text-sm text-indigo-400">Session Details</p>
              <h1 className="text-2xl md:text-3xl font-bold mt-1">
                {session?.jobRole}
              </h1>
              <p className="text-slate-400 mt-2">
                {session?.experienceLevel} • {session?.difficulty} • {session?.status}
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-slate-700 px-4 py-3">
                  <p className="text-slate-400">Score</p>
                  <p className="text-xl font-semibold mt-1">{Math.round(session?.score || 0)}</p>
                </div>
                <div className="rounded-2xl border border-slate-700 px-4 py-3">
                  <p className="text-slate-400">Questions</p>
                  <p className="text-xl font-semibold mt-1">{session?.questions?.length || 0}</p>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleDownloadReport}
                disabled={downloading}
                className="w-full"
              >
                {downloading ? "Preparing Report..." : "Download Report"}
              </Button>
            </div>
          </div>

          <p className="text-slate-400 mt-4 max-w-3xl">
            {session?.description || "No description available for this session."}
          </p>
        </Card>

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-4">Topics To Focus</h2>
          <div className="flex flex-wrap gap-2">
            {(session?.topicsToFocus || []).length > 0 ? (
              session.topicsToFocus.map((topic, index) => (
                <span
                  key={index}
                  className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300"
                >
                  {topic}
                </span>
              ))
            ) : (
              <p className="text-slate-400 text-sm">No topics selected.</p>
            )}
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-4">Questions</h2>
          <div className="space-y-4">
            {(session?.questions || []).length > 0 ? (
              session.questions.map((question, index) => (
                <div
                  key={question._id || index}
                  className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-400 mb-2">Question {index + 1}</p>
                      <h3 className="text-lg font-medium text-slate-100">
                        {question.question}
                      </h3>
                    </div>
                    <div className="text-sm text-slate-400 md:text-right">
                      <p>Type: {question.type || "technical"}</p>
                      <p>Difficulty: {question.difficulty || "medium"}</p>
                    </div>
                  </div>

                  {question.idealAnswer ? (
                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                      <p className="text-sm text-slate-400 mb-2">Ideal Answer</p>
                      <p className="text-slate-300 text-sm leading-6">
                        {question.idealAnswer}
                      </p>
                    </div>
                  ) : null}

                  {question.userNotes ? (
                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                      <p className="text-sm text-slate-400 mb-2">Your Notes</p>
                      <p className="text-slate-300 text-sm leading-6">
                        {question.userNotes}
                      </p>
                    </div>
                  ) : null}

                  <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                    <span className={`rounded-full px-3 py-1 border ${question.pinned ? "border-indigo-500 text-indigo-400" : "border-slate-700 text-slate-400"}`}>
                      {question.pinned ? "Pinned" : "Not pinned"}
                    </span>
                    <span className="text-slate-500">
                      {question.type || "technical"} • {question.difficulty || "medium"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm">No questions available.</p>
            )}
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-4">Session Timeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-slate-400">Started At</p>
              <p className="text-slate-200 mt-2">
                {session?.startedAt ? new Date(session.startedAt).toLocaleString() : "N/A"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-slate-400">Ended At</p>
              <p className="text-slate-200 mt-2">
                {session?.endedAt ? new Date(session.endedAt).toLocaleString() : "N/A"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-slate-400">Last Activity</p>
              <p className="text-slate-200 mt-2">
                {session?.lastActivityAt ? new Date(session.lastActivityAt).toLocaleString() : "N/A"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SessionDetailPage;

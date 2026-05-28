// src/pages/interview/SessionHistoryPage.jsx

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import apiClient from "../services/apiClient.js";

const SessionHistoryPage = () => {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    jobRole: "",
    experienceLevel: "fresher",
    difficulty: "medium",
    topicsToFocus: "",
    description: "",
  });

  // FETCH SESSIONS
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);

        const { data } = await apiClient.get(
          "/sessions/my-session"
        );

        setSessions(data || []);
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.customMessage ||
          "Failed to fetch sessions";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // CREATE SESSION
  const handleCreateSession = async (e) => {
    e.preventDefault();

    if (!formData.jobRole.trim()) {
      toast.error("Job role is required");
      return;
    }

    try {
      setCreating(true);

      const payload = {
        ...formData,
        topicsToFocus: formData.topicsToFocus
          .split(",")
          .map((topic) => topic.trim())
          .filter(Boolean),
      };

      const { data } = await apiClient.post(
        "/sessions",
        payload
      );

      const createdSession =
        data?.session || data?.data || data;

      toast.success("Session created successfully");

      navigate(
        `/interview/session/${createdSession._id}`
      );
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.customMessage ||
        "Failed to create session";

      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-6 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[1.1fr_1.8fr] gap-6">
        {/* CREATE SESSION */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 h-fit">
          <div className="mb-6">
            <p className="text-sm text-indigo-400">
              Adaptive Interview
            </p>

            <h1 className="text-2xl md:text-3xl font-bold mt-1">
              Create New Session
            </h1>

            <p className="text-slate-400 mt-2">
              Start a personalized AI interview session.
            </p>
          </div>

          <form
            onSubmit={handleCreateSession}
            className="space-y-5"
          >
            {/* JOB ROLE */}
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Job Role
              </label>

              <input
                type="text"
                name="jobRole"
                value={formData.jobRole}
                onChange={handleChange}
                placeholder="Frontend Developer"
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>

            {/* EXPERIENCE */}
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Experience Level
              </label>

              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-white outline-none focus:border-indigo-500"
              >
                <option value="fresher">
                  Fresher
                </option>

                <option value="junior">
                  Junior
                </option>

                <option value="mid">
                  Mid-Level
                </option>

                <option value="senior">
                  Senior
                </option>
              </select>
            </div>

            {/* DIFFICULTY */}
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Difficulty
              </label>

              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-white outline-none focus:border-indigo-500"
              >
                <option value="easy">
                  Easy
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="hard">
                  Hard
                </option>
              </select>
            </div>

            {/* TOPICS */}
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Topics To Focus
              </label>

              <input
                type="text"
                name="topicsToFocus"
                value={formData.topicsToFocus}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Description
              </label>

              <textarea
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell AI what kind of interview you want..."
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-white outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 transition-all py-3 font-semibold disabled:opacity-60"
            >
              {creating
                ? "Creating Session..."
                : "Create Session"}
            </button>
          </form>
        </section>

        {/* SESSION HISTORY */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-indigo-400">
                Interview History
              </p>

              <h2 className="text-2xl font-bold mt-1">
                Previous Sessions
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400">
              Loading sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="py-16 text-center">
              <h3 className="text-xl font-semibold">
                No sessions found
              </h3>

              <p className="text-slate-400 mt-2">
                Create your first adaptive interview session.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <Link
                  key={session._id}
                  to={`/interview/session/${session._id}`}
                  className="block rounded-2xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500 transition-all p-5"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {session.jobRole}
                      </h3>

                      <p className="text-slate-400 mt-2">
                        {session.experienceLevel} •{" "}
                        {session.difficulty}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {(session.topicsToFocus || []).map(
                          (topic, index) => (
                            <span
                              key={index}
                              className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300"
                            >
                              {topic}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-start lg:items-end gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          session.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : session.status === "paused"
                            ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                            : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        }`}
                      >
                        {session.status}
                      </span>

                      <p className="text-sm text-slate-400">
                        Questions:{" "}
                        {session.questions?.length || 0}
                      </p>

                      <p className="text-sm text-slate-400">
                        Score:{" "}
                        {Math.round(session.score || 0)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SessionHistoryPage;
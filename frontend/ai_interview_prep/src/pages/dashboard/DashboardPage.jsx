import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/hooks.js";

const DashboardPage = () => {
  const { userInfo } = useAppSelector((state) => state.auth);

  const quickActions = [
    {
      title: "Start Interview",
      desc: "Create a new adaptive session",
      to: "/interview/history",
    },
    {
      title: "Upload Resume",
      desc: "Generate personalized questions",
      to: "/resume/upload",
    },
    {
      title: "View Analytics",
      desc: "Track skill growth and weak areas",
      to: "/analytics",
    },
  ];

  const stats = [
    { label: "Sessions", value: "0" },
    { label: "Questions Answered", value: "0" },
    { label: "Average Score", value: "0%" },
    { label: "Weak Topics", value: "0" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
          <p className="text-sm text-indigo-400 mb-2">Welcome back</p>
          <h1 className="text-3xl md:text-4xl font-bold">
            {userInfo?.name || "User"}, keep building your interview strength
          </h1>
          <p className="text-slate-400 mt-3 max-w-2xl">
            Your AI interview coach tracks performance, finds weak areas, and adapts
            every next question based on your answers.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
            >
              <p className="text-sm text-slate-400">{item.label}</p>
              <h3 className="text-3xl font-bold mt-2">{item.value}</h3>
            </div>
          ))}
        </section>

        <section>
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-semibold">Quick Actions</h2>
              <p className="text-slate-400 text-sm mt-1">
                Jump into the most important parts of the platform.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.to}
                className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500 transition-all"
              >
                <h3 className="text-xl font-semibold group-hover:text-indigo-400 transition-colors">
                  {action.title}
                </h3>
                <p className="text-slate-400 mt-2 text-sm">{action.desc}</p>
                <span className="inline-flex mt-5 text-sm text-indigo-400">
                  Open →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-3">Current Focus</h2>
            <p className="text-slate-400 text-sm mb-4">
              No active session yet. Start one to see adaptive questions, AI feedback,
              and skill updates here.
            </p>
            <Link
              to="/interview/history"
              className="inline-flex rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-medium transition-all"
            >
              Create Session
            </Link>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-3">Skill Profile Preview</h2>
            <p className="text-slate-400 text-sm mb-4">
              Once you answer questions, this area will show topic-wise confidence,
              recommended difficulty, and improvement trend.
            </p>
            <Link
              to="/analytics"
              className="inline-flex rounded-xl border border-slate-700 hover:border-indigo-500 px-4 py-2 text-sm font-medium transition-all"
            >
              Open Analytics
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;

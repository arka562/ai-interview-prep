import Card from "../ui/Card.jsx";

const SessionHeader = ({
  session,
  formattedTime,
  currentQuestionIndex,
  totalQuestions,
}) => {
  return (
    <Card as="section" className="rounded-3xl p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-indigo-400">Adaptive Interview Session</p>

          <h1 className="mt-1 text-2xl font-bold md:text-3xl">
            {session?.jobRole}
          </h1>

          <p className="mt-2 text-slate-400">
            {session?.experienceLevel} • {session?.difficulty}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="min-w-28 rounded-2xl border border-slate-700 px-4 py-3 text-center">
            <p className="text-xs text-slate-400">Timer</p>
            <p className="text-lg font-semibold">{formattedTime}</p>
          </div>

          <div className="min-w-28 rounded-2xl border border-slate-700 px-4 py-3 text-center">
            <p className="text-xs text-slate-400">Progress</p>
            <p className="text-lg font-semibold">
              {currentQuestionIndex + 1}/{totalQuestions}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SessionHeader;

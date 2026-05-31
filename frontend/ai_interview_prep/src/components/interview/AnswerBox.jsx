import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";
import useSpeechRecognition from "../../hooks/useSpeechRecognition.js";

const AnswerBox = ({
  answer,
  currentQuestion,
  generating,
  onAnswerChange,
  onGenerateNextQuestion,
  onSubmit,
  submitting,
}) => {
  const {
    error: speechError,
    isListening,
    isSupported,
    toggleListening,
  } = useSpeechRecognition({
    onTranscript: (transcript) => {
      onAnswerChange((answer ? `${answer} ` : "") + transcript);
    },
  });

  return (
    <Card as="section" className="rounded-3xl p-6 md:p-8">
      <div className="mb-6 flex justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Current Question</p>

          <h2 className="mt-1 text-xl font-semibold md:text-2xl">
            {currentQuestion?.question}
          </h2>
        </div>

        <div className="text-right text-sm text-slate-400">
          <p>{currentQuestion?.type}</p>
          <p>{currentQuestion?.difficulty}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <textarea
            rows={10}
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Write your answer here or use voice input..."
            className="w-full resize-none rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />

          <div className="flex flex-col gap-2 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
            <span>
              {isSupported
                ? isListening
                  ? "Listening... speak your answer clearly."
                  : "Voice input is available for this browser."
                : "Voice input is not supported in this browser."}
            </span>

            {speechError ? (
              <span className="text-rose-300">{speechError}</span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={toggleListening}
            disabled={!isSupported || submitting}
            variant={isListening ? "danger" : "secondary"}
            size="lg"
            className="font-semibold"
          >
            {isListening ? "Stop Voice" : "Start Voice"}
          </Button>

          <Button
            type="submit"
            disabled={submitting}
            size="lg"
            className="font-semibold"
          >
            {submitting ? "Evaluating..." : "Submit Answer"}
          </Button>

          <Button
            type="button"
            onClick={onGenerateNextQuestion}
            disabled={generating}
            variant="secondary"
            size="lg"
            className="font-semibold"
          >
            {generating ? "Generating..." : "Next Adaptive Question"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AnswerBox;

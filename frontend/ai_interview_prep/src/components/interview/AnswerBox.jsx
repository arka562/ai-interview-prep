import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";
import VoiceModePanel from "./VoiceModePanel.jsx";
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
    clearTranscript,
    durationSeconds,
    error: speechError,
    isListening,
    isSupported,
    transcript,
    toggleListening,
  } = useSpeechRecognition();

  const formattedVoiceTime = `${String(Math.floor(durationSeconds / 60)).padStart(
    2,
    "0"
  )}:${String(durationSeconds % 60).padStart(2, "0")}`;

  const handleUseVoiceDraft = () => {
    if (!transcript) return;

    onAnswerChange(`${answer ? `${answer.trim()} ` : ""}${transcript}`.trim());
    clearTranscript();
  };

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
        </div>

        <VoiceModePanel
          duration={formattedVoiceTime}
          error={speechError}
          isListening={isListening}
          isSupported={isSupported}
          onClearDraft={clearTranscript}
          onToggleListening={toggleListening}
          onUseDraft={handleUseVoiceDraft}
          transcript={transcript}
        />

        <div className="flex flex-wrap gap-3">
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

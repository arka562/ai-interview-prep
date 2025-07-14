import React, { useState, useRef, useEffect } from "react";
import {
  LuChevronDown,
  LuPin,
  LuPinOff,
  LuSparkles,
  LuPencil,
} from "react-icons/lu";
import AIResponse from "../../pages/InterviewPrep/components/AIResponsePreview"; // Import the new AIResponse component

const QuestionCard = ({
  question,
  answer,
  onLearnMore,
  isPinned,
  onTogglePin,
  questionId, // Add questionId prop for better tracking
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const [showAIResponse, setShowAIResponse] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(contentHeight + 10); // Optional extra spacing
    } else {
      setHeight(0);
    }
  }, [isExpanded, showAIResponse]);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleLearnMore = () => {
    if (onLearnMore) {
      onLearnMore();
    }
    setShowAIResponse(true);
  };

  const closeAIResponse = () => {
    setShowAIResponse(false);
  };

  return (
    <div className="border p-4 rounded-xl shadow-md bg-white mb-4 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="font-semibold text-lg w-full pr-4">{question}</div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={onTogglePin}
            title={isPinned ? "Unpin Question" : "Pin Question"}
            className={`p-1 rounded hover:bg-gray-100 transition-colors ${
              isPinned ? "text-blue-600" : "text-gray-500"
            }`}
          >
            {isPinned ? <LuPinOff size={20} /> : <LuPin size={20} />}
          </button>
          <button
            onClick={toggleExpand}
            title={isExpanded ? "Collapse Answer" : "Expand Answer"}
            className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-500"
          >
            <LuChevronDown
              size={20}
              className={`transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className="overflow-hidden transition-all duration-300"
        style={{ height }}
      >
        <div ref={contentRef} className="mt-3 text-gray-700">
          {/* Show AI Response if active */}
          {showAIResponse ? (
            <AIResponse
              question={question}
              questionId={questionId}
              onClose={closeAIResponse}
              onLearnMore={onLearnMore}
            />
          ) : (
            <div className="space-y-2">
              {/* Render existing answer if available */}
              {answer && answer.trim() ? (
                <>
                  {answer.split("\n").map((line, idx) => {
                    // render bullet points as list items
                    if (line.trim().startsWith("•")) {
                      return (
                        <li key={idx} className="list-disc list-inside ml-4">
                          {line.replace(/^•\s*/, "")}
                        </li>
                      );
                    }
                    // render headings like "Follow-up:" or "Evaluation:"
                    if (
                      /^(Key Points|Follow-up|Evaluation|Answer):/i.test(line)
                    ) {
                      return (
                        <p
                          key={idx}
                          className="font-semibold mt-4 text-gray-800"
                        >
                          {line}
                        </p>
                      );
                    }
                    // skip empty lines
                    if (!line.trim()) {
                      return null;
                    }
                    // render normal paragraph
                    return (
                      <p key={idx} className="text-gray-700 leading-relaxed">
                        {line}
                      </p>
                    );
                  })}
                </>
              ) : (
                <p className="text-gray-500 italic">
                  No answer provided yet. Click "Get AI Answer" to generate one.
                </p>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100">
                {onLearnMore && (
                  <button
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-2 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium"
                    onClick={handleLearnMore}
                  >
                    <LuSparkles size={16} />
                    {answer && answer.trim()
                      ? "Learn More (AI Explain)"
                      : "Get AI Answer"}
                  </button>
                )}

                {answer && answer.trim() && (
                  <button
                    className="text-gray-600 hover:text-gray-800 flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                    onClick={() => setShowAIResponse(true)}
                  >
                    <LuPencil size={16} />
                    Edit Answer
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;

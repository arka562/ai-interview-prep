import React, { useState, useRef, useEffect } from "react";
import {
  LuChevronDown,
  LuPin,
  LuPinOff,
  LuSparkles,
  LuPencil,
} from "react-icons/lu";
import AIResponse from "../../pages/InterviewPrep/components/AIResponsePreview";

const QuestionCard = ({
  question,
  answer,
  onLearnMore,
  isPinned,
  onTogglePin,
  questionId,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const [showAIResponse, setShowAIResponse] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(contentHeight + 10);
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
    <div className="question-card">
      <div className="question-header">
        <div className="question-text">{question}</div>
        <div className="action-buttons">
          <button
            onClick={onTogglePin}
            title={isPinned ? "Unpin Question" : "Pin Question"}
            className={`pin-button ${isPinned ? "pinned" : ""}`}
          >
            {isPinned ? <LuPinOff size={20} /> : <LuPin size={20} />}
          </button>
          <button
            onClick={toggleExpand}
            title={isExpanded ? "Collapse Answer" : "Expand Answer"}
            className="expand-button"
          >
            <LuChevronDown
              size={20}
              className={`expand-icon ${isExpanded ? "expanded" : ""}`}
            />
          </button>
        </div>
      </div>

      <div className="answer-container" style={{ height }}>
        <div ref={contentRef} className="answer-content">
          {showAIResponse ? (
            <AIResponse
              question={question}
              questionId={questionId}
              onClose={closeAIResponse}
              onLearnMore={onLearnMore}
            />
          ) : (
            <div className="answer-details">
              {answer && answer.trim() ? (
                <>
                  {answer.split("\n").map((line, idx) => {
                    if (line.trim().startsWith("•")) {
                      return (
                        <li key={idx} className="bullet-point">
                          {line.replace(/^•\s*/, "")}
                        </li>
                      );
                    }
                    if (
                      /^(Key Points|Follow-up|Evaluation|Answer):/i.test(line)
                    ) {
                      return (
                        <p key={idx} className="section-heading">
                          {line}
                        </p>
                      );
                    }
                    if (!line.trim()) {
                      return null;
                    }
                    return (
                      <p key={idx} className="answer-text">
                        {line}
                      </p>
                    );
                  })}
                </>
              ) : (
                <p className="empty-answer">
                  No answer provided yet. Click "Get AI Answer" to generate one.
                </p>
              )}

              <div className="action-buttons-container">
                {onLearnMore && (
                  <button className="ai-button" onClick={handleLearnMore}>
                    <LuSparkles size={16} />
                    {answer && answer.trim()
                      ? "Learn More (AI Explain)"
                      : "Get AI Answer"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .question-card {
          border: 1px solid rgba(203, 213, 225, 0.3);
          padding: 1.5rem;
          border-radius: 1rem;
          background: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }

        .question-card:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .question-text {
          font-weight: 600;
          font-size: 1.125rem;
          color: #1e293b;
          width: 100%;
          padding-right: 1rem;
        }

        .action-buttons {
          display: flex;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .pin-button {
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.2s ease;
          color: #64748b;
        }

        .pin-button:hover {
          background: rgba(226, 232, 240, 0.5);
        }

        .pin-button.pinned {
          color: #6366f1;
        }

        .expand-button {
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.2s ease;
          color: #64748b;
        }

        .expand-button:hover {
          background: rgba(226, 232, 240, 0.5);
        }

        .expand-icon {
          transition: transform 0.3s ease;
        }

        .expand-icon.expanded {
          transform: rotate(180deg);
        }

        .answer-container {
          overflow: hidden;
          transition: height 0.3s ease;
        }

        .answer-content {
          margin-top: 0.75rem;
        }

        .answer-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .bullet-point {
          list-style-type: disc;
          margin-left: 1.5rem;
          color: #475569;
        }

        .section-heading {
          font-weight: 600;
          margin-top: 1rem;
          color: #334155;
          background: linear-gradient(to right, #8b5cf6, #6366f1);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .answer-text {
          color: #475569;
          line-height: 1.6;
        }

        .empty-answer {
          color: #94a3b8;
          font-style: italic;
        }

        .action-buttons-container {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(226, 232, 240, 0.7);
        }

        .ai-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: linear-gradient(to right, #8b5cf6, #6366f1);
          color: white;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(139, 92, 246, 0.2);
        }

        .ai-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);
        }

        .edit-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(226, 232, 240, 0.5);
          color: #475569;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .edit-button:hover {
          background: rgba(203, 213, 225, 0.5);
        }
      `}</style>
    </div>
  );
};

export default QuestionCard;

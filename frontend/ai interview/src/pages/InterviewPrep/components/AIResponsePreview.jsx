import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { LuSparkles, LuX, LuCopy, LuCheck, LuRefreshCw } from "react-icons/lu";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../utils/axiosInstance";
import { API_ROUTES } from "../../../utils/apiPaths";
import SpinnerLoader from "../../../components/Loader/SpinnerLoader";

const AIResponse = ({ question, questionId, onClose, onLearnMore }) => {
  const [aiAnswer, setAiAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState("");

  // Generate AI answer when component mounts
  useEffect(() => {
    if (question && !aiAnswer) {
      generateAIAnswer();
    }
  }, [question]);

  const generateAIAnswer = async () => {
    if (!question) {
      setError("Question is required to generate answer");
      return;
    }

    setIsLoading(true);
    setIsGenerating(true);
    setError("");

    try {
      const response = await axiosInstance.post(
        API_ROUTES.GENERATE_EXPLANATIONS,
        {
          question: question,
        }
      );

      if (response.data?.success && response.data?.explanation) {
        setAiAnswer(response.data.explanation);
      } else {
        setError("Failed to generate AI answer. Please try again.");
      }
    } catch (err) {
      console.error("AI Answer generation error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to generate AI answer. Please try again."
      );
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  const handleCopyAnswer = async () => {
    if (!aiAnswer) return;

    try {
      await navigator.clipboard.writeText(aiAnswer);
      setIsCopied(true);
      toast.success("Answer copied to clipboard!");

      // Reset copy state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy answer");
    }
  };

  const handleRegenerateAnswer = () => {
    setAiAnswer("");
    setError("");
    generateAIAnswer();
  };

  // Custom components for react-markdown
  const markdownComponents = {
    h1: ({ children }) => <h1 className="markdown-h1">{children}</h1>,
    h2: ({ children }) => <h2 className="markdown-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="markdown-h3">{children}</h3>,
    h4: ({ children }) => <h4 className="markdown-h4">{children}</h4>,
    h5: ({ children }) => <h5 className="markdown-h5">{children}</h5>,
    h6: ({ children }) => <h6 className="markdown-h6">{children}</h6>,
    p: ({ children }) => <p className="markdown-p">{children}</p>,
    ul: ({ children }) => <ul className="markdown-ul">{children}</ul>,
    ol: ({ children }) => <ol className="markdown-ol">{children}</ol>,
    li: ({ children }) => <li className="markdown-li">{children}</li>,
    strong: ({ children }) => (
      <strong className="markdown-strong">{children}</strong>
    ),
    em: ({ children }) => <em className="markdown-em">{children}</em>,
    blockquote: ({ children }) => (
      <blockquote className="markdown-blockquote">
        <div className="markdown-blockquote-content">{children}</div>
      </blockquote>
    ),
    code: ({ inline, children }) => {
      if (inline) {
        return <code className="markdown-code-inline">{children}</code>;
      }
      return <code className="markdown-code-block">{children}</code>;
    },
    pre: ({ children }) => <pre className="markdown-pre">{children}</pre>,
    a: ({ href, children }) => (
      <a
        href={href}
        className="markdown-a"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    table: ({ children }) => (
      <div className="markdown-table-container">
        <table className="markdown-table">{children}</table>
      </div>
    ),
    th: ({ children }) => <th className="markdown-th">{children}</th>,
    td: ({ children }) => <td className="markdown-td">{children}</td>,
    hr: () => <hr className="markdown-hr" />,
  };

  // Preprocess the answer to convert common patterns to markdown
  const preprocessAnswer = (answer) => {
    if (!answer) return "";

    let processed = answer;

    // Convert common headings to markdown
    processed = processed.replace(
      /^(Key Points|Follow-up|Evaluation|Answer|What They Are Testing|Why It Matters|Common Mistakes|Pro Tips|Sample Answer Framework|Follow-up Questions|Strategy):/gim,
      "### $1:"
    );

    // Convert numbered sections to markdown headings
    processed = processed.replace(/^(\d+\.\s*[A-Z][^:]*:)/gm, "#### $1");

    // Convert bullet points to markdown
    processed = processed.replace(/^•\s*/gm, "- ");

    // Ensure proper line breaks for paragraphs
    processed = processed.replace(/\n\s*\n/g, "\n\n");

    return processed;
  };

  return (
    <div className="ai-response-container">
      {/* Header */}
      <div className="ai-response-header">
        <div className="ai-response-title">
          <LuSparkles className="ai-response-sparkle-icon" />
          <h3>AI Generated Answer</h3>
        </div>

        <div className="ai-response-actions">
          {/* Action buttons */}
          {aiAnswer && !isLoading && (
            <>
              <button
                onClick={handleCopyAnswer}
                className="ai-response-action-button"
                title="Copy answer"
              >
                {isCopied ? <LuCheck /> : <LuCopy />}
              </button>

              <button
                onClick={handleRegenerateAnswer}
                className="ai-response-action-button"
                title="Regenerate answer"
              >
                <LuRefreshCw />
              </button>
            </>
          )}

          <button
            onClick={onClose}
            className="ai-response-action-button"
            title="Close"
          >
            <LuX />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="ai-response-content">
        {isLoading ? (
          <div className="ai-response-loading">
            <SpinnerLoader />
            <p>{isGenerating ? "Generating AI answer..." : "Loading..."}</p>
          </div>
        ) : error ? (
          <div className="ai-response-error">
            <div className="error-message">
              <p className="error-title">Error generating answer</p>
              <p>{error}</p>
            </div>
            <button onClick={generateAIAnswer} className="retry-button">
              Try Again
            </button>
          </div>
        ) : aiAnswer ? (
          <div className="markdown-container">
            <ReactMarkdown components={markdownComponents}>
              {preprocessAnswer(aiAnswer)}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="ai-response-empty">
            <p>No answer available</p>
            <button onClick={generateAIAnswer} className="generate-button">
              Generate Answer
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      {aiAnswer && !isLoading && (
        <div className="ai-response-footer">
          AI-generated content may contain errors. Please verify important
          information.
        </div>
      )}
    </div>
  );
};

export default AIResponse;

// CSS Styles
const styles = `
.ai-response-container {
  background: linear-gradient(to right, #f0f9ff, #f5f0ff);
  border-radius: 0.5rem;
  padding: 1.5rem;
  border: 1px solid #bfdbfe;
}

.ai-response-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.ai-response-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ai-response-title h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.ai-response-sparkle-icon {
  color: #2563eb;
  font-size: 1.25rem;
}

.ai-response-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ai-response-action-button {
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: transparent;
  border: none;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-response-action-button:hover {
  background: rgba(255, 255, 255, 0.5);
  color: #1f2937;
}

.ai-response-content {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  max-height: 24rem;
  overflow-y: auto;
}

.ai-response-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.ai-response-loading p {
  color: #4b5563;
  margin-top: 1rem;
}

.ai-response-error {
  text-align: center;
  padding: 2rem 0;
}

.error-message {
  color: #ef4444;
  margin-bottom: 1rem;
}

.error-title {
  font-weight: 500;
}

.retry-button {
  padding: 0.5rem 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-button:hover {
  background: #1d4ed8;
}

.ai-response-empty {
  text-align: center;
  padding: 2rem 0;
  color: #6b7280;
}

.generate-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}

.generate-button:hover {
  background: #1d4ed8;
}

.ai-response-footer {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
}

/* Markdown styles */
.markdown-container {
  max-width: 100%;
}

.markdown-h1 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1rem;
  margin-top: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.markdown-h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
  margin-top: 1.25rem;
}

.markdown-h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
  margin-top: 1rem;
}

.markdown-h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
}

.markdown-h5 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  margin-top: 0.75rem;
}

.markdown-h6 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
  margin-top: 0.75rem;
}

.markdown-p {
  color: #374151;
  line-height: 1.625;
  margin-bottom: 0.75rem;
}

.markdown-ul {
  list-style-type: disc;
  list-style-position: inside;
  margin-left: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.markdown-ol {
  list-style-type: decimal;
  list-style-position: inside;
  margin-left: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.markdown-li {
  color: #374151;
  margin-bottom: 0.25rem;
}

.markdown-strong {
  font-weight: 600;
  color: #1f2937;
}

.markdown-em {
  font-style: italic;
  color: #374151;
}

.markdown-blockquote {
  border-left: 4px solid #93c5fd;
  padding-left: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  background: #eff6ff;
  border-radius: 0 0.375rem 0.375rem 0;
}

.markdown-blockquote-content {
  color: #374151;
  font-style: italic;
}

.markdown-code-inline {
  background: #f3f4f6;
  color: #1f2937;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: monospace;
}

.markdown-code-block {
  display: block;
  background: #f3f4f6;
  color: #1f2937;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: monospace;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.markdown-pre {
  background: #f3f4f6;
  color: #1f2937;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: monospace;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.markdown-a {
  color: #2563eb;
  text-decoration: underline;
}

.markdown-a:hover {
  color: #1d4ed8;
}

.markdown-table-container {
  overflow-x: auto;
  margin-bottom: 1rem;
}

.markdown-table {
  min-width: 100%;
  border-collapse: collapse;
  border: 1px solid #d1d5db;
}

.markdown-th {
  border: 1px solid #d1d5db;
  background: #f3f4f6;
  padding: 0.5rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
}

.markdown-td {
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  color: #374151;
}

.markdown-hr {
  margin: 1.5rem 0;
  border: 0;
  border-top: 1px solid #e5e7eb;
}
`;

// Inject styles
const styleElement = document.createElement("style");
styleElement.textContent = styles;
document.head.appendChild(styleElement);

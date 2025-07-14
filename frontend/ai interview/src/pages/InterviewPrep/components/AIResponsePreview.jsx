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
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold text-gray-800 mb-4 mt-6 border-b border-gray-200 pb-2">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-semibold text-gray-800 mb-3 mt-5">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-4">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-base font-semibold text-gray-800 mb-2 mt-4">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-sm font-medium text-gray-700 mb-2 mt-3">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-sm font-medium text-gray-600 mb-2 mt-3">
        {children}
      </h6>
    ),
    p: ({ children }) => (
      <p className="text-gray-700 leading-relaxed mb-3">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside ml-4 mb-4 space-y-1">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside ml-4 mb-4 space-y-1">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="text-gray-700 mb-1">{children}</li>,
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-800">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-300 pl-4 py-2 my-4 bg-blue-50 rounded-r-lg">
        <div className="text-gray-700 italic">{children}</div>
      </blockquote>
    ),
    code: ({ inline, children }) => {
      if (inline) {
        return (
          <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">
            {children}
          </code>
        );
      }
      return (
        <code className="block bg-gray-100 text-gray-800 p-3 rounded-lg overflow-x-auto text-sm font-mono mb-4">
          {children}
        </code>
      );
    },
    pre: ({ children }) => (
      <pre className="bg-gray-100 text-gray-800 p-4 rounded-lg overflow-x-auto text-sm font-mono mb-4">
        {children}
      </pre>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-blue-600 hover:text-blue-700 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border-collapse border border-gray-300">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-gray-300 bg-gray-50 px-4 py-2 text-left font-semibold text-gray-700">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-gray-300 px-4 py-2 text-gray-700">
        {children}
      </td>
    ),
    hr: () => <hr className="my-6 border-gray-200" />,
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
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <LuSparkles className="text-blue-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">
            AI Generated Answer
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Action buttons */}
          {aiAnswer && !isLoading && (
            <>
              <button
                onClick={handleCopyAnswer}
                className="p-2 rounded-lg hover:bg-white/50 transition-colors text-gray-600 hover:text-gray-800"
                title="Copy answer"
              >
                {isCopied ? <LuCheck size={16} /> : <LuCopy size={16} />}
              </button>

              <button
                onClick={handleRegenerateAnswer}
                className="p-2 rounded-lg hover:bg-white/50 transition-colors text-gray-600 hover:text-gray-800"
                title="Regenerate answer"
              >
                <LuRefreshCw size={16} />
              </button>
            </>
          )}

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors text-gray-600 hover:text-gray-800"
            title="Close"
          >
            <LuX size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <SpinnerLoader />
            <p className="text-gray-600 mt-4">
              {isGenerating ? "Generating AI answer..." : "Loading..."}
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <p className="font-medium">Error generating answer</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={generateAIAnswer}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : aiAnswer ? (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown components={markdownComponents}>
              {preprocessAnswer(aiAnswer)}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No answer available</p>
            <button
              onClick={generateAIAnswer}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate Answer
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      {aiAnswer && !isLoading && (
        <div className="mt-4 text-xs text-gray-500 text-center">
          AI-generated content may contain errors. Please verify important
          information.
        </div>
      )}
    </div>
  );
};

export default AIResponse;

import React, { useState } from "react";
import Input from "../../components/Inputs/Input";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance"; // adjust path if needed
import { API_ROUTES } from "../../utils/apiPaths"; // adjust path if needed
import SpinnerLoader from "../../components/Loader/SpinnerLoader";

const CreateSessionForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    topicsToFocus: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Helper function to extract questions from backend response
  const extractQuestions = (aiResponse) => {
    console.log("Full AI Response:", aiResponse);
    console.log("AI Response Data:", aiResponse.data);

    const data = aiResponse.data;

    // Check if response is successful
    if (!data.success) {
      console.error("API returned error:", data.message);
      return null;
    }

    // Your backend returns structured_questions array with full question objects
    if (
      data?.structured_questions &&
      Array.isArray(data.structured_questions)
    ) {
      console.log("Found structured_questions:", data.structured_questions);
      return data.structured_questions;
    }

    console.error("No structured_questions found in response");
    return null;
  };

  // Helper function to format questions for session creation
  const formatQuestions = (dbQuestions) => {
    if (!dbQuestions || !Array.isArray(dbQuestions)) {
      return [];
    }

    // Since your backend already returns full question objects from the database,
    // we just need to extract the relevant fields for session creation
    const formattedQuestions = dbQuestions
      .filter((q) => q && q.question && q.question.trim().length > 0)
      .map((q) => ({
        question: q.question.trim(),
        answer: q.answer || "",
        _id: q._id, // Include the database ID
        isPinned: q.isPinned || false,
      }));

    console.log("Formatted questions for session:", formattedQuestions);
    return formattedQuestions;
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    const { role, experience, topicsToFocus } = formData;

    if (!role || !experience || !topicsToFocus) {
      setError("Please fill all required fields");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Ensure topicsToFocus is properly formatted
      const topicsArray = Array.isArray(topicsToFocus)
        ? topicsToFocus
        : topicsToFocus
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0);

      if (topicsArray.length === 0) {
        setError("Please provide at least one topic to focus on");
        setIsLoading(false);
        return;
      }

      console.log("Generating questions for:", {
        role,
        experience,
        topicsArray,
      });

      // 1. Generate AI questions and create session
      const aiResponse = await axiosInstance.post(
        API_ROUTES.GENERATE_QUESTIONS,
        {
          role,
          experience,
          topicsToFocus: topicsArray,
          numberOfQuestions: 10,
        }
      );

      console.log("AI Response received:", aiResponse.data);

      // 2. Extract questions from response
      const dbQuestions = extractQuestions(aiResponse);

      if (!dbQuestions || dbQuestions.length === 0) {
        console.error("No questions found in AI response");
        const errorMsg =
          aiResponse.data?.message ||
          "Failed to generate questions. Please try again.";
        setError(errorMsg);
        return;
      }

      // 3. Format questions (though they're already in the right format from backend)
      const formattedQuestions = formatQuestions(dbQuestions);

      if (formattedQuestions.length === 0) {
        console.error("No valid questions after formatting");
        setError("No valid questions were generated. Please try again.");
        return;
      }

      console.log("Questions generated successfully:", formattedQuestions);

      // 4. The session was already created by the backend, get the sessionId
      const sessionId = aiResponse.data.sessionId;

      if (!sessionId) {
        console.error("No sessionId returned from backend");
        setError("Failed to create session.");
        return;
      }

      console.log("Session created with ID:", sessionId);

      // 5. Navigate to the session (no need to create session again)
      if (onSuccess) {
        onSuccess();
      }
      navigate(`/interview-prep/${sessionId}`);
    } catch (err) {
      console.error("Full error object:", err);
      console.error("Error response:", err.response);
      console.error("Error response data:", err.response?.data);

      let errorMessage = "Something went wrong. Please try again.";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="p-6 bg-white rounded-xl shadow-md space-y-4 w-full max-w-lg mx-auto"
      onSubmit={handleCreateSession}
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Create New Session
      </h2>

      <Input
        label="Role"
        name="role"
        value={formData.role}
        onChange={handleChange}
        placeholder="e.g. Frontend Developer"
        required
      />

      <Input
        label="Experience"
        name="experience"
        value={formData.experience}
        onChange={handleChange}
        placeholder="e.g. 2 years"
        required
      />

      <Input
        label="Topics to Focus (comma separated)"
        name="topicsToFocus"
        value={formData.topicsToFocus}
        onChange={handleChange}
        placeholder="e.g. React, JavaScript, System Design"
        required
      />

      <Input
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="e.g. Prepare for company X role"
        textarea
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <SpinnerLoader />
            <span>Creating Session...</span>
          </>
        ) : (
          "Create Session"
        )}
      </button>
    </form>
  );
};

export default CreateSessionForm;

import React, { useState } from "react";
import Input from "../../components/Inputs/Input";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance"; // adjust path if needed
import { API_ROUTES } from "../../utils/apiPaths"; // adjust path if needed
import SpinnerLoader from "../../components/Loader/SpinnerLoader";

const CreateSessionForm = () => {
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

  const handleCreateSession = async (e) => {
    e.preventDefault();
    const { role, experience, topicsToFocus } = formData;

    if (!role || !experience || !topicsToFocus) {
      setError("Please fill all fields");
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
        return;
      }

      // 1. Generate AI questions
      const aiResponse = await axiosInstance.post(
        API_ROUTES.GENERATE_QUESTIONS,
        {
          role,
          experience,
          topicsToFocus: topicsArray,
          numberOfQuestions: 10,
        }
      );

      const structured = aiResponse.data?.structured_questions;

      if (!structured || structured.length === 0) {
        setError("Failed to generate questions. Please try again.");
        return;
      }

      // 2. Format and validate questions
      const formattedQuestions = structured
        .filter((q) => typeof q === "string" && q.trim().length > 0)
        .map((q) => ({
          question: q.trim(),
          answer: "",
        }));

      if (formattedQuestions.length === 0) {
        setError("No valid questions were generated. Please try again.");
        return;
      }

      // 3. Create session
      const response = await axiosInstance.post(API_ROUTES.CREATE_SESSION, {
        role,
        experience,
        topicsToFocus: topicsArray,
        description: formData.description || "",
        questions: formattedQuestions,
      });

      if (response.data?.session?._id) {
        navigate(`/interview-prep/${response.data.session._id}`);
      } else {
        setError("Failed to create session.");
      }
    } catch (err) {
      console.error("Full error object:", err);
      console.error("Error response:", err.response);
      console.error("Error response data:", err.response?.data);

      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
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

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <SpinnerLoader />
          </>
        ) : (
          "Create Session"
        )}
      </button>
    </form>
  );
};

export default CreateSessionForm;


// utils/prompts.js

// 🔹 Experience Mapping
const getExperienceLevel = (experience) => {
  if (typeof experience === "string") {
    const exp = experience.toLowerCase();
    const num = parseInt(exp.replace(/[^0-9]/g, ""));

    if (num <= 2 || exp.includes("fresher") || exp.includes("junior")) return "entry-level";
    if (num <= 5 || exp.includes("mid")) return "mid-level";
    return "senior";
  }
  return "mid-level";
};

// 🔹 Question Generator Prompt
export const questionAnswerPrompt = (
  role,
  experience,
  topicsToFocus,
  numberOfQuestions = 5,
  difficulty = "medium"
) => {
  const experienceLevel = getExperienceLevel(experience);

  return {
    version: "v2.0",

    prompt: `
You are an expert interviewer.

Generate ${numberOfQuestions} ${difficulty}-level interview questions for a ${experienceLevel} ${role}.

Focus areas: ${topicsToFocus?.join(", ") || "general topics"}

Rules:
- Mix conceptual, practical, and scenario-based questions
- Avoid generic questions
- Keep answers concise and accurate
- Only provide confident answers

Return strictly in JSON:

[
  {
    "question": "string",
    "answer": "string",
    "keyPoints": ["point1", "point2"],
    "followUp": "string",
    "evaluation": "string"
  }
]
    `.trim(),
  };
};

// 🔹 Explanation Prompt
export const conceptExplainPrompt = (question) => {
  return {
    version: "v2.0",

    prompt: `
Explain the following interview question:

"${question}"

Return JSON:

{
  "concept": "What is being tested",
  "importance": "Why it matters",
  "approach": "How to answer",
  "mistakes": ["mistake1", "mistake2"],
  "tips": ["tip1", "tip2"]
}
    `.trim(),
  };
};


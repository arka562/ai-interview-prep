import { GoogleGenAI } from "@google/genai";
import { conceptExplainPrompt } from "../utils/prompts.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc    Generate AI-based interview questions for a given role/topic
// @route   POST /api/ai/generate
// @access  Private
export const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus,numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus ||numberOfQuestions || !Array.isArray(topics)) {
      return res.status(400).json({ message: "Role, experience, and topics array are required" });
    }

    // Build the dynamic prompt
    const dynamicPrompt = conceptExplainPrompt(role, experience, topics);

    const model = ai.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(dynamicPrompt);
    const response = await result.response;
    const text = await response.text();

    res.status(200).json({ success: true, questions: text });
  } catch (error) {
    console.error("Error generating interview questions:", error.message || error);
    res.status(500).json({ message: "Failed to generate interview questions" });
  }
};


// @desc    Generate AI-based explanation for technical concepts
// @route   POST /api/ai/explain
// @access  Private
export const generateConceptExplanation = async (req, res) => {
  try {
    const { concepts } = req.body;

    if (!concepts || !Array.isArray(concepts) || concepts.length === 0) {
      return res.status(400).json({ message: "Concepts array is required" });
    }

    const prompt = `
You are an expert technical educator.
Please explain the following concepts in simple, interview-friendly language:
${concepts.map((c, i) => `${i + 1}. ${c}`).join("\n")}
Each explanation should be 3-5 sentences long and easy to understand.
`;

    const model = ai.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    res.status(200).json({ success: true, explanation: text });
  } catch (error) {
    console.error("Error generating concept explanations:", error.message || error);
    res.status(500).json({ message: "Failed to generate concept explanations" });
  }
};

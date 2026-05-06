 import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";
import { questionAnswerPrompt, conceptExplainPrompt } from "../utils/prompts.js";
import Session from "../model/Session.js";
import Question from "../model/Question.js";

// ✅ INIT AI
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

// ✅ RETRY LOGIC
const generateWithRetry = async (prompt, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return await result.response.text();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`⚠️ Retry attempt ${i + 1}`);
    }
  }
};

// ✅ TIMEOUT WRAPPER
const generateWithTimeout = async (prompt) => {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("AI timeout")), 10000)
  );

  return Promise.race([
    generateWithRetry(prompt),
    timeoutPromise,
  ]);
};

// 📝 Generate Interview Questions
export const generateInterviewQuestions = async (req, res) => {
  let sessionId;

  try {
    let { role, experience, topicsToFocus, numberOfQuestions, sessionId: bodySessionId } = req.body;
    sessionId = bodySessionId;

    // ✅ BASIC VALIDATION
    if (!role || !experience || !Array.isArray(topicsToFocus) || !numberOfQuestions) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
      });
    }

    if (numberOfQuestions < 1 || numberOfQuestions > 20) {
      return res.status(400).json({
        success: false,
        message: "numberOfQuestions must be between 1 and 20",
      });
    }

    // ✅ SESSION HANDLING
    let session;

    if (sessionId) {
      if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        return res.status(400).json({ success: false, message: "Invalid sessionId" });
      }

      session = await Session.findOne({
        _id: sessionId,
        user: req.user._id,
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Session not found",
        });
      }
    } else {
      session = await Session.create({
        user: req.user._id,
        jobRole: role,
        experienceLevel: experience,
        topicsToFocus,
        status: "active",
        startedAt: new Date(),
      });

      sessionId = session._id;
    }

    // ✅ PROMPT
    const promptData = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

    const promptString = `
${promptData.promptTitle}

Context:
- Role: ${role}
- Experience: ${experience}
- Topics: ${topicsToFocus.join(", ")}
- Questions: ${numberOfQuestions}

🚨 Return STRICT JSON:
[
  { "question": "...", "answer": "..." }
]
    `.trim();

    // ✅ AI CALL
    let rawText;
    try {
      rawText = await generateWithTimeout(promptString);
    } catch (err) {
      console.log("⚠️ AI failed:", err.message);

      return res.status(500).json({
        success: false,
        message: "AI generation failed. Try again later.",
      });
    }

    // ✅ SAFE PARSE
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      console.log("⚠️ JSON parse failed, fallback parsing...");

      parsed = rawText
        .split("\n")
        .map((line) => ({
          question: line,
          answer: "",
        }))
        .filter((q) => q.question);
    }

    if (!parsed.length) {
      return res.status(500).json({
        success: false,
        message: "No questions generated",
      });
    }

    // ✅ STRUCTURE DATA
    const structuredQuestions = parsed.map((q) => ({
      question: q.question,
      answer: q.answer || "",
      session: sessionId,
    }));

    // ✅ SAVE
    const savedQuestions = await Question.insertMany(structuredQuestions);

    session.questions.push(...savedQuestions.map((q) => q._id));
    session.totalQuestions = session.questions.length;
    await session.save();

    return res.status(200).json({
      success: true,
      sessionId,
      questions: savedQuestions,
    });
  } catch (error) {
    console.error("❌ Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// 📘 Generate Explanation
export const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const promptData = conceptExplainPrompt(question);

    const promptString = `
Explain this interview question clearly:

Question: ${question}

Provide:
- What is being tested
- Key concepts
- Answer strategy
- Common mistakes
    `.trim();

    let rawText;

    try {
      rawText = await generateWithTimeout(promptString);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "AI failed to generate explanation",
      });
    }

    return res.status(200).json({
      success: true,
      explanation: rawText.trim(),
    });
  } catch (error) {
    console.error("❌ Explanation error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


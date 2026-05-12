import fs from "fs/promises";
import path from "path";
import * as pdfParse from "pdf-parse";
import {
  generateWithFallback,
  parseModelJson,
} from "../utils/llmRouter.js";

export const extractResumeText = async (filePath, mimeType) => {
  if (!filePath) {
    throw new Error("Resume file path is required");
  }

  if (mimeType === "application/pdf") {
    const buffer = await fs.readFile(filePath);
    const data = await pdfParse.default(buffer);
    return data.text || "";
  }

  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".txt" || ext === ".md") {
    return await fs.readFile(filePath, "utf-8");
  }

  throw new Error("Unsupported resume file type. Upload PDF or TXT.");
};

export const buildResumeAnalysisMessages = (resumeText) => {
  return [
    {
      role: "system",
      content:
        "You are an expert resume analyzer. Return STRICT JSON only. No markdown, no extra text.",
    },
    {
      role: "user",
      content: `
Analyze this resume and return structured interview preparation data.

Resume:
${resumeText}

Return this exact JSON shape:
{
  "targetRole": "string",
  "experienceLevel": "fresher|junior|mid|senior",
  "summary": "string",
  "skills": ["string"],
  "strongAreas": ["string"],
  "weakAreas": ["string"],
  "suggestedTopics": ["string"],
  "projects": ["string"],
  "companiesOrDomains": ["string"]
}
      `.trim(),
    },
  ];
};

export const buildResumeQuestionMessages = (
  analysis,
  numberOfQuestions = 5
) => {
  return [
    {
      role: "system",
      content:
        "You are a senior interviewer. Return STRICT JSON only. No markdown, no extra text.",
    },
    {
      role: "user",
      content: `
Generate ${numberOfQuestions} interview questions based on this resume analysis.

Analysis:
${JSON.stringify(analysis, null, 2)}

Return this exact JSON shape:
[
  {
    "question": "string",
    "type": "technical|behavioral|mcq",
    "difficulty": "easy|medium|hard",
    "idealAnswer": "string",
    "topicTags": ["string"]
  }
]
      `.trim(),
    },
  ];
};

export const analyzeResumeWithAI = async (resumeText) => {
  const { text } = await generateWithFallback({
    messages: buildResumeAnalysisMessages(resumeText),
  });

  return parseModelJson(text);
};

export const generateResumeQuestionsWithAI = async (
  analysis,
  numberOfQuestions = 5
) => {
  const { text } = await generateWithFallback({
    messages: buildResumeQuestionMessages(analysis, numberOfQuestions),
  });

  return parseModelJson(text);
};
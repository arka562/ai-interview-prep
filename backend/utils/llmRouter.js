// utils/llmRouter.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

/**
 * Provider order:
 * 1) Gemini
 * 2) OpenRouter
 * 3) Groq
 * 4) Hugging Face
 */

const PROVIDERS = [
  {
    name: "gemini",
    enabled: () => Boolean(process.env.GEMINI_API_KEY),
    timeoutMs: 12000,
    kind: "gemini",
    get model() { return process.env.GEMINI_MODEL || "gemini-2.5-flash-preview-05-20"; },
  },
  {
    name: "openrouter",
    enabled: () => Boolean(process.env.OPENROUTER_API_KEY),
    timeoutMs: 12000,
    kind: "openai-compatible",
    get baseURL() { return process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1"; },
    get model() { return process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat-v3-0324:free"; },
  },
  {
    name: "groq",
    enabled: () => Boolean(process.env.GROQ_API_KEY),
    timeoutMs: 10000,
    kind: "openai-compatible",
    get baseURL() { return process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1"; },
    get model() { return process.env.GROQ_MODEL || "llama-3.3-70b-versatile"; },
  },
  {
    name: "huggingface",
    enabled: () => Boolean(process.env.HF_API_KEY) && Boolean(process.env.HF_BASE_URL),
    timeoutMs: 15000,
    kind: "openai-compatible",
    get baseURL() { return process.env.HF_BASE_URL; },
    get model() { return process.env.HF_MODEL || "meta-llama/Llama-3.1-8B-Instruct"; },
  },
];

// Circuit breaker
const providerState = new Map();

const now = () => Date.now();

const isBlocked = (name) => {
  const state = providerState.get(name);
  if (!state) return false;
  return Boolean(state.blockedUntil && state.blockedUntil > now());
};

const recordSuccess = (name) => {
  providerState.set(name, {
    fails: 0,
    blockedUntil: 0,
  });
};

const recordFailure = (name) => {
  const prev = providerState.get(name) || {
    fails: 0,
    blockedUntil: 0,
  };

  const fails = prev.fails + 1;

  // block after 3 consecutive failures
  const blockedUntil = fails >= 3 ? now() + 5 * 60 * 1000 : 0;

  providerState.set(name, {
    fails,
    blockedUntil,
  });
};

const withTimeout = (promise, timeoutMs, providerName) => {
  let timer;

  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`${providerName} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timer);
  });
};

const toGeminiPrompt = (messages) => {
  return messages
    .map((m) => `${m.role.toUpperCase()}:\n${m.content}`)
    .join("\n\n");
};

const createOpenAIClient = ({ apiKey, baseURL }) => {
  return new OpenAI({
    apiKey,
    baseURL,
  });
};

const getGeminiText = async ({ modelName, messages }) => {
  const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = client.getGenerativeModel({ model: modelName });

  const prompt = toGeminiPrompt(messages);
  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
};

const getOpenAICompatibleText = async ({
  apiKey,
  baseURL,
  model,
  messages,
}) => {
  const client = createOpenAIClient({
    apiKey,
    baseURL,
  });

  const completion = await client.chat.completions.create({
    model,
    messages,
    temperature: 0.2,
  });

  return completion?.choices?.[0]?.message?.content || "";
};

// Clean model output
export const cleanModelText = (text = "") => {
  return String(text)
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .replace(/^Here is the JSON:\s*/i, "")
    .trim();
};

// Extract actual JSON
export const extractJsonBlock = (text = "") => {
  const cleaned = cleanModelText(text);

  // Try to find the outermost array first
  const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrayMatch) return arrayMatch[0];

  // Fall back to outermost object
  const objectMatch = cleaned.match(/\{[\s\S]*\}/);
  if (objectMatch) return objectMatch[0];

  return cleaned;
};
// Parse JSON safely
export const parseModelJson = (text) => {
  const jsonText = extractJsonBlock(text);
  console.log("RAW MODEL OUTPUT:", JSON.stringify(jsonText.text));
  try {
    return JSON.parse(jsonText);
  } catch (error) {
    throw new Error(`Invalid JSON response: ${error.message}`);
  }
};

// Main fallback generator
export const generateWithFallback = async ({
  messages,
  preferredProviders = [],
}) => {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("messages must be a non-empty array");
  }

  const preferredSet = new Set(preferredProviders);

  const orderedProviders = [
    ...preferredProviders
      .map((name) => PROVIDERS.find((p) => p.name === name))
      .filter(Boolean),
    ...PROVIDERS.filter((p) => !preferredSet.has(p.name)),
  ];

  const errors = [];

  // Guard: if no provider is enabled at all, fail early with clear message
  const anyEnabled = orderedProviders.some((p) => p.enabled());
  if (!anyEnabled) {
    throw new Error(
      "No LLM provider is enabled. Check that API keys are set in your .env file."
    );
  }

  for (const provider of orderedProviders) {
    if (!provider.enabled()) continue;
    if (isBlocked(provider.name)) {
      console.warn(`⚠️ Provider blocked (circuit open): ${provider.name}`);
      continue;
    }

    try {
      console.log(`➡️ Trying provider: ${provider.name} | model: ${provider.model}`);

      let text = "";

      switch (provider.kind) {
        case "gemini": {
          text = await withTimeout(
            getGeminiText({
              modelName: provider.model,
              messages,
            }),
            provider.timeoutMs,
            provider.name
          );
          break;
        }

        case "openai-compatible": {
          const apiKey =
            provider.name === "openrouter"
              ? process.env.OPENROUTER_API_KEY
              : provider.name === "groq"
                ? process.env.GROQ_API_KEY
                : process.env.HF_API_KEY;

          text = await withTimeout(
            getOpenAICompatibleText({
              apiKey,
              baseURL: provider.baseURL,
              model: provider.model,
              messages,
            }),
            provider.timeoutMs,
            provider.name
          );
          break;
        }

        default:
          throw new Error(`Unsupported provider kind: ${provider.kind}`);
      }

      if (!text || !text.trim()) {
        throw new Error(`${provider.name} returned empty output`);
      }

      console.log(`✅ Provider succeeded: ${provider.name}`);
      recordSuccess(provider.name);

      return {
        provider: provider.name,
        text: text.trim(),
      };
    } catch (error) {
      console.error(`❌ Provider failed: ${provider.name}`, JSON.stringify({
        message: error?.message,
        status: error?.status,
        data: error?.response?.data,
      }, null, 2));

      recordFailure(provider.name);
      errors.push({
        provider: provider.name,
        message: error?.response?.data
          ? JSON.stringify(error.response.data)
          : error.message,
      });
    }
  }

  const detail = errors.map((e) => `${e.provider}: ${e.message}`).join(" | ");
  throw new Error(`All providers failed. ${detail}`);
};

// Build question prompt
export const buildQuestionMessages = ({
  role,
  experience,
  topicsToFocus = [],
  numberOfQuestions = 5,
}) => {
  const topicText =
    Array.isArray(topicsToFocus) && topicsToFocus.length > 0
      ? topicsToFocus.join(", ")
      : "general interview topics";

  return [
    {
      role: "system",
      content:
        "You are a senior technical interviewer. Return STRICT JSON only. No markdown. No explanation.",
    },
    {
      role: "user",
      content: `
Generate ${numberOfQuestions} interview questions.

Role: ${role}
Experience: ${experience}
Topics: ${topicText}

Return ONLY valid JSON.

[
  {
    "question": "string",
    "answer": "string",
    "keyPoints": ["string"],
    "followUp": "string",
    "evaluation": "string"
  }
]
      `.trim(),
    },
  ];
};

// Build explanation prompt
export const buildExplanationMessages = ({ question }) => {
  return [
    {
      role: "system",
      content:
        "You are a technical interview coach. Return STRICT JSON only.",
    },
    {
      role: "user",
      content: `
Explain this interview question:

"${question}"

Return ONLY valid JSON.

{
  "concept": "string",
  "importance": "string",
  "approach": "string",
  "mistakes": ["string"],
  "tips": ["string"]
}
      `.trim(),
    },
  ];
};
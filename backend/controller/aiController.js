// @desc    Generate interview questions based on role, experience, and topics
// @route   POST /api/ai/generate
// @access  Private
import { GoogleGenerativeAI } from "@google/generative-ai";
import { questionAnswerPrompt, conceptExplainPrompt } from "../utils/prompts.js";
export const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (
      !role ||
      !experience ||
      !topicsToFocus ||
      !Array.isArray(topicsToFocus) ||
      typeof numberOfQuestions !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message: "Role, experience, numberOfQuestions, and topicsToFocus (as an array) are required",
      });
    }

    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const promptData = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);
    
    // Convert the structured prompt object to a string
    const promptString = `
${promptData.promptTitle}

Context:
- Role: ${promptData.context.role}
- Experience Level: ${promptData.context.experienceLevel}
- Focus Areas: ${promptData.context.focusAreas}
- Number of Questions: ${promptData.context.questionCount}

Instructions:
${promptData.instructions.map(instruction => `• ${instruction}`).join('\n')}

Please format each question as follows:
${promptData.format.question}
${promptData.format.idealAnswer}
Key Points:
${promptData.format.keyPoints.join('\n')}
Follow-up: ${promptData.format.followUpQuestion}
Evaluation: ${promptData.format.evaluationCriteria}

${promptData.note}
    `.trim();

    const result = await model.generateContent(promptString);
    const response = await result.response;
    const rawText = await response.text();

    const cleanedText = rawText
      .trim()
      .replace(/\*\*/g, "")         // Remove markdown bold
      .replace(/\n{2,}/g, "\n")     // Replace multiple line breaks with single
      .replace(/\r/g, "");          // Remove carriage returns

    const questions = cleanedText
      .split(/(?=Q\d+:)/g)          // Split at each Q[number]:
      .map(q => q.trim())
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      structured_questions: questions
    });

  } catch (error) {
    console.error("❌ Error generating interview questions:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate interview questions"
    });
  }
};


// @desc    Generate explanation for a technical interview question
// @route   POST /api/ai/explain
// @access  Private
export const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ 
        success: false,
        message: "Question is required" 
      });
    }

    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const promptData = conceptExplainPrompt(question);
    
    // Convert the structured prompt object to a string
    const promptString = `
${promptData.title}

Question: ${promptData.question}

Please provide a comprehensive explanation covering:

1. What They Are Testing:
${promptData.sections.whatTheyAreTesting}

2. Why It Matters:
${promptData.sections.whyItMatters}

3. Key Areas to Cover:
${promptData.sections.keyAreasToCover.map(area => `• ${area}`).join('\n')}

4. Common Mistakes:
${promptData.sections.commonMistakes.map(mistake => `• ${mistake}`).join('\n')}

5. Pro Tips:
${promptData.sections.proTips.map(tip => `• ${tip}`).join('\n')}

6. Sample Answer Framework:
${promptData.sections.sampleAnswerFramework}

7. Follow-up Questions:
${promptData.sections.followUpQuestions.map(q => `• ${q}`).join('\n')}

Strategy: ${promptData.sections.strategy}

Note: ${promptData.note}
    `.trim();

    const result = await model.generateContent(promptString);
    const response = await result.response;
    const rawText = await response.text();

    const leanText = rawText
      .trim()
      .replace(/\*\*/g, "")
      .replace(/\n{2,}/g, "\n")
      .replace(/\r/g, "");

    res.status(200).json({
      success: true,
      explanation: leanText,
    });
  } catch (error) {
    console.error("❌ Error generating concept explanation:", error.message || error);
    res.status(500).json({ 
      success: false,
      message: "Failed to generate concept explanations" 
    });
  }
};
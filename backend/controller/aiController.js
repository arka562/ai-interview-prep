import { GoogleGenerativeAI } from "@google/generative-ai";
import { questionAnswerPrompt, conceptExplainPrompt } from "../utils/prompts.js";
import Session from "../model/Session.js";
import Question from "../model/Question.js";

// 📝 ONLY generates questions with answers - NO explanations
export const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions, sessionId } = req.body;

    // ✅ Validation - sessionId is required to save questions
    if (
      !role ||
      !experience ||
      !topicsToFocus ||
      !Array.isArray(topicsToFocus) ||
      typeof numberOfQuestions !== "number" ||
      !sessionId
    ) {
      return res.status(400).json({
        success: false,
        message: "Role, experience, numberOfQuestions, sessionId, and topicsToFocus (array) are required",
      });
    }

    // ✅ Verify session exists and belongs to user
    const session = await Session.findOne({
      _id: sessionId,
      user: req.user._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found or you don't have permission to access it",
      });
    }

    // ✅ Prepare AI prompt - ONLY for questions and answers
    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const promptData = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

    // 🎯 Modified prompt to focus ONLY on questions and answers
    const promptString = `
${promptData.promptTitle}

Context:
- Role: ${promptData.context.role}
- Experience Level: ${promptData.context.experienceLevel}
- Focus Areas: ${promptData.context.focusAreas}
- Number of Questions: ${promptData.context.questionCount}

Instructions:
${promptData.instructions.map(instruction => `• ${instruction}`).join('\n')}

🚨 IMPORTANT: Generate ONLY questions and their basic answers. DO NOT generate explanations, learning materials, or detailed breakdowns.

${promptData.formatInstructions}

${promptData.note}
    `.trim();

    // ✅ Generate content from Gemini
    const result = await model.generateContent(promptString);
    const response = await result.response;
    const rawText = await response.text();

    // ✅ Clean and split into questions
    const cleanedText = rawText
      .trim()
      .replace(/\*\*/g, "") // Remove markdown bold
      .replace(/\r/g, "")
      .replace(/\n{2,}/g, "\n");

    const rawQuestions = cleanedText
      .split(/(?=Q\d+:)/g)
      .map(q => q.trim())
      .filter(Boolean);

    if (!rawQuestions.length) {
      return res.status(500).json({
        success: false,
        message: "No questions generated from AI",
      });
    }

    // ✅ Convert to structured format - ONLY question and answer
    const structuredQuestions = rawQuestions.map(q => {
      const parts = q.split(/Answer:/i);
      const question = parts[0]?.replace(/^Q\d+:\s*/, "").trim();
      const answer = parts[1]?.trim() || "";
      
      return {
        question,
        answer,
        isPinned: false,
        session: sessionId,
        // 🚨 NO explanation field - will be generated separately
      };
    }).filter(q => q.question);

    // ✅ Save questions to database
    const savedQuestions = await Question.insertMany(structuredQuestions);
    
    // ✅ Update session with new question IDs
    session.questions = [...(session.questions || []), ...savedQuestions.map(q => q._id)];
    await session.save();

    console.log(`✅ Successfully saved ${savedQuestions.length} questions to session ${sessionId}`);

    // ✅ Return structured questions array
    return res.status(200).json({
      success: true,
      message: "Questions generated and saved successfully",
      structured_questions: savedQuestions,
    });
  } catch (error) {
    console.error("❌ Error generating questions:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while generating questions",
    });
  }
};

// 📚 ONLY generates explanations when user asks for "Learn More"
export const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ 
        success: false,
        message: "Question is required" 
      });
    }

    console.log("🔍 Generating explanation for:", question);

    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const promptData = conceptExplainPrompt(question);
    
    // 🎯 Enhanced prompt for comprehensive explanations
    const promptString = `
${promptData.title}

Question: ${promptData.question}

🎯 Please provide a comprehensive explanation covering:

## 1. What They Are Testing:
${promptData.sections.whatTheyAreTesting}

## 2. Why It Matters:
${promptData.sections.whyItMatters}

## 3. Key Areas to Cover:
${promptData.sections.keyAreasToCover.map(area => `• ${area}`).join('\n')}

## 4. Common Mistakes:
${promptData.sections.commonMistakes.map(mistake => `• ${mistake}`).join('\n')}

## 5. Pro Tips:
${promptData.sections.proTips.map(tip => `• ${tip}`).join('\n')}

## 6. Sample Answer Framework:
${promptData.sections.sampleAnswerFramework}

## 7. Follow-up Questions:
${promptData.sections.followUpQuestions.map(q => `• ${q}`).join('\n')}

## Strategy:
${promptData.sections.strategy}

**Note:** ${promptData.note}

🚨 IMPORTANT: Generate a detailed explanation that helps the user understand:
- The concept being tested
- How to approach the question
- What makes a good answer
- Common pitfalls to avoid
- Tips for standing out

Format the response with clear sections and bullet points for easy reading.
    `.trim();

    const result = await model.generateContent(promptString);
    const response = await result.response;
    const rawText = await response.text();

    const cleanedText = rawText
      .trim()
      .replace(/\*\*/g, "")
      .replace(/\n{2,}/g, "\n")
      .replace(/\r/g, "");

    console.log("✅ Explanation generated successfully");

    res.status(200).json({
      success: true,
      explanation: cleanedText,
    });
  } catch (error) {
    console.error("❌ Error generating concept explanation:", error.message || error);
    res.status(500).json({ 
      success: false,
      message: "Failed to generate concept explanation" 
    });
  }
};

// 🔄 Optional: Update question with explanation (if you want to save explanations)
export const updateQuestionWithExplanation = async (req, res) => {
  try {
    const { questionId, explanation } = req.body;

    if (!questionId || !explanation) {
      return res.status(400).json({
        success: false,
        message: "Question ID and explanation are required"
      });
    }

    const question = await Question.findOneAndUpdate(
      { _id: questionId },
      { explanation },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Question updated with explanation",
      question
    });
  } catch (error) {
    console.error("❌ Error updating question with explanation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update question with explanation"
    });
  }
};
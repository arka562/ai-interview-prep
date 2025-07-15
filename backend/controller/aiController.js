import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";
import { questionAnswerPrompt, conceptExplainPrompt } from "../utils/prompts.js";
import Session from "../model/Session.js";
import Question from "../model/Question.js";

// 📝 ONLY generates questions with answers - NO explanations
export const generateInterviewQuestions = async (req, res) => {
  let sessionId; // Declare at the top for error handling access

  try {
    console.log("📝 Full request body:", JSON.stringify(req.body, null, 2));
    console.log("👤 User from req.user:", req.user);

    let { role, experience, topicsToFocus, numberOfQuestions, sessionId: bodySessionId } = req.body;
    sessionId = bodySessionId; // Assign to outer scope variable

    // Enhanced validation with detailed logging
    const validationErrors = [];

    if (!role) {
      validationErrors.push("role is missing");
    } else {
      console.log("✅ Role:", role);
    }

    if (!experience) {
      validationErrors.push("experience is missing");
    } else {
      console.log("✅ Experience:", experience);
    }

    if (!topicsToFocus) {
      validationErrors.push("topicsToFocus is missing");
    } else if (!Array.isArray(topicsToFocus)) {
      validationErrors.push("topicsToFocus is not an array");
    } else {
      console.log("✅ Topics to focus:", topicsToFocus);
    }

    if (numberOfQuestions === undefined || numberOfQuestions === null) {
      validationErrors.push("numberOfQuestions is missing");
    } else if (typeof numberOfQuestions !== "number") {
      validationErrors.push(`numberOfQuestions is ${typeof numberOfQuestions}, expected number`);
    } else if (numberOfQuestions < 1 || numberOfQuestions > 20) {
      validationErrors.push("numberOfQuestions must be between 1 and 20");
    } else {
      console.log("✅ Number of questions:", numberOfQuestions);
    }

    // Validate sessionId if provided
    if (sessionId && !mongoose.Types.ObjectId.isValid(sessionId)) {
      validationErrors.push("sessionId is not a valid MongoDB ObjectId");
    }

    // If there are validation errors, return detailed message
    if (validationErrors.length > 0) {
      console.error("❌ Validation errors:", validationErrors);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
        receivedData: {
          role: role || "MISSING",
          experience: experience || "MISSING", 
          topicsToFocus: topicsToFocus || "MISSING",
          numberOfQuestions: numberOfQuestions || "MISSING",
          sessionId: sessionId || "NOT PROVIDED"
        }
      });
    }

    console.log("✅ All validation passed, proceeding with generation...");

    // ✅ Create or verify session
    let session;
    
    if (sessionId) {
      // If sessionId provided, verify it exists and belongs to user
      session = await Session.findOne({
        _id: sessionId,
        user: req.user._id,
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Session not found or you don't have permission to access it",
          sessionId: sessionId
        });
      }
      console.log("✅ Existing session found:", sessionId);
    } else {
      // If no sessionId, create a new session
      session = new Session({
        user: req.user._id,
        role,
        experience,
        topicsToFocus,
        numberOfQuestions,
        questions: [],
        createdAt: new Date(),
      });
      
      await session.save();
      sessionId = session._id;
      console.log("✅ New session created:", sessionId);
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
    console.log("🤖 Calling Gemini API...");
    const result = await model.generateContent(promptString);
    const response = await result.response;
    const rawText = await response.text();

    console.log("✅ AI response received, processing...");

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
      console.error("❌ No questions generated from AI");
      return res.status(500).json({
        success: false,
        message: "No questions generated from AI",
        sessionId: sessionId
      });
    }

    console.log(`✅ Parsed ${rawQuestions.length} raw questions`);

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
      };
    }).filter(q => q.question);

    console.log(`✅ Structured ${structuredQuestions.length} questions`);

    // ✅ Save questions to database
    const savedQuestions = await Question.insertMany(structuredQuestions);
    
    // ✅ Update session with new question IDs
    session.questions = [...(session.questions || []), ...savedQuestions.map(q => q._id)];
    await session.save();

    console.log(`✅ Successfully saved ${savedQuestions.length} questions to session ${sessionId}`);

    // ✅ Return structured questions array with session info
    return res.status(200).json({
      success: true,
      message: "Questions generated and saved successfully",
      sessionId,
      structured_questions: savedQuestions,
    });
  } catch (error) {
    console.error("❌ Error generating questions:", error);
    console.error("❌ Error stack:", error.stack);
    
    // More specific error handling
    if (error.message?.includes('API key')) {
      return res.status(500).json({
        success: false,
        message: "API key issue - check GEMINI_API_KEY environment variable",
        sessionId: sessionId || 'not generated'
      });
    }
    
    if (error.message?.includes('Database') || error.message?.includes('MongoDB')) {
      return res.status(500).json({
        success: false,
        message: "Database connection error",
        sessionId: sessionId || 'not generated'
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while generating questions",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      sessionId: sessionId || 'not generated'
    });
  }
};

// Generates detailed explanations for concepts
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

// Retrieves a session by ID with populated questions
export const getSessionById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid session ID format" 
      });
    }

    const session = await Session.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate({
        path: "questions",
        options: { sort: { isPinned: -1, createdAt: 1 } },
      })
      .exec();

    if (!session) {
      return res.status(404).json({ 
        success: false,
        message: "Session not found" 
      });
    }

    res.status(200).json({ 
      success: true,
      session 
    });
  } catch (error) {
    console.error("Error retrieving session:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to retrieve session",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
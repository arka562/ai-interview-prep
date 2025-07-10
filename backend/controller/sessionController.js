import Session from "../model/Session.js";
import Question from "../model/Question.js";

// @desc    Create a new session
// @route   POST /api/session
// @access  Private
export const createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, description, questions } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!role || !experience) {
      return res.status(400).json({ message: "Role and experience are required" });
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "At least one question is required" });
    }

    // Create session first (without questions)
    const session = await Session.create({
      user: userId,
      role,
      experience,
      topicsToFocus: topicsToFocus || [], // Ensure it's an array
      description: description || ''
    });

    // Create questions and get their IDs
    const questionDocs = await Promise.all(
      questions.map(async (q) => {
        // Validate question data
        if (!q.question) {
          throw new Error(`Question text is required for question: ${JSON.stringify(q)}`);
        }
        
        const question = await Question.create({
          session: session._id,
          question: q.question,
          answer: q.answer || '' // Provide default empty string if no answer
        });
        return question._id;
      })
    );

    // Update session with question IDs
    session.questions = questionDocs;
    await session.save();

    res.status(201).json({ success: true, session });
  } catch (error) {
    console.error("Error creating session:", error);
    
    // If session was created but questions failed, clean up
    if (error.message.includes("Question text is required")) {
      // You might want to delete the session here if question creation fails
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to create session" });
    }
  }
};

// @desc    Get session by ID (and its questions)
// @route   GET /api/session/:id
// @access  Private
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate({
        path: "questions",
        options: { sort: { pinned: -1, createdAt: 1 } }, // ✅ fixed typo + correct field "pinned"
      })
      .exec();

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({ session });
  } catch (error) {
    console.error("Error retrieving session:", error);
    res.status(500).json({ message: "Failed to retrieve session" });
  }
};


// @desc    Get all sessions for logged-in user
// @route   GET /api/session
// @access  Private
export const getMySession = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id })
      .populate("questions")
      .sort({ createdAt: -1 });
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error retrieving sessions:", error);
    res.status(500).json({ message: "Failed to retrieve sessions" });
  }
};

// @desc    Delete a session (and its questions)
// @route   DELETE /api/session/:id
// @access  Private
export const deleteSession = async (req, res) => {
  try {
    // Step 1: Find the session
    const session = await Session.findById(req.params.id);

    // Step 2: Check if session exists
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Step 3: Check if the logged-in user is the owner
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this session" });
    }

    // Step 4: Delete the session
    await session.deleteOne();

    // Step 5: Delete related questions
    await Question.deleteMany({ session: session._id });

    res.status(200).json({ message: "Session and related questions deleted" });
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({ message: "Failed to delete session" });
  }
};

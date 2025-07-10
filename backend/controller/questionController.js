import Question from "../model/Question.js";
import Session from "../model/Session.js";

// Toggle pin/unpin a question
export const togglePinQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id).populate("session");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Check if the logged-in user owns the session
    if (question.session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to modify this question" });
    }

    question.pinned = !question.pinned;
    await question.save();

    res.status(200).json({ message: "Pin status toggled", pinned: question.pinned });
  } catch (error) {
    console.error("Error toggling pin:", error);
    res.status(500).json({ message: "Failed to toggle pin" });
  }
};

// Update or add a note to a question
export const updateQuestionNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    const question = await Question.findById(id).populate("session");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (question.session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to modify this question" });
    }

    question.note = note;
    await question.save();

    res.status(200).json({ message: "Note updated", note: question.note });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Failed to update note" });
  }
};

export const addQuestionToSession = async (req, res) => {
  try {
    const { sessionId, questions } = req.body;

    if (!sessionId || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Session ID and valid questions array are required" });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check session ownership
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to add questions to this session" });
    }

    // Insert new questions
    const insertedQuestions = await Question.insertMany(
      questions.map(q => ({
        session: sessionId,
        question: q.question,
        answer: q.answer
      }))
    );

    // Push question IDs to session
    const questionIds = insertedQuestions.map(q => q._id);
    session.questions.push(...questionIds);
    await session.save();

    res.status(201).json({ message: "Questions added", questions: insertedQuestions });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ message: "Failed to add question to session" });
  }
};


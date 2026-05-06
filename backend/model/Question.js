import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["technical", "behavioral", "mcq"],
      default: "technical",
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    answer: {
      type: String,
      default: "",
      trim: true,
    },

    idealAnswer: {
      type: String,
      default: "",
    },

    isCorrect: {
      type: Boolean,
      default: null,
    },

    score: {
      type: Number,
      default: 0,
    },

    feedback: {
      type: String,
      default: "",
    },

    timeTaken: {
      type: Number, // seconds
    },

    attempts: {
      type: Number,
      default: 1,
    },

    userNotes: {
      type: String,
      default: "",
      trim: true,
    },

    pinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// 📈 INDEX
questionSchema.index({ session: 1, createdAt: -1 });

export default mongoose.model("Question", questionSchema);


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
    answer: {
      type: String,
      required: false, // ✅ Change this to false
      default: "",     // ✅ Add default empty string
      trim: true,
    },
    note: {
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
    timestamps: true, // Correct way to enable createdAt & updatedAt
  }
);

export default mongoose.model("Question", questionSchema);

import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user who owns the session
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    topicsToFocus: {
      type: String,
      required: true,
    },
    description:String,
    question:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question", 
      required: true,
    }
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model("Session", sessionSchema);

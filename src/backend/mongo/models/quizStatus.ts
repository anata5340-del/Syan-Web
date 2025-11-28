import mongoose from "mongoose";
import { QuizStatus } from "@/backend/types/quizStatus";

const { ObjectId } = mongoose.Schema.Types;

let quizModel: mongoose.Model<QuizStatus>;

if (mongoose.models.quizStatus) {
  quizModel = mongoose.model<QuizStatus>("quizStatus");
} else {
  const QuizStatusSchema = new mongoose.Schema(
    {
      userId: {
        type: ObjectId,
        ref: "users",
        required: true,
      },
      quizName: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      progress: {
        type: Number, // Store progress as a number
        required: true,
        default: 0, // Default progress is 0%
        min: 0,
        max: 100, // Progress should be between 0 and 100
      },
    },
    { timestamps: true }
  );

  quizModel = mongoose.model<QuizStatus>("quizStatus", QuizStatusSchema);
}

export default quizModel;

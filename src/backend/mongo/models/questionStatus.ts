import { QuestionStatus } from "@/backend/types/questionStatus";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

let model: mongoose.Model<QuestionStatus>;

if (mongoose.models.questionStatus) {
  model = mongoose.model<QuestionStatus>("questionStatus");
} else {
  const QuestionStatusSchema = new mongoose.Schema(
    {
      userId: {
        type: ObjectId,
        ref: "users",
        required: true,
      },
      questionId: {
        type: ObjectId,
        ref: "questions",
        required: true,
      },
      questionName: {
        type: String,
        required: true,
      },
      correct: {
        type: Boolean,
        required: true,
      },
    },
    { timestamps: true }
  );

  model = mongoose.model<QuestionStatus>(
    "questionStatus",
    QuestionStatusSchema
  );
}

export default model;

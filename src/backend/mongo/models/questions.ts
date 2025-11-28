import { Question } from "@/backend/types";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

let model: mongoose.Model<Question>;

if (mongoose.models.questions) {
  model = mongoose.model<Question>("questions");
} else {
  const OptionsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    isCorrect: { type: Boolean, default: false },
  });

  const QuestionsSchema = new mongoose.Schema(
    {
      displayId: {
        type: String,
        required: false,
        unique: true,
      },
      name: {
        type: String,
        required: true,
      },
      statement: {
        type: String,
        required: true,
      },
      categories: {
        type: [ObjectId],
        ref: "categories",
      },
      options: { type: [OptionsSchema], required: true },
      difficultyLevel: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true,
      },
      topic: {
        type: String,
        required: true,
      },
      explanation: {
        type: String,
        required: true,
      },
      reference: {
        type: String,
      },
    },
    { timestamps: true }
  );

  model = mongoose.model<Question>("questions", QuestionsSchema);
}

export default model;

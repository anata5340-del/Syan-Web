import { Quiz } from "@/backend/types";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

let model: mongoose.Model<Quiz>;

const PaperSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  topic: { type: String, required: true },
  icon: { type: String, required: true },
  questions: {
    type: [ObjectId],
    ref: "questions",
  },
});

const LibrarySchema = new mongoose.Schema({
  papers: [PaperSchema],
});

const TopicQuestionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
const SubTopicQuestionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  questions: {
    type: [ObjectId],
    ref: "questions",
  },
});

const CustomQuestionSchema = new mongoose.Schema({
  topic: TopicQuestionSchema,
  subTopics: [SubTopicQuestionSchema],
});

if (mongoose.models.quizes) {
  model = mongoose.model<Quiz>("quizes");
} else {
  const QuizesSchema = new mongoose.Schema(
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
      categories: {
        type: [ObjectId],
        ref: "categories",
      },
      library: { type: LibrarySchema, default: { papers: [] } },
      customQuestions: {
        type: [CustomQuestionSchema],
        default: null,
      },
      image: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  );

  model = mongoose.model<Quiz>("quizes", QuizesSchema);
}

export default model;

import { Course } from "@/backend/types";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

let model: mongoose.Model<Course>;

if (mongoose.models.courses) {
  model = mongoose.model<Course>("courses");
} else {
  const CoursesSchema = new mongoose.Schema(
    {
      displayId: {
        type: String,
        required: false,
        unique: true,
      },
      name: {
        type: String,
        required: true,
        unique: true,
      },
      categories: {
        type: [ObjectId],
        ref: "categories",
      },
      image: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      quizes: {
        type: [ObjectId],
        ref: "quizes",
      },
      videos: {
        type: [ObjectId],
        ref: "videos",
      },
      notes: {
        type: [ObjectId],
        ref: "notes",
      },
    },
    { timestamps: true }
  );

  model = mongoose.model<Course>("courses", CoursesSchema);
}

export default model;

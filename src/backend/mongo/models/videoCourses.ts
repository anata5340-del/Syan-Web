import { VideoCourses } from "@/backend/types";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

let model: mongoose.Model<VideoCourses>;

if (mongoose.models.videoCourses) {
  model = mongoose.model<VideoCourses>("videoCourses");
} else {
  const subSectionBlock = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    video: {
      type: ObjectId,
      ref: "videos",
      default: null,
    },
    note: {
      type: ObjectId,
      ref: "notes",
      default: null,
    },
    questions: {
      type: [ObjectId],
      ref: "questions",
    },
  });

  const moduleSubSectionSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    subSectionBlocks: [subSectionBlock],
  });
  const moduleSectionSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    subSections: [moduleSubSectionSchema],
  });
  const moduleSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    sections: [moduleSectionSchema],
  });
  const videoCourseSchema = new mongoose.Schema(
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
      color: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      modules: [moduleSchema],
    },
    { timestamps: true }
  );

  model = mongoose.model<VideoCourses>("videoCourses", videoCourseSchema);
}

export default model;

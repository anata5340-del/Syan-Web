import { Video } from "@/backend/types";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

let model: mongoose.Model<Video>;

if (mongoose.models.videos) {
  model = mongoose.model<Video>("videos");
} else {
  const ContentSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  });

  const VideosSchema = new mongoose.Schema(
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
      title: {
        type: String,
        required: true,
      },
      author: {
        type: String,
        required: true,
      },
      categories: {
        type: [ObjectId],
        ref: "categories",
      },
      videoSource: {
        type: String,
        required: true,
      },
      thumbnail: {
        type: String,
        required: true,
      },
      pdfSource: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      content: [ContentSchema],
    },
    { timestamps: true }
  );

  model = mongoose.model<Video>("videos", VideosSchema);
}

export default model;

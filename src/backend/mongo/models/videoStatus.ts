import mongoose from "mongoose";
import { VideoStatus } from "@/backend/types/videoStatus";

const { ObjectId } = mongoose.Schema.Types;

let videoModel: mongoose.Model<VideoStatus>;

if (mongoose.models.videoStatus) {
  videoModel = mongoose.model<VideoStatus>("videoStatus");
} else {
  const VideoStatusSchema = new mongoose.Schema(
    {
      userId: {
        type: ObjectId,
        ref: "users",
        required: true,
      },
      videoId: {
        type: ObjectId,
        ref: "videos",
        required: true,
      },
      videoName: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      content: [
        {
          contentId: {
            type: ObjectId, // Unique identifier for each piece of content
            required: true,
          },
          completed: {
            type: Boolean,
            default: false, // Indicates whether the content has been viewed
          },
        },
      ],
    },
    { timestamps: true }
  );

  videoModel = mongoose.model<VideoStatus>("videoStatus", VideoStatusSchema);
}

export default videoModel;

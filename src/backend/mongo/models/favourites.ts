import mongoose from "mongoose";
import { Favourites } from "@/backend/types";

const { ObjectId } = mongoose.Schema.Types;

let model: mongoose.Model<Favourites>;

if (mongoose.models.favourites) {
  model = mongoose.model<Favourites>("favourites");
} else {
  const FavouritesSchema = new mongoose.Schema(
    {
      user: { type: ObjectId, ref: "users", required: true },
      favouriteNotes: [
        {
          note: { type: ObjectId, ref: "notes", required: true }, // Reference to the note
          url: { type: String, required: true }, // Associated URL for the note
        },
      ],
      favouriteVideos: [
        {
          video: { type: ObjectId, ref: "videos", required: true }, // Reference to the video
          url: { type: String, required: true }, // Associated URL for the video
        },
      ],
      favouriteQuizes: [
        {
          quizName: { type: String, required: true }, // Name of the quiz
          url: { type: String, required: true }, // Associated URL for the quiz
        },
      ],
    },
    { timestamps: true }
  );

  model = mongoose.model<Favourites>("favourites", FavouritesSchema);
}

export default model;

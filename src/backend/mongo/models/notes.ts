import { Note } from "@/backend/types";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

let model: mongoose.Model<Note>;

if (mongoose.models.notes) {
  model = mongoose.model<Note>("notes");
} else {
  const NotesContentSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  });

  const NotesSchema = new mongoose.Schema(
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
      content: { type: [NotesContentSchema], required: true },
    },
    { timestamps: true }
  );

  model = mongoose.model<Note>("notes", NotesSchema);
}

export default model;

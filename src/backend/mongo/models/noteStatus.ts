import mongoose from "mongoose";
import { NoteStatus } from "@/backend/types/noteStatus";
import { string } from "yup";

const { ObjectId } = mongoose.Schema.Types;

let noteModel: mongoose.Model<NoteStatus>;

if (mongoose.models.noteStatus) {
  noteModel = mongoose.model<NoteStatus>("noteStatus");
} else {
  const NoteStatusSchema = new mongoose.Schema(
    {
      userId: {
        type: ObjectId,
        ref: "users",
        required: true,
      },
      noteId: {
        type: ObjectId,
        ref: "notes",
        required: true,
      },
      noteName: {
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
            default: false, // Indicates whether the content has been completed
          },
        },
      ],
    },
    { timestamps: true }
  );

  noteModel = mongoose.model<NoteStatus>("noteStatus", NoteStatusSchema);
}

export default noteModel;

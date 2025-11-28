import { connectDB } from "@/backend/db/connect";
import { createNote, getNotes, updateNote } from "@/backend/services/notes";
import {
  createNoteValidator,
  updateNoteValidator,
} from "@/backend/validators/note";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    switch (req.method) {
      case "GET":
        try {
          const notes = await getNotes();
          notes.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          res.status(200).json({ notes });
        } catch (error) {
          res.status(400).json({ error });
        }
        break;
      case "POST":
        try {
          await createNoteValidator(req.body);
          const note = await createNote(req.body.note);
          res.status(201).json({ note });
        } catch (error) {
          res.status(400).json({ error });
        }
        break;
      case "PUT":
        try {
          console.log("note", req.body);
          await updateNoteValidator(req.body);
          const updatedNote = await updateNote(req.body.id, req.body.note);
          res.status(200).json({ note: updatedNote });
        } catch (error) {
          res.status(400).json({ error });
        }
        break;
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
};

export default handler;

import { connectDB } from "@/backend/db/connect";
import { NextApiRequest, NextApiResponse } from "next";
import isArray from "lodash/isArray";
import { deleteNote, getNote } from "@/backend/services/notes";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    switch (req.method) {
      case "GET":
        try {
          const { id } = req.query;
          if (!id) throw new Error("Id is required");
          const note = await getNote(isArray(id) ? id[0] : id);
          res.status(200).json({ note });
        } catch (error) {
          res.status(400).json({ error });
        }
        break;
      case "DELETE":
        try {
          const { id } = req.query;
          if (!id) throw new Error("Id is required");
          const note = await deleteNote(isArray(id) ? id[0] : id);
          res.status(201).json({ note });
        } catch (error) {
          res.status(400).json({ error });
        }
        break;
      default:
        res.setHeader("Allow", ["GET", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default handler;

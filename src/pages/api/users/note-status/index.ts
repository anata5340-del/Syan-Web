import { connectDB } from "@/backend/db/connect";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { verify } from "@/backend/middlewares/jose";
import {
  addOrUpdateNotesStatus,
  getNotesStatusByUser,
} from "@/backend/services/noteStatus";

const secret = process.env.JWT_SECRET;

const router = createRouter<any, any>();

router
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await connectDB();
      const cookies = req.cookies;
      const token = cookies["token"];
      if (!token || !secret) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const user = await verify(token, secret);
      if (!user) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const noteStatus = await getNotesStatusByUser(user.id);
      res.status(200).json({ noteStatus });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error });
    }
  })
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await connectDB();
      const cookies = req.cookies;
      const token = cookies["token"];
      if (!token || !secret) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const user = await verify(token, secret);
      if (!user) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const { noteId, contentId, completed, noteName, url } = req.body;

      console.log(req.body);
      if (
        !noteId ||
        !contentId ||
        !noteName ||
        !url ||
        typeof completed !== "boolean"
      ) {
        return res.status(400).json({
          message:
            "noteId, noteName, contentId, url, and completed are required fields",
        });
      }

      const updatedNoteStatus = await addOrUpdateNotesStatus(
        user.id,
        noteId,
        noteName,
        url,
        contentId,
        completed
      );
      console.log(updatedNoteStatus);
      res.status(200).json({
        message: "Note status updated successfully",
        updatedNoteStatus,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error });
    }
  });

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});

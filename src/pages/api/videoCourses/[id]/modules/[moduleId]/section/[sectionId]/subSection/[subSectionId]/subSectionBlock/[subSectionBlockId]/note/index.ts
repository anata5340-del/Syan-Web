import { connectDB } from "@/backend/db/connect";
import {
  updateVideoCourseModuleSubSectionBlockNote,
  deleteVideoCourseModuleSubSectionBlockNote,
  getVideoCourseModuleSubSectionBlock,
} from "@/backend/services/videoCourses";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import multer from "multer";
import path from "path";
import { upload } from "@/backend/middlewares/multer/upload";

const router = createRouter<any, any>();

router
  .use(upload.fields([{ name: "image" }]))
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const {
        id: videoCourseId,
        moduleId,
        sectionId,
        subSectionId,
        subSectionBlockId,
      } = req.query;
      if (!videoCourseId) throw new Error("videoCourseId is required");
      if (!moduleId) throw new Error("moduleId is required");
      if (!sectionId) throw new Error("sectionId is required");
      if (!subSectionId) throw new Error("subSectionId is required");
      if (!subSectionBlockId) throw new Error("subSectionBlockId is required");

      const subSectionBlock = await getVideoCourseModuleSubSectionBlock(
        videoCourseId as string,
        sectionId as string,
        subSectionId as string,
        subSectionBlockId as string
      );
      const note = subSectionBlock?.note;
      console.log(subSectionBlock);
      console.log(note);
      res.status(200).json({ data: note });
    } catch (error) {
      res.status(400).json({ error });
    }
  })
  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const {
        id: videoCourseId,
        moduleId,
        sectionId,
        subSectionId,
        subSectionBlockId,
      } = req.query;
      const { noteId } = req.body;
      if (!videoCourseId) throw new Error("videoCourseId is required");
      if (!moduleId) throw new Error("moduleId is required");
      if (!sectionId) throw new Error("sectionId is required");
      if (!subSectionId) throw new Error("subSectionId is required");
      if (!subSectionBlockId) throw new Error("subSectionBlockId is required");
      if (!noteId) throw new Error("noteId is required");

      const subSectionBlock = await updateVideoCourseModuleSubSectionBlockNote(
        videoCourseId as string,
        sectionId as string,
        subSectionId as string,
        subSectionBlockId as string,
        noteId as string
      );
      res.status(201).json({ data: subSectionBlock });
      console.log("Updated Block:", subSectionBlock);
    } catch (error) {
      res.status(400).json({ error });
    }
  })
  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const {
        id: videoCourseId,
        moduleId,
        sectionId,
        subSectionId,
        subSectionBlockId,
      } = req.query;
      if (!videoCourseId) throw new Error("videoCourseId is required");
      if (!moduleId) throw new Error("moduleId is required");
      if (!sectionId) throw new Error("sectionId is required");
      if (!subSectionId) throw new Error("subSectionId is required");
      if (!subSectionBlockId) throw new Error("subSectionBlockId is required");

      const subSectionBlock = await deleteVideoCourseModuleSubSectionBlockNote(
        videoCourseId as string,
        sectionId as string,
        subSectionId as string,
        subSectionBlockId as string
      );
      res.status(201).json({ data: subSectionBlock });
    } catch (error) {
      res.status(400).json({ error });
    }
  });

export const config = {
  api: {
    bodyParser: true,
  },
};

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});

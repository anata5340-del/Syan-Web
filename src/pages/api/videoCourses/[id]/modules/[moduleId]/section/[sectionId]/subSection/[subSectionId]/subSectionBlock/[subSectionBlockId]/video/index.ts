import { connectDB } from "@/backend/db/connect";
import {
  deleteVideoCourseModuleSubSectionBlockVideo,
  getVideoCourseModuleSubSectionBlock,
  updateVideoCourseModuleSubSectionBlockVideo,
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
      const video = subSectionBlock?.video;
      if (!video) {
        res.status(404).json({ message: "Video not found" });
      }
      res.status(200).json({ video });
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
      const { videoId } = req.body;
      if (!videoCourseId) throw new Error("videoCourseId is required");
      if (!moduleId) throw new Error("moduleId is required");
      if (!sectionId) throw new Error("sectionId is required");
      if (!subSectionId) throw new Error("subSectionId is required");
      if (!subSectionBlockId) throw new Error("subSectionBlockId is required");
      if (!videoId) throw new Error("videoId is required");

      const subSectionBlock = await updateVideoCourseModuleSubSectionBlockVideo(
        videoCourseId as string,
        sectionId as string,
        subSectionId as string,
        subSectionBlockId as string,
        videoId as string
      );
      res.status(201).json({ data: subSectionBlock });
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

      const subSectionBlock = await deleteVideoCourseModuleSubSectionBlockVideo(
        videoCourseId as string,
        sectionId as string,
        subSectionId as string,
        subSectionBlockId as string
      );
      res.status(201).json({ data: subSectionBlock });
    } catch (error) {
      console.log("errr:", error.message);
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

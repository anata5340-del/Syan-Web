import { connectDB } from "@/backend/db/connect";
import {
  deleteVideoCourseModuleSubSection,
  editVideoCourseModuleSubSection,
  getVideoCourseModuleSubSection,
} from "@/backend/services/videoCourses";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import multer from "multer";
import path from "path";
import { updateVideoCourseModuleSubSectionValidator } from "@/backend/validators/videoCourse";
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
      } = req.query;

      if (!videoCourseId) throw new Error("videoCourseId is required");
      if (!moduleId) throw new Error("moduleId is required");
      if (!sectionId) throw new Error("sectionId is required");
      if (!subSectionId) throw new Error("subSectionId is required");

      const subSection = await getVideoCourseModuleSubSection(
        videoCourseId as string,
        sectionId as string,
        subSectionId as string
      );
      res.status(200).json({ subSection });
    } catch (error) {
      res.status(400).json({ error });
    }
  })
  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      req.body.subSection.image =
        req?.files?.image?.[0]?.location ?? req.body.image;
      const {
        id: videoCourseId,
        moduleId,
        sectionId,
        subSectionId,
      } = req.query;
      const { subSection } = req.body;
      const validatorData = {
        id: videoCourseId,
        moduleId,
        sectionId,
        subSectionId,
        subSection,
      };

      await updateVideoCourseModuleSubSectionValidator(validatorData);

      const videoCourses = await editVideoCourseModuleSubSection(
        videoCourseId as string,
        sectionId as string,
        subSectionId as string,
        subSection
      );
      res.status(200).json({
        videoCourses: videoCourses.videoCourse,
        subSection: videoCourses.subSection,
      });
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
      } = req.query;

      if (!videoCourseId) throw new Error("videoCourseId is required");
      if (!moduleId) throw new Error("moduleId is required");
      if (!sectionId) throw new Error("sectionId is required");
      if (!subSectionId) throw new Error("subSectionId is required");

      const videoCourses = await deleteVideoCourseModuleSubSection(
        videoCourseId as string,
        sectionId as string,
        subSectionId as string
      );
      res.status(201).json({ videoCourses });
    } catch (error) {
      res.status(400).json({ error });
    }
  });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});

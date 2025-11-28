import { connectDB } from "@/backend/db/connect";
import {
  createVideoCourseModuleSubSection,
  getVideoCourseModuleSubSection,
} from "@/backend/services/videoCourses";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import multer from "multer";
import path from "path";
import { createVideoCourseModuleSubSectionValidator } from "@/backend/validators/videoCourse";
import section from "../..";
import { upload } from "@/backend/middlewares/multer/upload";

const router = createRouter<any, any>();

router
  .use(upload.fields([{ name: "image" }]))
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const { videoCourseId, sectionId, subSectionId } = req.query;

      if (!videoCourseId || !sectionId || !subSectionId) {
        throw new Error(
          "videoCourseId, moduleId, sectionId, and subSectionId are required"
        );
      }

      const subSection = await getVideoCourseModuleSubSection(
        videoCourseId as string,
        sectionId as string,
        subSectionId as string
      );

      res.status(200).json({ subSection });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      req.body.subSection.image =
        req?.files?.image?.[0]?.location ?? req.body.image;
      const { id: videoCourseId, moduleId, sectionId } = req.query;
      const subSection = req.body.subSection;
      const validaotrData = {
        id: videoCourseId,
        moduleId,
        sectionId,
        subSection,
      };

      await createVideoCourseModuleSubSectionValidator(validaotrData);
      const videoCourses = await createVideoCourseModuleSubSection(
        videoCourseId as string,
        sectionId as string,
        subSection
      );
      res.status(200).json({
        videoCourses: videoCourses.videoCourse,
        subSection: videoCourses.subSection,
      });
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

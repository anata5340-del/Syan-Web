import { connectDB } from "@/backend/db/connect";
import {
  updateVideoCourseModuleSection,
  deleteVideoCourseModuleSection,
} from "@/backend/services/videoCourses";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import multer from "multer";
import path from "path";
import { updateVideoCourseModuleSectionValidator } from "@/backend/validators/videoCourse";
import { upload } from "@/backend/middlewares/multer/upload";

const router = createRouter<any, any>();

router
  .use(upload.fields([{ name: "image" }]))
  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      req.body.section.image =
        req?.files?.image?.[0]?.location ?? req.body.image;
      const { id: videoCourseId, sectionId } = req.query;
      const section = req.body.section;
      const validatorData = {
        id: videoCourseId,
        sectionId,
        section,
      };
      await updateVideoCourseModuleSectionValidator(validatorData);
      const videoCourses = await updateVideoCourseModuleSection(
        videoCourseId as string,
        sectionId as string,
        section
      );
      res.status(200).json({ videoCourses });
    } catch (error) {
      res.status(400).json({ error });
    }
  })
  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const { id: videoCourseId, sectionId } = req.query;
      if (!videoCourseId) throw new Error("videoCourseId is required");
      if (!sectionId) throw new Error("sectionId is required");

      const videoCourses = await deleteVideoCourseModuleSection(
        videoCourseId as string,
        sectionId as string
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

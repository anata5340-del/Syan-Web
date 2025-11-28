import { connectDB } from "@/backend/db/connect";
import {
  createVideoCourseModuleSubSectionBlock,
  getVideoCourseModuleSubSectionBlock,
} from "@/backend/services/videoCourses";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import multer from "multer";
import path from "path";
import { createVideoCourseModuleSubSectionBlockValidator } from "@/backend/validators/videoCourse";
import { upload } from "@/backend/middlewares/multer/upload";

const router = createRouter<any, any>();

router
  .use(upload.fields([{ name: "image" }]))
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      req.body.subSectionBlock.image =
        req?.files?.image?.[0]?.location ?? req.body.image;

      const {
        id: videoCourseId,
        moduleId,
        sectionId,
        subSectionId,
      } = req.query;
      const subSectionBlock = req.body.subSectionBlock;

      const validatorData = {
        id: videoCourseId,
        moduleId,
        sectionId,
        subSectionId,
        subSectionBlock,
      };

      await createVideoCourseModuleSubSectionBlockValidator(validatorData);

      const videoCourses = await createVideoCourseModuleSubSectionBlock(
        videoCourseId as string,
        sectionId as string,
        subSectionId as string,
        subSectionBlock
      );

      res.status(200).json({ videoCourses });
    } catch (error) {
      console.log("error:", error?.message);
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

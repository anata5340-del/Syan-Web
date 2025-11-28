import { connectDB } from "@/backend/db/connect";
import {
  updateVideoCourseModule,
  deleteVideoCourseModule,
} from "@/backend/services/videoCourses";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import multer from "multer";
import path from "path";
import { updateVideoCourseModuleValidator } from "@/backend/validators/videoCourse";
import { upload } from "@/backend/middlewares/multer/upload";

const router = createRouter<any, any>();

router
  .use(upload.fields([{ name: "image" }]))
  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const { id: videoCourseId } = req.query;
      const module = req.body.videoCourseModule;
      const validatorData = {
        id: videoCourseId,
        module,
      };

      await updateVideoCourseModuleValidator(validatorData);
      const videoCourses = await updateVideoCourseModule(
        videoCourseId as string,
        module
      );
      res.status(200).json({ videoCourses });
    } catch (error) {
      res.status(400).json({ error });
    }
  })
  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const { id: videoCourseId, moduleId } = req.query;
      if (!videoCourseId) throw new Error("Video Course id is required");
      if (!moduleId) throw new Error("Module id is required");
      const videoCourses = await deleteVideoCourseModule(
        videoCourseId as string
      );
      res.status(200).json({ videoCourses });
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

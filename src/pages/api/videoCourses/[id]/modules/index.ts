import { connectDB } from "@/backend/db/connect";
import {
  getVideoCourseModule,
  createVideoCourseModule,
} from "@/backend/services/videoCourses";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import multer from "multer";
import path from "path";
import { createVideoCourseModuleValidator } from "@/backend/validators/videoCourse";
import { upload } from "@/backend/middlewares/multer/upload";

const router = createRouter<any, any>();

router
  .use(upload.fields([{ name: "image" }]))
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const { id } = req.query;
      if (!id) throw new Error("id is required");
      const videoCourses = await getVideoCourseModule(id as string);
      res.status(200).json({ videoCourses });
    } catch (error) {
      res.status(400).json({ error });
    }
  })
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const { id: videoCourseId } = req.query;
      const module = req.body.videoCourseModule;
      const validaotrData = {
        id: videoCourseId,
        module,
      };
      await createVideoCourseModuleValidator(validaotrData);
      const videoCourses = await createVideoCourseModule(
        videoCourseId as string,
        module
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

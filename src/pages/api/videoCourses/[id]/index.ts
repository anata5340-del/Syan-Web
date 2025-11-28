import { connectDB } from "@/backend/db/connect";
import {
  updateVideoCourse,
  deleteVideoCourse,
  getVideoCourse,
} from "@/backend/services/videoCourses";
import { isArray } from "lodash";
import { updateVideoCourseValidator } from "@/backend/validators/videoCourse";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import multer from "multer";
import path from "path";
import { id } from "date-fns/locale";
import { upload } from "@/backend/middlewares/multer/upload";

const router = createRouter<any, any>();
router
  .use(upload.fields([{ name: "image" }]))
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const { id } = req.query;
      if (!id) throw new Error("Id is required");
      const quiz = await getVideoCourse(isArray(id) ? id[0] : id);
      res.status(200).json({ quiz });
    } catch (error) {
      res.status(400).json({ error });
    }
  })
  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      req.body.videoCourse.image =
        req?.files?.image?.[0]?.location ?? req.body.image;
      const { id } = req.query;
      const { videoCourse } = req.body;
      await updateVideoCourseValidator(id as string, { videoCourse });
      const updatedVideoCourse = await updateVideoCourse(
        id as string,
        videoCourse
      );
      res.status(201).json({ updatedVideoCourse });
    } catch (error) {
      res.status(400).json({ error });
    }
  })
  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const { id } = req.query;
      if (!id) throw new Error("id is required");
      const deletedCourse = await deleteVideoCourse(id as string);
      res.status(200).json({ deletedCourse });
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

import { connectDB } from "@/backend/db/connect";
import {
  createVideoCourse,
  getVideoCourses,
} from "@/backend/services/videoCourses";
import { createVideoCourseValidator } from "@/backend/validators/videoCourse";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import multer from "multer";
import path from "path";
import { verify } from "@/backend/middlewares/jose";
import { upload } from "@/backend/middlewares/multer/upload";

const secret = process.env.JWT_SECRET;

const router = createRouter<any, any>();

router
  .use(upload.fields([{ name: "image" }]))
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      req.body.videoCourse.image = req?.files?.image?.[0]?.location;
      await createVideoCourseValidator(req.body);
      const videoCourse = await createVideoCourse(req.body.videoCourse);
      res.status(201).json({ videoCourse });
    } catch (error) {
      res.status(400).json({ error });
    }
  })
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();

    try {
      const videoCourses = await getVideoCourses();
      const { token } = req.cookies;
      videoCourses.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      let videoCoursesToSend;

      if (token && secret) {
        const user = await verify(token, secret);

        if (user) {
          if (user.admin) {
            return res.status(200).json({ videoCourses });
          }
          videoCoursesToSend = videoCourses.map((video) => {
            const found = user.courses.find(
              (course) => course?.type === "video" && course?._id === video.id
            );
            const { _id, name, color, image, modules } = video.toObject();
            return {
              _id,
              name,
              color,
              image,
              modules,
              isAccessible: !!found,
            };
          });
          videoCoursesToSend.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          return res.status(200).json({ videoCourses: videoCoursesToSend });
        }
      }

      // If no token or secret, or if user verification fails
      videoCoursesToSend = videoCourses.map((quiz) => {
        const { _id, name, color, image, modules } = quiz.toObject();
        return {
          _id,
          name,
          color,
          image,
          modules,
          isAccessible: false,
        };
      });

      return res.status(200).json({ videoCourses: videoCoursesToSend });
    } catch (error) {
      return res.status(400).json({ error });
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

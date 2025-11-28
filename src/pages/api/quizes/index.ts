import { connectDB } from "@/backend/db/connect";
import { createQuiz, getQuizes, updateQuiz } from "@/backend/services/quizes";
import { Token, verify } from "@/backend/middlewares/jose";
import {
  createQuizValidator,
  updateQuizValidator,
} from "@/backend/validators/quiz";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import multer from "multer";
import { upload } from "@/backend/middlewares/multer/upload";
import path from "path";

const secret = process.env.JWT_SECRET;

const router = createRouter<any, any>();

router
  .use(upload.fields([{ name: "image" }]))
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      req.body.quiz.image = req?.files?.image?.[0]?.location;
      await createQuizValidator(req.body);
      const quiz = await createQuiz(req.body.quiz);
      res.status(201).json({ quiz });
    } catch (error) {
      res.status(400).json({ error });
    }
  })
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();

    try {
      const quizes = await getQuizes();
      quizes.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      const { token } = req.cookies;
      let quizesToSend;

      if (token && secret) {
        const user = await verify(token, secret);

        if (user) {
          if (user.admin) {
            return res.status(200).json({ quizes });
          }
          quizesToSend = quizes.map((quiz) => {
            const found = user.courses.find(
              (course) => course?.type === "quiz" && course?._id === quiz.id
            );
            const {
              _id,
              name,
              color,
              categories,
              createdAt,
              customQuestions,
              image,
              library,
              updatedAt,
            } = quiz.toObject();
            return {
              _id,
              name,
              color,
              categories,
              createdAt,
              customQuestions,
              image,
              library,
              updatedAt,
              isAccessible: !!found,
            };
          });

          return res.status(200).json({ quizes: quizesToSend });
        }
      }

      // If no token or secret, or if user verification fails
      quizesToSend = quizes.map((quiz) => {
        const {
          _id,
          name,
          color,
          categories,
          createdAt,
          customQuestions,
          image,
          library,
          updatedAt,
        } = quiz.toObject();
        return {
          _id,
          name,
          color,
          categories,
          createdAt,
          customQuestions,
          image,
          library,
          updatedAt,
          isAccessible: false,
        };
      });

      return res.status(200).json({ quizes: quizesToSend });
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

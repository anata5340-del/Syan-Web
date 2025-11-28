import { connectDB } from "@/backend/db/connect";
import { NextApiRequest, NextApiResponse } from "next";
import isArray from "lodash/isArray";
import { deleteQuiz, getQuiz, updateQuiz } from "@/backend/services/quizes";
import { createRouter } from "next-connect";
import multer from "multer";
import path from "path";
import { upload } from "@/backend/middlewares/multer/upload";
import {
  updateQuizValidator,
  // updateQuizQuestionsValidator,
} from "@/backend/validators/quiz";

const router = createRouter<any, any>();

router
  .use(upload.fields([{ name: "image" }]))
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const { id } = req.query;
      if (!id) throw new Error("Id is required");
      const quiz = await getQuiz(isArray(id) ? id[0] : id);
      res.status(200).json({ quiz });
    } catch (error) {
      res.status(400).json({ error });
    }
  })
  // .put(async (req: NextApiRequest, res: NextApiResponse) => {
  //   await connectDB();
  //   try {
  //     await updateQuizQuestionsValidator(req.body);
  //     const updatedQuiz = await updateQuiz(req.body.id, req.body.quiz);
  //     res.status(200).json({ question: updatedQuiz });
  //   } catch (error) {
  //     res.status(400).json({ error });
  //   }
  // })
  .patch(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const { id } = req.query;
      if (!id) throw new Error("Quiz ID is missing in the request.");

      console.log("Quiz ID:", id);
      console.log("Request Body Before Parsing:", req.body);
      console.log("Request Files:", req.files);

      req.body.quiz.image = req?.files?.image?.[0]?.location ?? req.body.image;

      console.log("Request Body After Image Parsing:", req.body);

      // Validate and update the quiz
      await updateQuizValidator({ ...req.body, id });
      const updatedQuiz = await updateQuiz(id, req.body.quiz);

      console.log("Updated Quiz:", updatedQuiz);

      res.status(200).json({ quiz: updatedQuiz });
    } catch (error) {
      console.error("Update Quiz Error:", error.message, error.stack);

      // Send appropriate error response
      res.status(400).json({
        error:
          error.message || "An unexpected error occurred during quiz update.",
      });
    }
  })

  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const { id } = req.query;
      if (!id) throw new Error("Id is required");
      const question = await deleteQuiz(isArray(id) ? id[0] : id);
      res.status(201).json({ question });
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

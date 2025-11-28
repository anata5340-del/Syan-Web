import { connectDB } from "@/backend/db/connect";
import { NextApiRequest, NextApiResponse } from "next";
import {
  createQuizLibraryPaper,
  updateQuizLibraryPaper,
  updateQuizLibraryPaperQuestions,
} from "@/backend/services/quizes";
import { createRouter } from "next-connect";
import { upload } from "@/backend/middlewares/multer/upload";
import multer from "multer";
import path from "path";
import {
  createQuizLibraryPaperValidator,
  updateQuizLibraryPaperValidator,
  updateQuizPaperQuestionsValidator,
} from "@/backend/validators/quiz";

const router = createRouter<any, any>();

router
  .use(upload.fields([{ name: "icon" }]))
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      req.body.paper.icon = req?.files?.icon?.[0]?.location;
      const { id: quizId } = req.query;
      await createQuizLibraryPaperValidator({
        paper: req.body.paper,
        id: quizId,
      });
      const quizLibraryPapers = await createQuizLibraryPaper(
        quizId as string,
        req.body.paper
      );
      res.status(200).json({ papers: quizLibraryPapers });
    } catch (error) {
      res.status(400).json({ error });
    }
  })
  .patch(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      req.body.paper.icon = req?.files?.icon?.[0]?.location ?? req.body.icon;
      const { id: quizId } = req.query;
      await updateQuizLibraryPaperValidator({
        paper: req.body.paper,
        id: quizId,
      });
      const quizLibraryPapers = await updateQuizLibraryPaper(
        quizId as string,
        req.body.paper
      );
      res.status(200).json({ papers: quizLibraryPapers });
    } catch (error) {
      res.status(400).json({ error });
    }
  })
  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const { id } = req.query;

      await updateQuizPaperQuestionsValidator({
        id,
        ...req.body,
      });
      const { paperId, questions } = req.body;
      const quiz = await updateQuizLibraryPaperQuestions(
        id as string,
        paperId,
        questions
      );
      res.status(200).json({ quiz });
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

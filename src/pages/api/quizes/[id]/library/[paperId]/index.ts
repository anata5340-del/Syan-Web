import { connectDB } from "@/backend/db/connect";
import { NextApiRequest, NextApiResponse } from "next";
import isArray from "lodash/isArray";
import {
  createQuizLibraryPaper,
  deleteQuiz,
  deleteQuizPaper,
  getPaper,
  getQuiz,
  updateQuiz,
  updateQuizLibraryPaper,
} from "@/backend/services/quizes";
import { createRouter } from "next-connect";

const router = createRouter<any, any>();

router.delete(async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  try {
    const { id: quizId, paperId } = req.query;
    if (!quizId || !paperId) throw new Error("Id is required");
    const quiz = await deleteQuizPaper(quizId, paperId);

    res.status(201).json({ quiz });
  } catch (error) {
    res.status(400).json({ error });
  }
}).get(async(req:NextApiRequest, res:NextApiResponse)=>{
  await connectDB();
  try {
    const { id: quizId, paperId } = req.query;
    if (!quizId || !paperId) throw new Error("Id is required");
    const quiz = await getPaper(isArray(quizId)?quizId[0]:quizId, isArray(paperId)?paperId[0]:paperId);

    res.status(201).json({ quiz });
  } catch (error) {
    res.status(400).json({ error });
  }
})

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

import { connectDB } from "@/backend/db/connect";
import { NextApiRequest, NextApiResponse } from "next";
import {
  createQuizCustomLibrary,
  getQuiz,
  updateQuizCustomLibrary,
} from "@/backend/services/quizes";
import { createRouter } from "next-connect";
import { isArray } from "lodash";
import { Quiz, TopicQuestion } from "@/backend/types";
import { getQuestionsbyIds } from "@/backend/services/questions";

const getselectedQuestions = (topics: TopicQuestion[]) => {
  const combinedQuestions = topics.reduce<string[]>((acc, item) => {
    item.questions.forEach((question) => {
      // if (!acc.includes(question)) {
      acc.push(question);
      // }
    });
    return acc;
  }, []);
  return combinedQuestions;
};

const router = createRouter<any, any>();

router
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const { id: quizId, topicIds, limit } = req.query;
      const topicIdsArray = topicIds.split(",");
      if (!quizId) throw new Error("Quiz id is required");
      const quiz = (await getQuiz(
        isArray(quizId) ? quizId[0] : quizId
      )) as Quiz;

      const topics = quiz.customQuestions.flatMap((questions) =>
        questions.subTopics.map((subTopic) => subTopic)
      );

      const filteredTopics = topics.filter((topic) =>
        topicIdsArray?.includes(topic._id.toString())
      );

      const questionIds = getselectedQuestions(filteredTopics);
      const questions = await getQuestionsbyIds(questionIds);
      const shuffled = questions
        ? questions.sort(() => 0.5 - Math.random())
        : [];
      const questionsToSend = shuffled.slice(
        0,
        Math.min(Number(limit), shuffled.length)
      );
      if (!questions) {
        res.status(404).json({ message: "no questions found" });
      }
      res.status(200).json({ questions: questionsToSend });
    } catch (error) {
      res.status(400).json({ error });
    }
  })
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const { id: quizId } = req.query;
      if (!quizId) throw new Error("Quiz id is required");
      const quizLibraryPapers = await createQuizCustomLibrary(
        quizId as string,
        req.body
      );
      res.status(200).json({ papers: quizLibraryPapers });
    } catch (error) {
      res.status(400).json({ error });
    }
  })
  .patch(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const { id: quizId } = req.query;
      if (!quizId) throw new Error("Quiz id is required");
      const quizLibraryPapers = await updateQuizCustomLibrary(
        quizId as string,
        req.body
      );
      res.status(200).json({ papers: quizLibraryPapers });
    } catch (error) {
      res.status(400).json({ error });
    }
  });

export const config = {
  api: {
    bodyParser: true,
  },
};

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});

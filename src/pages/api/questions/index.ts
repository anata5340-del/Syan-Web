import { connectDB } from "@/backend/db/connect";
import {
  createQuestion,
  getQuestions,
  getQuestionsbyIds,
  updateQuestion,
} from "@/backend/services/questions";
import {
  createQuestionValidator,
  updateQuestionValidator,
} from "@/backend/validators/question";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    switch (req.method) {
      case "GET":
        try {
          const { ids } = req.query;
          let questions;

          if (ids) {
            // Split the ids if it's a string and convert to array if it's a single id
            const idsArray = Array.isArray(ids) ? ids : ids.split(",");
            questions = await getQuestionsbyIds(idsArray);
          } else {
            questions = await getQuestions();
          }
          questions.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          res.status(200).json({ questions });
        } catch (error) {
          res.status(400).json({ error: error });
        }
        break;
      case "POST":
        try {
          await createQuestionValidator(req.body);
          const question = await createQuestion(req.body.question);
          res.status(201).json({ question });
        } catch (error) {
          res.status(400).json({ error });
        }
        break;
      case "PUT":
        try {
          await updateQuestionValidator(req.body);
          const updatedQuestion = await updateQuestion(
            req.body.id,
            req.body.question
          );
          res.status(200).json({ question: updatedQuestion });
        } catch (error) {
          res.status(400).json({ error });
        }
        break;
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default handler;

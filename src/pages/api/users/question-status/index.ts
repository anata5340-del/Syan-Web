import { connectDB } from "@/backend/db/connect";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { verify } from "@/backend/middlewares/jose";
import {
  addQuestionStatus,
  getQuestionStatusByUser,
} from "@/backend/services/questionStatus";

const secret = process.env.JWT_SECRET;

const router = createRouter<any, any>();

router
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await connectDB();
      const cookies = req.cookies;
      const token = cookies["token"];
      if (!token || !secret) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const user = await verify(token, secret);
      if (!user) {
        return res.status(401).json({ message: "Invalid token" });
      }
      console.log(user.id);
      const questionStatuses = await getQuestionStatusByUser(user.id);
      console.log(questionStatuses);
      //   const users = await getUsers();
      res.status(200).json({ questionStatuses });
    } catch (error) {
      res.status(400).json({ error });
    }
  })
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await connectDB();
      const cookies = req.cookies;
      const token = cookies["token"];
      if (!token || !secret) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const user = await verify(token, secret);
      if (!user) {
        return res.status(401).json({ message: "Invalid token" });
      }
      await addQuestionStatus(
        user.id,
        req.body.questionId,
        req.body.questionName,
        req.body.correct
      );
      res.status(200).json("Question status added successfully");
    } catch (error) {
      res.status(400).json({ error });
    }
  });

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});

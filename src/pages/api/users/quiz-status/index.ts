import { connectDB } from "@/backend/db/connect";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { verify } from "@/backend/middlewares/jose";
import {
  getQuizStatusByUser,
  addOrUpdateQuizStatus,
} from "@/backend/services/quizStatus";

const secret = process.env.JWT_SECRET;

const router = createRouter<any, any>();

router
  // Fetch quiz statuses for the authenticated user
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

      const quizStatuses = await getQuizStatusByUser(user.id);
      res.status(200).json({ quizStatuses });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error });
    }
  })

  // Add or update a quiz status for the authenticated user
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

      const { quizName, progress, url } = req.body;

      if (!quizName || !url || typeof progress !== "number") {
        return res.status(400).json({
          message: "quizName, url, and progress are required fields",
        });
      }

      const updatedQuizStatus = await addOrUpdateQuizStatus(
        user.id,
        quizName,
        url,
        progress
      );

      res.status(200).json({
        message: "Quiz status updated successfully",
        updatedQuizStatus,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error });
    }
  });

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});

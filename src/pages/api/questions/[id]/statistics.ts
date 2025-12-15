import { connectDB } from "@/backend/db/connect";
import { getQuestionStatistics } from "@/backend/services/questionStatus";
import { NextApiRequest, NextApiResponse } from "next";
import isArray from "lodash/isArray";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    if (req.method !== "GET") {
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Question ID is required" });
    }

    const questionId = isArray(id) ? id[0] : id;
    const statistics = await getQuestionStatistics(questionId);
    res.status(200).json(statistics);
  } catch (error: any) {
    console.error("Error fetching question statistics:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

export default handler;


import { connectDB } from "@/backend/db/connect";
import {
  createCategory,
  getCategories,
  updateCategory,
} from "@/backend/services/categories";
import {
  createCategoryValidator,
  updateCategoryValidator,
} from "@/backend/validators/category";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    switch (req.method) {
      case "GET":
        try {
          const categories = await getCategories();
          res.status(200).json({ categories });
        } catch (error) {
          res.status(400).json({ error });
        }
        break;
      case "POST":
        try {
          await createCategoryValidator(req.body);
          const category = await createCategory(req.body.category);
          res.status(201).json({ category });
        } catch (error) {
          res.status(400).json({ error });
        }
        break;
      case "PUT":
        try {
          await updateCategoryValidator(req.body);
          const updatedQuiz = await updateCategory(
            req.body.id,
            req.body.category
          );
          res.status(200).json({ question: updatedQuiz });
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

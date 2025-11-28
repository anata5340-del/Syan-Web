import { connectDB } from "@/backend/db/connect";
import { NextApiRequest, NextApiResponse } from "next";
import isArray from "lodash/isArray";
import {
  deleteUserPackage,
  updateUserPackageStatus,
} from "@/backend/services/users";
import { updateUserValidator } from "@/backend/validators/user";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    switch (req.method) {
      case "PUT":
        try {
          const { id } = req.query;
          if (!id) throw new Error("Id is required");
          const user = await deleteUserPackage(
            isArray(id) ? id[0] : id,
            req.body
          );
          res.status(201).json({ user });
        } catch (error) {
          res.status(400).json({ error });
        }
        break;
      default:
        res.setHeader("Allow", ["GET", "DELETE", "PATCH"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default handler;

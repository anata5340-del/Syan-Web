import { connectDB } from "@/backend/db/connect";
import { NextApiRequest, NextApiResponse } from "next";
import isArray from "lodash/isArray";
import { addUserPackages, getUserPackages, updateUserPackage } from "@/backend/services/users";
import { updateUserValidator } from "@/backend/validators/user";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    switch (req.method) {
      case "GET":
          try{
            const {id} = req.query;
          if (!id) throw new Error("Id is required");
            await connectDB();
            const pkgs = await getUserPackages(isArray(id)?id[0] : id)
            res.json({pkgs})
            }catch(err){
              res.status(400).json({err})
            }
        break;
      case "PUT":
        try {
          const { id } = req.query;
          if (!id) throw new Error("Id is required");
          const user = await addUserPackages(
            isArray(id) ? id[0] : id,
            req.body
          );
          res.status(201).json({ user });
        } catch (error) {
          res.status(400).json({ error });
        }
        break;
      case "PATCH":
        try {
          const { id } = req.query;
          if (!id) throw new Error("Id is required");
          const user = await updateUserPackage(
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

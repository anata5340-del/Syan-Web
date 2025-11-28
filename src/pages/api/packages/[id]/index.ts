import { connectDB } from "@/backend/db/connect";
import { NextApiRequest, NextApiResponse } from "next";
import isArray from "lodash/isArray";
import {
  deletePackage,
  getPackage,
  updatePackage,
} from "@/backend/services/packages";
import {
  updatePackageNameValidator,
  updatePackageValidator,
} from "@/backend/validators/package";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    switch (req.method) {
      case "GET":
        try {
          const { id } = req.query;
          if (!id) throw new Error("Id is required");
          const packagge = await getPackage(isArray(id) ? id[0] : id);
          res.status(200).json({ package: packagge });
        } catch (error) {
          res.status(400).json({ error });
        }
        break;
      case "PUT":
        try {
          await updatePackageValidator(req.body);
          const updatedPackage = await updatePackage(
            req.body.id,
            req.body.package
          );
          res.status(200).json({ package: updatedPackage });
        } catch (error) {
          res.status(400).json({ error });
        }
        break;
      case "PATCH":
        try {
          await updatePackageNameValidator(req.body);
          const updatedPackage = await updatePackage(
            req.body.id,
            req.body.package
          );
          res.status(200).json({ package: updatedPackage });
        } catch (error) {
          res.status(400).json({ error });
        }
        break;
      case "DELETE":
        try {
          const { id } = req.query;
          if (!id) throw new Error("Id is required");
          const packagge = await deletePackage(isArray(id) ? id[0] : id);
          res.status(201).json({ package: packagge });
        } catch (error) {
          res.status(400).json({ error });
        }
        break;
      default:
        res.setHeader("Allow", ["GET", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default handler;

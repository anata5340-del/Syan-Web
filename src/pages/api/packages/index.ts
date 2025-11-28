import { connectDB } from "@/backend/db/connect";
import {
  createPackage,
  getPackages,
  updatePackage,
} from "@/backend/services/packages";
import {
  createPackageValidator,
  updatePackageValidator,
} from "@/backend/validators/package";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    switch (req.method) {
      case "GET":
        try {
          const packages = await getPackages();
          packages.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          res.status(200).json({ packages });
        } catch (error) {
          res.status(400).json({ error });
        }
        break;
      case "POST":
        try {
          await createPackageValidator(req.body);
          const packagge = await createPackage(req.body.package);
          res.status(201).json({ package: packagge });
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
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default handler;

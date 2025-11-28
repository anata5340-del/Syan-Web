import { connectDB } from "@/backend/db/connect";
import { NextApiRequest, NextApiResponse } from "next";
import isArray from "lodash/isArray";
import { deleteVideo, getVideo } from "@/backend/services/videos";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    switch (req.method) {
      case "GET":
        try {
          const { id } = req.query;
          if (!id) throw new Error("Id is required");
          const video = await getVideo(isArray(id) ? id[0] : id);
          res.status(200).json({ video });
        } catch (error) {
          res.status(400).json({ error });
        }
        break;
      case "DELETE":
        try {
          const { id } = req.query;
          if (!id) throw new Error("Id is required");
          const video = await deleteVideo(isArray(id) ? id[0] : id);
          res.status(201).json({ video });
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

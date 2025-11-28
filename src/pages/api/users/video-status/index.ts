import { connectDB } from "@/backend/db/connect";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { verify } from "@/backend/middlewares/jose";
import {
  getVideoStatusByUser,
  addOrUpdateVideoStatus,
} from "@/backend/services/videoStatus";

const secret = process.env.JWT_SECRET;

const router = createRouter<any, any>();

router
  // Fetch video statuses for the authenticated user
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

      const videoStatuses = await getVideoStatusByUser(user.id);
      res.status(200).json({ videoStatuses });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error });
    }
  })

  // Add or update a video status for the authenticated user
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

      const { videoId, videoName, contentId, completed, url } = req.body;

      if (
        !videoId ||
        !videoName ||
        !contentId ||
        !url ||
        typeof completed !== "boolean"
      ) {
        return res.status(400).json({
          message:
            "videoId, videoName, contentId, url, and completed are required fields",
        });
      }

      const updatedVideoStatus = await addOrUpdateVideoStatus(
        user.id,
        videoId,
        videoName,
        url,
        contentId,
        completed
      );
      res.status(200).json({
        message: "Video status updated successfully",
        updatedVideoStatus,
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

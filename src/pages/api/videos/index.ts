import { connectDB } from "@/backend/db/connect";
import { createVideo, getVideos, updateVideo } from "@/backend/services/videos";
import {
  createVideoValidator,
  updateVideoValidator,
} from "@/backend/validators/videos";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
// import { upload } from "@/backend/middlewares/multer/upload";

// Create next-connect router
const router = createRouter<any, any>();

// Middleware to handle file uploads
// router.use(
//   upload.fields([
//     { name: "thumbnail", maxCount: 1 },
//     { name: "videoSource", maxCount: 1 },
//     { name: "pdfSource", maxCount: 1 },
//   ])
// );

router
  /**
   * POST: Create a new video
   */
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const { thumbnail, videoSource, pdfSource, ...videoData } =
        req.body.video;

      // Ensure required files are uploaded
      if (!thumbnail || !videoSource || !videoSource) {
        return res
          .status(400)
          .json({ error: "Thumbnail,PDF and video are required." });
      }

      // Validate input
      await createVideoValidator(req.body);

      // Create video record in the database
      const video = await createVideo({
        ...videoData,
        thumbnail,
        videoSource,
        pdfSource,
      });

      res.status(201).json({ video });
    } catch (error) {
      console.error("Error creating video:", error);
      res.status(400).json({ error: error.message });
    }
  })

  /**
   * GET: Retrieve all videos
   */
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const videos = await getVideos(); // Fetch all videos from the database
      videos.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      res.status(200).json({ videos });
    } catch (error) {
      console.error("Error:", error);
      res.status(400).json({ error: error.message });
    }
  })

  /**
   * PUT: Update an existing video
   */
  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const { id, video } = req.body; // Extract the video ID and payload from the body
      const { thumbnail, videoSource, pdfSource, ...rest } = video;

      // Validate the payload
      await updateVideoValidator(req.body);

      // Update video in the database with the new file paths and data
      const updatedVideo = await updateVideo(id, {
        ...rest, // Include other video data
        ...(thumbnail && { thumbnail }), // Update thumbnail URL if provided
        ...(videoSource && { videoSource }), // Update video source URL if provided
        ...(pdfSource && { pdfSource }), // Update PDF source URL if provided
      });

      res.status(200).json({ video: updatedVideo });
    } catch (error) {
      console.error("Error updating video:", error);
      res.status(400).json({ error: error.message });
    }
  });

/**
 * API Configuration to disable the default body parser
 */
export const config = {
  api: {
    bodyParser: true, // Required for file uploads
  },
};

/**
 * Default handler with error handling
 */
export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});

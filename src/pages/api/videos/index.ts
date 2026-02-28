import { connectDB } from "@/backend/db/connect";
import { createVideo, getVideos, updateVideo } from "@/backend/services/videos";
import {
  createVideoValidator,
  updateVideoValidator,
} from "@/backend/validators/videos";
import { importVideoFromS3 } from "@/backend/services/gumlet";
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
      const { thumbnail, videoSource, pdfSource, gumletVideoId, ...videoData } =
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
        ...(gumletVideoId && { gumletVideoId }), // Include gumletVideoId if provided
      });

      // Import video to Gumlet asynchronously (don't block video creation)
      // Skip Gumlet import if gumletVideoId is already provided (e.g., from external Gumlet link)
      if (gumletVideoId) {
        console.log("Skipping Gumlet import - gumletVideoId already provided:", gumletVideoId);
      } else if (videoSource && !videoSource.startsWith("http://") && !videoSource.startsWith("https://")) {
        // Skip if it's not a URL (might be a file path)
        console.log("Skipping Gumlet import - videoSource is not a URL:", videoSource);
      } else if (videoSource) {
        // Import to Gumlet in the background
        importVideoFromS3({
          sourceUrl: videoSource,
          title: videoData.title || videoData.name || "Video",
        })
          .then((gumletVideoId) => {
            // Update video with Gumlet video ID
            updateVideo(video._id.toString(), {
              gumletVideoId,
            }).catch((error) => {
              console.error("Error updating video with Gumlet ID:", error);
            });
          })
          .catch((error) => {
            // Log error but don't fail video creation
            console.error("Error importing video to Gumlet:", error);
          });
      }

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
      const { thumbnail, videoSource, pdfSource, gumletVideoId, ...rest } = video;

      // Validate the payload
      await updateVideoValidator(req.body);

      // Update video in the database with the new file paths and data
      const updatedVideo = await updateVideo(id, {
        ...rest, // Include other video data
        ...(thumbnail && { thumbnail }), // Update thumbnail URL if provided
        ...(videoSource && { videoSource }), // Update video source URL if provided
        ...(pdfSource && { pdfSource }), // Update PDF source URL if provided
        ...(gumletVideoId && { gumletVideoId }), // Update Gumlet video ID if provided
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

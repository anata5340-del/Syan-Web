import { connectDB } from "@/backend/db/connect";
import { getVideos, updateVideo, getVideo } from "@/backend/services/videos";
import { importVideoFromS3, isVideoReady } from "@/backend/services/gumlet";
import { verify } from "@/backend/middlewares/jose";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import Cookies from "cookies";

const router = createRouter<any, any>();
const secret = process.env.JWT_SECRET;

// Middleware to verify admin authentication
const verifyAdmin = async (req: NextApiRequest, res: NextApiResponse, next: any) => {
  try {
    const cookies = new Cookies(req, res);
    const token = cookies.get("token");

    if (!token || !secret) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const user = await verify(token, secret);
    if (!user || !user.admin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid authentication token" });
  }
};

/**
 * GET: List all videos without Gumlet IDs
 */
router.get(verifyAdmin, async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  try {
    const videos = await getVideos();
    const videosWithoutGumletId = videos.filter(
      (video: any) => !video.gumletVideoId
    );

    res.status(200).json({
      total: videos.length,
      withoutGumletId: videosWithoutGumletId.length,
      videos: videosWithoutGumletId.map((video: any) => ({
        _id: video._id,
        name: video.name,
        title: video.title,
        videoSource: video.videoSource,
        displayId: video.displayId,
      })),
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST: Import video(s) to Gumlet
 * Body: { videoId?: string, all?: boolean }
 */
router.post(verifyAdmin, async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  try {
    const { videoId, all } = req.body;

    if (all) {
      // Import all videos without Gumlet IDs
      const videos = await getVideos();
      const videosWithoutGumletId = videos.filter(
        (video: any) => !video.gumletVideoId && video.videoSource
      );

      const results = {
        total: videosWithoutGumletId.length,
        success: 0,
        failed: 0,
        errors: [] as any[],
      };

      // Process videos in batches to avoid rate limits
      const batchSize = 5;
      for (let i = 0; i < videosWithoutGumletId.length; i += batchSize) {
        const batch = videosWithoutGumletId.slice(i, i + batchSize);

        await Promise.allSettled(
          batch.map(async (video: any) => {
            try {
              if (!video.videoSource) {
                throw new Error("Video source URL is missing");
              }

              const gumletVideoId = await importVideoFromS3({
                sourceUrl: video.videoSource,
                title: video.title || video.name || "Video",
              });

              // Update video with Gumlet ID
              await updateVideo(video._id.toString(), {
                gumletVideoId,
              });

              results.success++;
            } catch (error: any) {
              results.failed++;
              results.errors.push({
                videoId: video._id,
                videoName: video.name,
                error: error.message,
              });
              console.error(
                `Error importing video ${video._id} to Gumlet:`,
                error
              );
            }
          })
        );

        // Wait between batches to avoid rate limits
        if (i + batchSize < videosWithoutGumletId.length) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      res.status(200).json({
        message: "Bulk import completed",
        results,
      });
    } else if (videoId) {
      // Import specific video
      const video = await getVideo(videoId);

      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }

      if (video.gumletVideoId) {
        return res.status(400).json({
          error: "Video already has a Gumlet video ID",
          gumletVideoId: video.gumletVideoId,
        });
      }

      if (!video.videoSource) {
        return res.status(400).json({
          error: "Video source URL is missing",
        });
      }

      try {
        const gumletVideoId = await importVideoFromS3({
          sourceUrl: video.videoSource,
          title: video.title || video.name || "Video",
        });

        // Update video with Gumlet ID
        const updatedVideo = await updateVideo(videoId, {
          gumletVideoId,
        });

        res.status(200).json({
          message: "Video imported to Gumlet successfully",
          video: {
            _id: updatedVideo._id,
            name: updatedVideo.name,
            title: updatedVideo.title,
            gumletVideoId: updatedVideo.gumletVideoId,
          },
        });
      } catch (error: any) {
        console.error("Error importing video to Gumlet:", error);
        res.status(500).json({
          error: "Failed to import video to Gumlet",
          details: error.message,
        });
      }
    } else {
      res.status(400).json({
        error: "Either videoId or all=true must be provided",
      });
    }
  } catch (error: any) {
    console.error("Error in import endpoint:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});


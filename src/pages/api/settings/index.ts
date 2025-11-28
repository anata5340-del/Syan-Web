import { connectDB } from "@/backend/db/connect";
import {
  getPromotionSettings,
  updatePromotionSettings,
} from "@/backend/services/settings";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { upload } from "@/backend/middlewares/multer/upload"; // Assuming multer middleware is set up for S3 uploads

const router = createRouter<any, any>();

// Middleware to handle file uploads
router.use(upload.fields([{ name: "image", maxCount: 1 }]));

// GET: Fetch promotion settings
router.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  try {
    const settings = await getPromotionSettings();

    if (!settings) {
      return res.status(404).json({ message: "No promotion settings found" });
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch promotion settings" });
  }
});

// POST: Create or update promotion settings
router.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  try {
    const { promotionLink, imageName } = req.body;

    // Handle the image
    const image = req?.files?.image?.[0]?.location;

    let currentSettings = await getPromotionSettings(); // Fetch current settings
    // Use the existing imageLink if no new image is uploaded
    const updatedImage =
      image || (currentSettings ? currentSettings.image : null);
    const updatedImageName =
      imageName || (currentSettings ? currentSettings.imageName : null);
    const updatedPromotionLink =
      promotionLink || (currentSettings ? currentSettings.promotionLink : null);

    if (!updatedImage || !updatedPromotionLink || !updatedImageName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Update or create the promotion settings
    const updatedSettings = await updatePromotionSettings(
      updatedImageName,
      updatedImage,
      updatedPromotionLink
    );

    res.status(200).json(updatedSettings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Disable body parser to handle file uploads via multer
export const config = {
  api: {
    bodyParser: false,
  },
};

// Default error handler
export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});

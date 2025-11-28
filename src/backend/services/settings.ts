import { models } from "../mongo/models";
import { Settings } from "@/backend/types/settings";

/**
 * Get the settings for the promotion banner
 * @returns {Promise<Settings | null>} The settings document or null if not found
 */
export const getPromotionSettings = async (): Promise<Settings | null> => {
  try {
    const settings = await models.Settings.findOne();
    return settings;
  } catch (error) {
    console.error("Error fetching promotion settings:", error);
    throw new Error("Unable to fetch promotion settings");
  }
};

/**
 * Update or create the settings for the promotion banner
 * @param {string} imageName - The name of the uploaded image
 * @param {string} image - The URL of the uploaded image
 * @param {string} promotionLink - The link for the banner
 * @returns {Promise<Settings>} The updated or newly created settings document
 */
export const updatePromotionSettings = async (
  imageName: string,
  image: string,
  promotionLink: string
): Promise<Settings> => {
  try {
    let settings = await models.Settings.findOne();

    if (settings) {
      // Update existing settings
      settings.imageName = imageName;
      settings.image = image;
      settings.promotionLink = promotionLink;
    } else {
      // Create new settings
      settings = await models.Settings.create({
        imageName,
        image,
        promotionLink,
      });
    }

    await settings.save();
    return settings;
  } catch (error) {
    console.error("Error updating promotion settings:", error);
    throw new Error("Unable to update promotion settings");
  }
};

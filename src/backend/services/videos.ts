import { VideoPayload } from "@/backend/types";
import { models } from "@/backend/mongo/models";

const startDisplayId = 1100;

// Function to recalculate displayIds in sequential order
const updateDisplayIds = async () => {
  try {
    // Retrieve all videos sorted by creation order
    const videos = await models.Videos.find({}).sort({ createdAt: 1 });

    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      const newDisplayId = `SV-${startDisplayId + i}`;

      // Only update if the displayId has changed
      if (video.displayId !== newDisplayId) {
        await models.Videos.updateOne(
          { _id: video._id },
          { $set: { displayId: newDisplayId } }
        );
      }
    }

    console.log("Display IDs updated successfully!");
  } catch (error) {
    console.error("Error updating display IDs:", error);
  }
};

// Retrieve a single video
export const getVideo = (id: string) =>
  models.Videos.findById(id).populate("categories");

// Retrieve all videos
export const getVideos = () => models.Videos.find().populate("categories");

// Create a new video
export const createVideo = async (data: VideoPayload) => {
  try {
    const newVideo = await models.Videos.create(data);
    // Recalculate displayIds after adding a new video
    await updateDisplayIds();
    return newVideo;
  } catch (error) {
    console.error("Error creating video:", error);
    throw error;
  }
};

// Update an existing video
export const updateVideo = async (id: string, data: VideoPayload) => {
  try {
    const updatedVideo = await models.Videos.findByIdAndUpdate(id, data, {
      new: true,
    });
    // Ensure displayIds remain sequential (optional for updates)
    await updateDisplayIds();
    return updatedVideo;
  } catch (error) {
    console.error("Error updating video:", error);
    throw error;
  }
};

// Delete a video
export const deleteVideo = async (id: string) => {
  try {
    const deletedVideo = await models.Videos.findByIdAndDelete(id);
    // Recalculate displayIds after deleting a video
    await updateDisplayIds();
    return deletedVideo;
  } catch (error) {
    console.error("Error deleting video:", error);
    throw error;
  }
};

import { models } from "../mongo/models";

// Get video status by user
export const getVideoStatusByUser = async (userId: string) => {
  const videoStatus = await models.VideoStatus.find({ userId }).lean().exec();
  return videoStatus;
};

// Update content completion in an existing video
const updateVideoStatus = async (
  userId: string,
  videoId: string,
  videoName: string,
  url: string,
  contentId: string,
  completed: boolean
) => {
  const videoStatus = await models.VideoStatus.findOneAndUpdate(
    { userId, videoId, videoName, "content.contentId": contentId },
    { $set: { "content.$.completed": completed, url: url } },
    { new: true }
  ).exec();

  return videoStatus;
};

// Add or update video status
export const addOrUpdateVideoStatus = async (
  userId: string,
  videoId: string,
  videoName: string,
  url: string,
  contentId: string,
  completed: boolean
) => {
  if (!userId || !videoId || !contentId || !url) {
    throw new Error("userId, videoId, url and contentId are required");
  }

  // Check if the video already exists for the user
  const existingVideoStatus = await models.VideoStatus.findOne({
    userId,
    videoId,
    videoName,
  });

  if (existingVideoStatus) {
    // Check if the content already exists in the video
    const contentExists = existingVideoStatus.content.some(
      (content) => content.contentId.toString() === contentId
    );

    if (contentExists) {
      return updateVideoStatus(
        userId,
        videoId,
        videoName,
        url,
        contentId,
        completed
      );
    } else {
      // Add new content to the existing video
      existingVideoStatus.content.push({ contentId, completed });
      await existingVideoStatus.save();
      return existingVideoStatus;
    }
  }

  // Create a new video status entry
  const video = await models.Videos.findById(videoId);
  const videoStatus = await models.VideoStatus.create({
    userId,
    videoId,
    videoName,
    url,
    content: video?.content.map((content) =>
      content._id.toString() === contentId
        ? { contentId: content._id, completed: completed }
        : { contentId: content._id, completed: false }
    ),
  });

  return videoStatus;
};

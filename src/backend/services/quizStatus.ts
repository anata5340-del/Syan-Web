import { models } from "../mongo/models";

// Get quiz status by user
export const getQuizStatusByUser = async (userId: string) => {
  const quizStatus = await models.QuizStatus.find({ userId }).lean().exec();
  return quizStatus;
};

// Update progress for an existing quiz
const updateQuizStatus = async (
  userId: string,
  quizName: string,
  url: string,
  progress: number
) => {
  const quizStatus = await models.QuizStatus.findOneAndUpdate(
    { userId, quizName, url },
    { $set: { progress } },
    { new: true }
  ).exec();

  return quizStatus;
};

// Add or update quiz status
export const addOrUpdateQuizStatus = async (
  userId: string,
  quizName: string,
  url: string,
  progress: number
) => {
  if (!userId || !quizName || !url) {
    throw new Error("userId, quizName, and url are required");
  }

  // Check if the quiz already exists for the user
  const existingQuizStatus = await models.QuizStatus.findOne({
    userId,
    quizName,
    url,
  });

  if (existingQuizStatus) {
    // Update the progress of the existing quiz
    return updateQuizStatus(userId, quizName, url, progress);
  }

  // Create a new quiz status entry
  const quizStatus = await models.QuizStatus.create({
    userId,
    quizName,
    url,
    progress,
  });

  return quizStatus;
};

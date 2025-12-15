import { models } from "../mongo/models";
import mongoose from "mongoose";

export const getQuestionStatusByUser = async (userId: string) => {
  const questionStatus = await models.QuestionStatus.find({ userId })
    .lean()
    .exec();
  return questionStatus;
};

const updateQuestionStatus = async (
  userId: string,
  questionId: string,
  questionName: string,
  correct: boolean,
  selectedOption?: number
) => {
  const updateData: any = { correct, questionName };
  if (selectedOption !== undefined && selectedOption !== null) {
    updateData.selectedOption = selectedOption;
  }
  const questionStatus = await models.QuestionStatus.findOneAndUpdate(
    { userId, questionId },
    updateData,
    { new: true }
  );
  return questionStatus;
};

export const addQuestionStatus = async (
  userId: string,
  questionId: string,
  questionName: string,
  correct: boolean,
  selectedOption?: number
) => {
  if (!userId || !questionId || !questionName) {
    throw new Error("userId, questionName and questionId are required");
  }
  const existingQuestionStatus = await models.QuestionStatus.findOne({
    userId,
    questionId,
    questionName,
  });
  if (existingQuestionStatus) {
    return updateQuestionStatus(
      userId,
      questionId,
      questionName,
      correct,
      selectedOption
    );
  }
  const questionStatusData: any = {
    userId,
    questionId,
    questionName,
    correct,
  };
  if (selectedOption !== undefined && selectedOption !== null) {
    questionStatusData.selectedOption = selectedOption;
  }
  const questionStatus = await models.QuestionStatus.create(questionStatusData);
  return questionStatus;
};

// Get statistics for a question - percentage of users who selected each option
export const getQuestionStatistics = async (questionId: string) => {
  // Convert questionId to ObjectId if it's a string
  const queryQuestionId = mongoose.Types.ObjectId.isValid(questionId)
    ? new mongoose.Types.ObjectId(questionId)
    : questionId;

  // Get all question statuses for this question
  const allStatuses = await models.QuestionStatus.find({
    questionId: queryQuestionId,
    selectedOption: { $exists: true, $ne: null },
  }).lean();

  const totalSelections = allStatuses.length;

  console.log(`📊 Statistics for question ${questionId}:`, {
    totalSelections,
    statuses: allStatuses.map((s: any) => ({
      selectedOption: s.selectedOption,
      userId: s.userId,
    })),
  });

  // Initialize counts for each option (0-4)
  const optionCounts: Record<number, number> = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  };

  // Count selections for each option
  allStatuses.forEach((status: any) => {
    if (
      status.selectedOption !== undefined &&
      status.selectedOption !== null &&
      status.selectedOption >= 0 &&
      status.selectedOption <= 4
    ) {
      optionCounts[status.selectedOption] =
        (optionCounts[status.selectedOption] || 0) + 1;
    }
  });

  // Calculate percentages with better precision
  const options = [0, 1, 2, 3, 4].map((index) => {
    const count = optionCounts[index] || 0;
    const percentage =
      totalSelections > 0
        ? Math.round((count / totalSelections) * 100 * 100) / 100 // Round to 2 decimal places, then to nearest integer
        : 0;
    return {
      index,
      count,
      percentage,
    };
  });

  const result = {
    questionId,
    totalSelections,
    options,
  };

  console.log("📊 Calculated statistics:", result);
  return result;
};

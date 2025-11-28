import { models } from "../mongo/models";

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
  correct: boolean
) => {
  const questionStatus = await models.QuestionStatus.findOneAndUpdate(
    { userId, questionId },
    { correct, questionName },
    { new: true }
  );
  return questionStatus;
};

export const addQuestionStatus = async (
  userId: string,
  questionId: string,
  questionName: string,
  correct: boolean
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
    return updateQuestionStatus(userId, questionId, questionName, correct);
  }
  const questionStatus = await models.QuestionStatus.create({
    userId,
    questionId,
    questionName,
    correct,
  });
  return questionStatus;
};

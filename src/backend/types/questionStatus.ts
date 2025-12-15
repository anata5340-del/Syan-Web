export type QuestionStatus = {
  _id: string;
  userId: string;
  questionId: string;
  questionName: string;
  correct: boolean;
  selectedOption?: number;
};

export type VideoStatus = {
  _id: string;
  userId: string;
  quizName: string;
  progress: number; // Array of content objects with completion status
};

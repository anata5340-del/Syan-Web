import { Category } from "./category";

export type Question = {
  _id: string;
  name: string;
  statement: string;
  categories?: Category[];
  options: {
    name: string;
    isCorrect: boolean;
  }[];
  difficultyLevel: "easy" | "medium" | "hard";
  topic: string;
  explanation: string;
  reference?: string;
};

export type QuestionPayload = {
  name: string;
  statement: string;
  categories?: string[];
  options: {
    name: string;
    isCorrect: boolean;
  }[];
  difficultyLevel: "easy" | "medium" | "hard";
  topic: string;
  explanation: string;
  reference?: string;
};

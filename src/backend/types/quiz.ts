import { Category } from "./category";
import { Question } from "./question";

export type Paper = {
  _id: string,
  name: string;
  color: string;
  topic: string;
  icon: string;
  questions: string[];
};

export type Library = {
  papers: Paper[];
};

export type TopicQuestion = {
  _id: string
  name: string;
  questions: string[];
};

export type CustomQuestion = {
  topic: TopicQuestion;
  subTopics: TopicQuestion[];
};

export type Quiz = {
  name: string;
  categories: Category[];
  library: Library;
  customQuestions: CustomQuestion[];
  image: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
};

export type QuizPayload = {
  name: string;
  categories: string[];
  library?: {
    papers: {
      name: string;
      color: string;
      topic: string;
      icon: string;
      questions: string[];
    }[];
  };
  customQuestions?: CustomQuestion[];
  image: string;
  color: string;
};
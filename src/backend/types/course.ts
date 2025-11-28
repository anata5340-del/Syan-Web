import { Category } from "./category";
import { Note } from "./note";
import { Quiz } from "./quiz";
import { Video } from "./videos";

enum CourseType {
  VIDEO = "video",
  QUIZ = "quiz",
  NOTE = "note",
}

export type Course = {
  type: CourseType;
  _id: string;
};

export type CoursePayload = {
  type: CourseType;
  _id: string;
};

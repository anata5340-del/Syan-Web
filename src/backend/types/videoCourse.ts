import { Note } from "./note";
import { Question } from "./question";
import { Video } from "./videos";

export type SubSectionBlock = {
  _id: string;
  name: string;
  color: string;
  image: string;
  video: Video;
  note: Note;
  questions: Question[];
};

export type SubSection = {
  _id: string;
  name: string;
  color: string;
  image: string;
  topic: string;
  subSectionBlocks: SubSectionBlock[];
};

export type Section = {
  _id: string;
  name: string;
  color: string;
  image: string;
  topic: string;
  subSections: SubSection[];
};
export type Module = {
  _id: string;
  name: string;
  color: string;
  sections: Section[];
};

export type VideoCourses = {
  _id: string;
  name: string;
  color: string;
  image: string;
  modules: Module[];
};

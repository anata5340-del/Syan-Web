import { Category } from "./category";

export type Note = {
  _id: string;
  displayId: string;
  name: string;
  title: string;
  author: string;
  categories?: Category[];
  date: string;
  content: {
    name: string;
    content: string;
  }[];
};

export type NotePayload = {
  displayId: string;
  name: string;
  title: string;
  author: string;
  categories?: string[];
  content: {
    name: string;
    content: string;
  }[];
};

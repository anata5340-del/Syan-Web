import { Category } from "./category";

export type Video = {
  _id: string;
  name: string;
  title: string;
  author: string;
  categories?: Category[];
  image: string;
  color: string;
  videoSource: string;
  thumbnail: string;
  pdfSource: string;
  description: string;
  content?: {
    name: string;
    startTime: string;
    endTime: string;
  }[];
};

export type VideoPayload = {
  name: string;
  title: string;
  author: string;
  categories?: string[];
  image: string;
  color: string;
  videoSource: string;
  thumnail: string;
  pdfSource: string;
  description: string;
  content?: {
    name: string;
    startTime: string;
    endTime: string;
  }[];
};

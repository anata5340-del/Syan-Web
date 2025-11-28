import { Course } from "./course";

export type Package = {
  _id: string
  name: string;
  price: number;
  active: boolean;
  courses?: Course[];
};

export type PackagePayload = {
  name: string;
  price: number;
  active: boolean;
  courses?: string[];
};

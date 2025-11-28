import { Package } from "./package";

export type UserPackage = {
  _id(_id: any): Package | PromiseLike<Package>;
  package: Package;
  startDate: string;
  endDate: string;
  active: boolean;
};

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  cnic: string;
  cnicFront?: string;
  cnicBack?: string;
  jobStatus?: string;
  jobLocation?: string;
  yearOfGraduation?: string;
  institute?: string;
  address?: string;
  city?: string;
  country?: string;
  image?: string;
  active: boolean;
  packages?: UserPackage[];
  isDeleted: boolean;
  status?: "pending" | "approved" | "rejected";
};

export type UserPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  cnic: string;
  cnicFront?: string;
  cnicBack?: string;
  jobStatus?: string;
  jobLocation?: string;
  yearOfGraduation?: string;
  institute?: string;
  address?: string;
  city?: string;
  country?: string;
  image?: string;
  active?: boolean;
  packages?: string[];
  isDeleted?: boolean;
  status?: "pending" | "approved" | "rejected";
};

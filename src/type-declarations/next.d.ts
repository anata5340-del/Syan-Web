import { NextApiRequest as OriginalNextApiRequest } from "next";

declare module "next" {
  interface NextApiRequest extends OriginalNextApiRequest {
    file: Express.Multer.File;
    files: { [fieldName: string]: Express.Multer.File[] };
  }
}

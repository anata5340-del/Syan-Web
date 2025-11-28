import { connectDB } from "@/backend/db/connect";
import {
  createCourse,
  getCourses,
  updateCourse,
} from "@/backend/services/courses";
import {
  createCourseValidator,
  updateCourseValidator,
} from "@/backend/validators/course";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    switch (req.method) {
      case "GET":
        try {
          const courses = await getCourses();
          res.status(200).json({ courses });
        } catch (error) {
          res.status(400).json({ error });
        }
        break;
      case "POST":
        try {
          await createCourseValidator(req.body);
          const course = await createCourse(req.body.course);
          res.status(201).json({ course });
        } catch (error) {
          res.status(400).json({ error });
        }
        break;
      case "PUT":
        try {
          await updateCourseValidator(req.body);
          const updatedCourse = await updateCourse(
            req.body.id,
            req.body.course
          );
          res.status(200).json({ course: updatedCourse });
        } catch (error) {
          res.status(400).json({ error });
        }
        break;
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default handler;

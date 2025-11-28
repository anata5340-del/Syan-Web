import { connectDB } from "@/backend/db/connect";
import {
  deleteVideoCourseModuleSubSectionBlockQuestion,
  getVideoCourseModuleSubSectionBlock,
  updateVideoCourseModuleSubSectionBlockQuestions,
} from "@/backend/services/videoCourses";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import multer from "multer";
import path from "path";
import { upload } from "@/backend/middlewares/multer/upload";

const router = createRouter<any, any>();

router
  .use(upload.fields([{ name: "image" }]))
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const {
        id: videoCourseId,
        moduleId,
        sectionId,
        subSectionId,
        subSectionBlockId,
        questionIds,
      } = req.query;
      if (!videoCourseId) throw new Error("videoCourseId is required");
      if (!moduleId) throw new Error("moduleId is required");
      if (!sectionId) throw new Error("sectionId is required");
      if (!subSectionId) throw new Error("subSectionId is required");
      if (!subSectionBlockId) throw new Error("subSectionBlockId is required");
      if (!questionIds) throw new Error("question are required");

      const subSection = await getVideoCourseModuleSubSectionBlock(
        videoCourseId as string,
        sectionId as string,
        subSectionId as string,
        subSectionBlockId as string
      );
      console.log(subSection);
      const questions = subSection?.questions.filter((question) =>
        questionIds.includes(question._id)
      );
      res.status(200).json({ questions });
    } catch (error) {
      res.status(400).json({ error });
    }
  })
  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const {
        id: videoCourseId,
        moduleId,
        sectionId,
        subSectionId,
        subSectionBlockId,
      } = req.query;
      const { questionIds } = req.body;
      if (!videoCourseId) throw new Error("videoCourseId is required");
      if (!moduleId) throw new Error("moduleId is required");
      if (!sectionId) throw new Error("sectionId is required");
      if (!subSectionId) throw new Error("subSectionId is required");
      if (!subSectionBlockId) throw new Error("subSectionBlockId is required");
      if (!questionIds) throw new Error("question are required");

      const subSectionBlock =
        await updateVideoCourseModuleSubSectionBlockQuestions(
          videoCourseId as string,
          sectionId as string,
          subSectionId as string,
          subSectionBlockId as string,
          questionIds as string[]
        );
      res.status(201).json({ data: subSectionBlock });
    } catch (error) {
      res.status(400).json({ error });
    }
  })
  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const {
        id: videoCourseId,
        moduleId,
        sectionId,
        subSectionId,
        subSectionBlockId,
      } = req.query;
      const { questionId } = req.body;
      if (!videoCourseId) throw new Error("videoCourseId is required");
      if (!moduleId) throw new Error("moduleId is required");
      if (!sectionId) throw new Error("sectionId is required");
      if (!subSectionId) throw new Error("subSectionId is required");
      if (!subSectionBlockId) throw new Error("subSectionBlockId is required");
      if (!questionId) throw new Error("QuestionId is required");

      const subSectionBlock =
        await deleteVideoCourseModuleSubSectionBlockQuestion(
          videoCourseId as string,
          sectionId as string,
          subSectionId as string,
          subSectionBlockId as string,
          questionId as string
        );
      res.status(201).json({ data: subSectionBlock });
    } catch (error) {
      res.status(400).json({ error });
    }
  });

export const config = {
  api: {
    bodyParser: true,
  },
};

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});

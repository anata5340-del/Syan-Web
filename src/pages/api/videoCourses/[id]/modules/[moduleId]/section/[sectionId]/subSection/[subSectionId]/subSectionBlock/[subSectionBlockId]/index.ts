import { connectDB } from "@/backend/db/connect";
import {
  updateVideoCourseModuleSubSectionBlock,
  getVideoCourseModuleSubSectionBlock,
  deleteVideoCourseModuleSubSectionBlock, // Import the delete function
} from "@/backend/services/videoCourses";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import multer from "multer";
import { updateVideoCourseModuleSubSectionBlockValidator } from "@/backend/validators/videoCourse";
import { upload } from "@/backend/middlewares/multer/upload";

const router = createRouter<any, any>();

router
  .use(upload.fields([{ name: "image" }]))
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const {
        id: videoCourseId,
        sectionId,
        subSectionId,
        subSectionBlockId,
      } = req.query;

      if (!videoCourseId || !sectionId || !subSectionId || !subSectionBlockId) {
        throw new Error(
          "videoCourseId, sectionId, subSectionId, and subSectionBlockId are required"
        );
      }

      const subSectionBlock = await getVideoCourseModuleSubSectionBlock(
        videoCourseId as string,
        sectionId as string,
        subSectionId as string,
        subSectionBlockId as string
      );

      res.status(200).json({ subSectionBlock });
    } catch (error) {
      console.log("err:", error.message);
      res.status(400).json({ error: error.message });
    }
  })
  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      req.body.subSectionBlock.image =
        req?.files?.image?.[0]?.location ?? req.body.image;

      const {
        id: videoCourseId,
        moduleId,
        sectionId,
        subSectionId,
        subSectionBlockId,
      } = req.query;
      const subSectionBlock = req.body.subSectionBlock;
      console.log(subSectionBlock);
      const validatorData = {
        id: videoCourseId,
        moduleId,
        sectionId,
        subSectionId,
        subSectionBlock,
      };

      await updateVideoCourseModuleSubSectionBlockValidator(validatorData);

      const videoCourses = await updateVideoCourseModuleSubSectionBlock(
        videoCourseId as string,
        sectionId as string,
        subSectionId as string,
        subSectionBlockId as string,
        subSectionBlock
      );

      res.status(200).json({ videoCourses });
    } catch (error) {
      res.status(400).json({ error });
    }
  })
  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      const {
        id: videoCourseId,
        sectionId,
        subSectionId,
        subSectionBlockId,
      } = req.query;

      if (!videoCourseId || !sectionId || !subSectionId || !subSectionBlockId) {
        throw new Error(
          "videoCourseId, sectionId, subSectionId, and subSectionBlockId are required"
        );
      }

      // Call the delete function
      const updatedVideoCourse = await deleteVideoCourseModuleSubSectionBlock(
        videoCourseId as string,
        sectionId as string,
        subSectionId as string,
        subSectionBlockId as string
      );

      res.status(200).json({
        success: true,
        message: "Sub-section block deleted successfully",
        videoCourse: updatedVideoCourse,
      });
    } catch (error) {
      console.error("Error deleting sub-section block:", error.message);
      res.status(400).json({ error: error.message });
    }
  });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});

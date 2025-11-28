import * as yup from "yup";

const videoSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  title: yup.string().required("Title is required"),
  author: yup.string().required("Author is required"),
  categories: yup
    .array()
    .of(
      yup.object().shape({
        _id: yup.string().required("_id is required"),
        name: yup.string().required("Name is required"),
        createdAt: yup.string().optional(),
        updatedAt: yup.string().optional(),
        __v: yup.number().optional(),
      })
    )
    .required("Categories are required"),
  videoSource: yup.string().required("Video Source is required"),
  thumbnail: yup.string().required("Thumbnail is required"),
  pdfSource: yup.string().required("Pdf Source is required"),
  description: yup.string().required("Description is required"),
  content: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Name is required"),
        startTime: yup.string().required("Start Time is required"),
        endTime: yup.string().required("End Time is required"),
      })
    )
    .optional(),
});

export const createVideoValidator = (data: unknown) =>
  yup
    .object()
    .shape({
      video: videoSchema,
    })
    .validate(data);

export const updateVideoValidator = (data: unknown) =>
  yup
    .object()
    .shape({
      id: yup.string().required("Id is required"),
      video: videoSchema,
    })
    .validate(data);

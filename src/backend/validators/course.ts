import * as yup from "yup";

const courseSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  categories: yup.array().of(yup.string().required("Category is required")),
  image: yup.string().required("Image is required"),
  color: yup.string().required("Color is required"),
  quizes: yup.array().of(yup.string().required("Quiz is required")),
  videos: yup.array().of(yup.string().required("Video is required")),
  notes: yup.array().of(yup.string().required("Note is required")),
});

export const createCourseValidator = (data: unknown) =>
  yup
    .object()
    .shape({
      course: courseSchema,
    })
    .validate(data);

export const updateCourseValidator = (data: unknown) =>
  yup
    .object()
    .shape({
      id: yup.string().required("Id is required"),
      course: courseSchema,
    })
    .validate(data);

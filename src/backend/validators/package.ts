import * as yup from "yup";

const courseSchema = yup.object().shape({
  _id: yup.string().required("Id is required"),
  type: yup.string().required("Type is required"),
});

const createPackageSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  // price: yup.number().required("Price is required"),
  active: yup.boolean().required("Active is required"),
  // courses: yup.array().of(yup.string().required("Course is required")),
});

const updatePackageCoursesSchema = yup.object().shape({
  courses: yup.array().of(courseSchema).required("Courses is required"),
});

const updatePackageNameSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
});

export const createPackageValidator = (data: unknown) =>
  yup
    .object()
    .shape({
      package: createPackageSchema,
    })
    .validate(data);

export const updatePackageValidator = (data: unknown) =>
  yup
    .object()
    .shape({
      id: yup.string().required("Id is required"),
      package: updatePackageCoursesSchema,
    })
    .validate(data);

export const updatePackageNameValidator = (data: unknown) =>
  yup
    .object()
    .shape({
      id: yup.string().required("Id is required"),
      package: updatePackageNameSchema,
    })
    .validate(data);

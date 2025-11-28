import * as yup from "yup";

const categorySchema = yup.object().shape({
  name: yup.string().required("Name is required"),
});

export const createCategoryValidator = (data: unknown) => {
  return yup
    .object()
    .shape({
      category: categorySchema,
    })
    .validate(data);
};

export const updateCategoryValidator = (data: unknown) =>
  yup
    .object()
    .shape({
      id: yup.string().required("Id is required"),
      category: categorySchema,
    })
    .validate(data);

import * as yup from "yup";

// Define the schema for categories
const categorySchema = yup.object().shape({
  _id: yup.string().required("Category ID is required"), // Validate that each category has an _id
  name: yup.string().required("Category name is required"), // Optionally validate the name field if needed
});

// Define the schema for note content
const contentSchema = yup.object().shape({
  name: yup.string().required("Content name is required"),
  content: yup.string().required("Content is required"),
});

// Define the main note schema
const noteSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  title: yup.string().required("Title is required"),
  author: yup.string().required("Author is required"),
  categories: yup
    .array()
    .of(categorySchema)
    .required("At least one category is required"), // Updated to validate categories as objects
  content: yup
    .array()
    .of(contentSchema)
    .required("At least one content item is required"),
});

// Validator for creating a note
export const createNoteValidator = (data: unknown) =>
  yup
    .object()
    .shape({
      note: noteSchema,
    })
    .validate(data);

// Validator for updating a note
export const updateNoteValidator = (data: unknown) =>
  yup
    .object()
    .shape({
      id: yup.string().required("Id is required"), // Ensure the ID is present for updating
      note: noteSchema,
    })
    .validate(data);

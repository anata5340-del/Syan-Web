import * as yup from "yup";

// Define the schema for categories
const categorySchema = yup.object().shape({
  _id: yup.string().required("Category ID is required"), // Validate that each category has an _id
  name: yup.string().required("Category name is required"), // Optionally validate the name field if needed
});

// Define the schema for options
const optionSchema = yup.object().shape({
  name: yup.string().required("Option name is required"), // Validate that the option has a name
  isCorrect: yup.boolean().required("isCorrect field is required"), // Validate the isCorrect field
});

// Define the main question schema
const questionSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  statement: yup.string().required("Statement is required"),
  categories: yup
    .array()
    .of(categorySchema)
    .required("At least one category is required"), // Updated to validate categories as objects
  options: yup
    .array()
    .of(optionSchema)
    .min(2, "At least two options are required") // Ensure at least two options
    .required("Options are required"),
  difficultyLevel: yup
    .string()
    .oneOf(
      ["easy", "medium", "hard"],
      "Difficulty level must be 'easy', 'medium', or 'hard'"
    )
    .required("Difficulty level is required"),
  explanation: yup.string().required("Explanation is required"),
  topic: yup.string().required("Topic is required"),
  reference: yup.string().optional(), // Reference is optional
});

// Validator for creating a question
export const createQuestionValidator = (data: unknown) =>
  yup
    .object()
    .shape({
      question: questionSchema,
    })
    .validate(data);

// Validator for updating a question
export const updateQuestionValidator = (data: unknown) =>
  yup
    .object()
    .shape({
      id: yup.string().required("Id is required"), // Ensure the ID is present for updating
      question: questionSchema,
    })
    .validate(data);

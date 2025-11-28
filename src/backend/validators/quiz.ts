import * as yup from "yup";

const quizSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  categories: yup.array().of(yup.string().required("Category is required")),
  questions: yup.array().of(yup.string().required("Questions is required")),
  image: yup.string().required("Image is required"),
  color: yup.string().required("Color is required"),
});

const updateQuizSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  image: yup.string().required("Image is required"),
  color: yup.string().required("Color is required"),
});

const questionsSchema = yup.object().shape({
  questions: yup.array().of(yup.string().required("Questions is required")),
});

const createPaperSchema = yup.object().shape({
  name: yup.string().required("Id is required"),
  color: yup.string().required("Id is required"),
  topic: yup.string().required("Id is required"),
  icon: yup.string().required("Id is required"),
});

const updatePaperSchema = yup.object().shape({
  id: yup.string().required("Id is required"),
  name: yup.string().required("Id is required"),
  color: yup.string().required("Id is required"),
  topic: yup.string().required("Id is required"),
  icon: yup.string().required("Id is required"),
});

const librarySchema = yup.object().shape({
  id: yup.string().required("Id is required"),
  papers: createPaperSchema,
});

const topicSchema = yup.object().shape({
  name: yup.string().required("Topic name is required"),
  questions: questionsSchema,
});

const subTopicSchema = yup.object().shape({
  name: yup.string().required("Topic name is required"),
  questions: questionsSchema,
});

const createCustomLibrarySchema = yup.object().shape({
  topic: topicSchema,
  subTopics: [subTopicSchema],
});

export const createQuizValidator = (data: unknown) =>
  yup
    .object()
    .shape({
      quiz: quizSchema,
    })
    .validate(data);

export const updateQuizValidator = (data: unknown) => {
  return yup
    .object()
    .shape({
      id: yup.string().required("Id is required"),
      quiz: updateQuizSchema,
    })
    .validate(data);
};

export const updateQuizQuestionsValidator = (data: unknown) => {
  return yup
    .object()
    .shape({
      id: yup.string().required("Id is required"),
      quiz: questionsSchema,
    })
    .validate(data);
};

//new routes
export const createQuizLibraryPaperValidator = (data: unknown) => {
  return yup
    .object()
    .shape({
      id: yup.string().required("Id is required"),
      paper: createPaperSchema,
    })
    .validate(data);
};

export const updateQuizLibraryPaperValidator = (data: unknown) => {
  return yup
    .object()
    .shape({
      id: yup.string().required("Id is required"),
      paper: updatePaperSchema,
    })
    .validate(data);
};

export const updateQuizPaperQuestionsValidator = (data: unknown) => {
  return yup
    .object()
    .shape({
      id: yup.string().required("Id is required"),
      paperId: yup.string().required("Id is required"),
      questions: yup.array().of(yup.string().required("Questions is required")),
    })
    .validate(data);
};

export const createQuizCustomLibraryValidator = (data: unknown) => {
  return yup
    .object()
    .shape({
      id: yup.string().required("Quiz Id is required"),
      customLibrary: createCustomLibrarySchema,
    })
    .validate(data);
};

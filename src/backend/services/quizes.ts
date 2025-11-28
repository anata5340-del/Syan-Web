import { QuizPayload } from "@/backend/types";
import { models } from "@/backend/mongo/models";

const startDisplayId = 1100; // Starting value for SC-prefixed displayIds

// Function to recalculate displayIds in sequential order
const updateDisplayIds = async () => {
  try {
    // Retrieve all courses sorted by creation date
    const courses = await models.Quizes.find().sort({ createdAt: 1 });

    for (let i = 0; i < courses.length; i++) {
      const displayId = `SQC-${startDisplayId + i}`;

      // Update each course with the calculated displayId
      await models.Quizes.updateOne(
        { _id: courses[i]._id },
        { $set: { displayId } }
      );
    }

    console.log("Course displayIds updated successfully!");
  } catch (error) {
    console.error("Error updating course displayIds:", error);
  }
};

export const getQuiz = (id: string) =>
  models.Quizes.findById(id).populate("categories");

export const getQuizes = () => models.Quizes.find().populate("categories");

// Create a new course
export const createQuiz = async (data: QuizPayload) => {
  try {
    const newQuiz = await models.Quizes.create(data);

    // Recalculate displayIds after creating a new course
    await updateDisplayIds();
    return newQuiz;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

// Update an existing course
export const updateQuiz = async (id: string, data: QuizPayload) => {
  try {
    const updatedQuiz = await models.Quizes.findByIdAndUpdate(id, data, {
      new: true,
    }).populate("categories");

    // Ensure displayIds remain sequential after updates
    await updateDisplayIds();
    return updatedQuiz;
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

// Delete a course
export const deleteQuiz = async (id: string) => {
  try {
    const deletedQuiz = await models.Quizes.findByIdAndDelete(id);

    // Recalculate displayIds after deleting a course
    await updateDisplayIds();
    return deletedQuiz;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};

//new end points
export const createQuizLibraryPaper = async (id: string, data: QuizPayload) => {
  const result = await models.Quizes.findById(id).lean().exec();
  result.library.papers = [...result.library.papers, data];
  const payload = {
    library: {
      _id: result.library._id,
      papers: result.library.papers,
    },
  };
  return models.Quizes.findByIdAndUpdate(id, payload, { new: true });
};

export const updateQuizLibraryPaper = async (id: string, data: QuizPayload) => {
  const quiz = await models.Quizes.findById(id).lean().exec();
  quiz.library.papers = quiz.library.papers.map((paper) => {
    if (paper._id.toString() === data.id) {
      return data;
    }
    return paper;
  });
  const payload = {
    library: {
      _id: quiz.library._id,
      papers: quiz.library.papers,
    },
  };
  return models.Quizes.findByIdAndUpdate(id, payload, { new: true });
};

export const updateQuizLibraryPaperQuestions = async (
  id: string,
  paperId: string,
  questions: string[]
) => {
  const quiz = await models.Quizes.findById(id).lean().exec();
  quiz.library.papers = quiz.library.papers.map((paper) => {
    if (paper._id.toString() === paperId) {
      return { ...paper, questions };
    }
    return paper;
  });
  const payload = {
    library: {
      _id: quiz.library._id,
      papers: quiz.library.papers,
    },
  };
  return models.Quizes.findByIdAndUpdate(id, payload, { new: true });
};

export const deleteQuizPaper = async (id: string, paperId: string) => {
  const quiz = await models.Quizes.findById(id);
  quiz.library.papers = quiz.library.papers.filter(
    (paper) => paper._id.toString() !== paperId
  );
  const payload = {
    library: {
      _id: quiz.library._id,
      papers: quiz.library.papers,
    },
  };
  return models.Quizes.findByIdAndUpdate(id, payload, { new: true });
};

export const createQuizCustomLibrary = async (
  id: string,
  data: QuizPayload
) => {
  const result = await models.Quizes.findById(id).lean().exec();

  // Ensure `customQuestions` exists as an array
  if (!result.customQuestions) {
    result.customQuestions = [];
  }

  // Add the new quiz to the existing `customQuestions` array
  result.customQuestions.push(data);

  return models.Quizes.findByIdAndUpdate(id, result, { new: true });
};

export const updateQuizCustomLibrary = async (
  id: string,
  data: QuizPayload
) => {
  // Fetch the quiz data without `.lean()` to retain Mongoose document behavior
  const quiz = await models.Quizes.findById(id);

  if (!quiz || !quiz.customQuestions) {
    throw new Error("No custom quizzes found for this ID.");
  }

  // Update the `customQuestions` field
  quiz.customQuestions = quiz.customQuestions.map((quizItem) =>
    quizItem._id.toString() === data._id
      ? { ...quizItem.toObject(), ...data }
      : quizItem
  );

  // Save the updated quiz document
  return models.Quizes.findByIdAndUpdate(id, quiz, { new: true });
};

export const getPaper = async (quizId: string, paperId: string) => {
  try {
    const quiz = await models.Quizes.findById(quizId)
      .populate({
        path: "library.papers",
        match: { _id: paperId },
        populate: {
          path: "questions",
          model: "questions",
        },
      })
      .lean();

    if (!quiz) {
      throw new Error("Quiz not found");
    }

    const paper = quiz.library.papers[0];
    if (!paper) {
      throw new Error("Paper not found in the quiz");
    }
    return paper;
  } catch (e) {
    console.error("Error fetching questions:", e);
    throw e;
  }
};

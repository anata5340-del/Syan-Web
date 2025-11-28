import { QuestionPayload } from "@/backend/types";
import { models } from "@/backend/mongo/models";

const startDisplayId = 1100;

// Function to recalculate displayIds in sequential order
const updateDisplayIds = async () => {
  try {
    // Retrieve all questions sorted by creation order
    const questions = await models.Questions.find({}).sort({ createdAt: 1 });

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const newDisplayId = `SQ-${startDisplayId + i}`;

      // Only update if the displayId has changed
      if (question.displayId !== newDisplayId) {
        await models.Questions.updateOne(
          { _id: question._id },
          { $set: { displayId: newDisplayId } }
        );
      }
    }

    console.log("Display IDs updated successfully!");
  } catch (error) {
    console.error("Error updating display IDs:", error);
  }
};

// Retrieve a single question
export const getQuestion = (id: string) =>
  models.Questions.findById(id).populate("categories");

// Retrieve all questions
export const getQuestions = () =>
  models.Questions.find().populate("categories");

// Retrieve questions by an array of IDs, preserving duplicates
export const getQuestionsbyIds = async (ids: string[]) => {
  try {
    // Find the unique questions by IDs first
    const uniqueIds = [...new Set(ids)]; // Removing duplicates from the input array

    // Fetch questions based on unique IDs
    const questions = await models.Questions.find({
      _id: { $in: uniqueIds },
    });

    // Create a mapping of _id to question for easy lookup
    const questionMap = new Map();

    // Loop through the fetched questions and map them by _id string
    questions.forEach((question) => {
      questionMap.set(question._id.toString(), question); // Store as string key
    });

    // Now, recreate the questions array with duplicates by checking the original ids array
    const result = ids.map((id) => questionMap.get(id.toString())); // Ensure both ids are string

    return result; // This will return the questions, including duplicates
  } catch (err) {
    console.error(err);
  }
};

// Create a new question
export const createQuestion = async (data: QuestionPayload) => {
  try {
    const newQuestion = await models.Questions.create(data);
    // Recalculate displayIds after adding a new question
    await updateDisplayIds();
    return newQuestion;
  } catch (error) {
    console.error("Error creating question:", error);
    throw error;
  }
};

// Update an existing question
export const updateQuestion = async (id: string, data: QuestionPayload) => {
  try {
    const updatedQuestion = await models.Questions.findByIdAndUpdate(id, data, {
      new: true,
    });
    // Ensure displayIds remain sequential (optional for updates)
    await updateDisplayIds();
    return updatedQuestion;
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
};

// Delete a question
export const deleteQuestion = async (id: string) => {
  try {
    const deletedQuestion = await models.Questions.findByIdAndDelete(id);
    // Recalculate displayIds after deleting a question
    await updateDisplayIds();
    return deletedQuestion;
  } catch (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
};

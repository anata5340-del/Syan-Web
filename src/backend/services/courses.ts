import { models } from "@/backend/mongo/models";
import { CoursePayload } from "@/backend/types";

const startDisplayId = 1100; // Starting value for SC-prefixed displayIds

// Function to recalculate displayIds in sequential order
const updateDisplayIds = async () => {
  try {
    // Retrieve all courses sorted by creation date
    const courses = await models.Courses.find().sort({ createdAt: 1 });

    for (let i = 0; i < courses.length; i++) {
      const displayId = `SC-${startDisplayId + i}`;

      // Update each course with the calculated displayId
      await models.Courses.updateOne(
        { _id: courses[i]._id },
        { $set: { displayId } }
      );
    }

    console.log("Course displayIds updated successfully!");
  } catch (error) {
    console.error("Error updating course displayIds:", error);
  }
};

// Retrieve a single course
export const getCourse = (id: string) => models.Courses.findById(id);

// Retrieve all courses
export const getCourses = () => models.Courses.find();

// Create a new course
export const createCourse = async (data: CoursePayload) => {
  try {
    const newCourse = await models.Courses.create(data);

    // Recalculate displayIds after creating a new course
    await updateDisplayIds();
    return newCourse;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

// Update an existing course
export const updateCourse = async (id: string, data: CoursePayload) => {
  try {
    const updatedCourse = await models.Courses.findByIdAndUpdate(id, data, {
      new: true,
    });

    // Ensure displayIds remain sequential after updates
    await updateDisplayIds();
    return updatedCourse;
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

// Delete a course
export const deleteCourse = async (id: string) => {
  try {
    const deletedCourse = await models.Courses.findByIdAndDelete(id);

    // Recalculate displayIds after deleting a course
    await updateDisplayIds();
    return deletedCourse;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};

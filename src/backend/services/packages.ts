import { models } from "@/backend/mongo/models";
import { Course, PackagePayload } from "@/backend/types";

const startDisplayId = 1100; // Starting value for SP-prefixed displayIds

// Function to recalculate displayIds in sequential order
const updateDisplayIds = async () => {
  try {
    // Retrieve all packages sorted by creation date
    const packages = await models.Packages.find().sort({ createdAt: 1 });

    for (let i = 0; i < packages.length; i++) {
      const displayId = `SP-${startDisplayId + i}`;

      // Update each package with the calculated displayId
      await models.Packages.updateOne(
        { _id: packages[i]._id },
        { $set: { displayId } }
      );
    }

    console.log("Package displayIds updated successfully!");
  } catch (error) {
    console.error("Error updating package displayIds:", error);
  }
};

export const getPackage = async (id: string) => {
  const updatedPackage = await models.Packages.findById(id);

  const courses = [];
  const coursesLength = updatedPackage?.courses?.length ?? 0;

  // updatedPackage.courses = await Promise.all(
  for (let i = 0; i < coursesLength; i++) {
    const course = updatedPackage?.courses?.[i];
    if (course?.type === "video") {
      const video = await models.VideoCourses.findById(course?._id)
        .lean()
        .exec();
      courses.push({
        ...video,
        type: course?.type,
      } as unknown as Course);
    } else if (course?.type === "quiz") {
      const quiz = await models.Quizes.findById(course?._id).lean().exec();
      courses.push({
        ...quiz,
        type: course?.type,
      } as unknown as Course);
    } else if (course?.type === "note") {
      const note = await models.Notes.findById(course?._id).lean().exec();
      courses.push({
        ...note,
        type: course?.type,
      } as unknown as Course);
    }
  }
  const packageToReturn = { courses, ...updatedPackage };
  return packageToReturn;
};

export const getPackages = async () => {
  const packages = await models.Packages.find().lean().exec();
  const modifiedPackages = [];
  for (const packagee of packages) {
    const courses = [];
    const coursesLength = packagee?.courses?.length ?? 0;

    // updatedPackage.courses = await Promise.all(
    for (let i = 0; i < coursesLength; i++) {
      const course = packagee?.courses?.[i];
      if (course?.type === "video") {
        const video = await models.Videos.findById(course?._id).lean().exec();
        courses.push({
          ...video,
          type: course?.type,
        } as unknown as Course);
      } else if (course?.type === "quiz") {
        const quiz = await models.Quizes.findById(course?._id).lean().exec();
        courses.push({
          ...quiz,
          type: course?.type,
        } as unknown as Course);
      } else if (course?.type === "note") {
        const note = await models.Notes.findById(course?._id).lean().exec();
        courses.push({
          ...note,
          type: course?.type,
        } as unknown as Course);
      }
    }
    const packageToReturn = { ...packagee, courses };
    modifiedPackages.push(packageToReturn);
  }
  return modifiedPackages;
};
// Create a new package
export const createPackage = async (data: PackagePayload) => {
  try {
    const newPackage = await models.Packages.create(data);

    // Recalculate displayIds after creating a new package
    await updateDisplayIds();
    return newPackage;
  } catch (error) {
    console.error("Error creating package:", error);
    throw error;
  }
};

// Update an existing package
export const updatePackage = async (id: string, data: PackagePayload) => {
  try {
    const updatedPackage = await models.Packages.findByIdAndUpdate(id, data, {
      new: true,
    });

    // Ensure displayIds remain sequential after updates
    await updateDisplayIds();
    return updatedPackage;
  } catch (error) {
    console.error("Error updating package:", error);
    throw error;
  }
};

// Delete a package
export const deletePackage = async (id: string) => {
  try {
    const deletedPackage = await models.Packages.findByIdAndDelete(id);

    // Recalculate displayIds after deleting a package
    await updateDisplayIds();
    return deletedPackage;
  } catch (error) {
    console.error("Error deleting package:", error);
    throw error;
  }
};

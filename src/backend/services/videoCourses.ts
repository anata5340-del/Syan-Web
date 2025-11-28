import { models } from "@/backend/mongo/models";

const startDisplayId = 1100; // Starting value for SC-prefixed displayIds

// Function to recalculate displayIds in sequential order
const updateDisplayIds = async () => {
  try {
    // Retrieve all courses sorted by creation date
    const courses = await models.VideoCourses.find().sort({ createdAt: 1 });

    for (let i = 0; i < courses.length; i++) {
      const displayId = `SVC-${startDisplayId + i}`;

      // Update each course with the calculated displayId
      await models.VideoCourses.updateOne(
        { _id: courses[i]._id },
        { $set: { displayId } }
      );
    }

    console.log("Course displayIds updated successfully!");
  } catch (error) {
    console.error("Error updating course displayIds:", error);
  }
};

export const getVideoCourses = () => models.VideoCourses.find();

export const getVideoCourse = (id: string) => models.VideoCourses.findById(id);

// Create a new course
export const createVideoCourse = async (data: unknown) => {
  try {
    const newCourse = await models.VideoCourses.create(data);

    // Recalculate displayIds after creating a new course
    await updateDisplayIds();
    return newCourse;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

// Update an existing course
export const updateVideoCourse = async (id: string, data: unknown) => {
  try {
    const updatedCourse = await models.VideoCourses.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );

    // Ensure displayIds remain sequential after updates
    await updateDisplayIds();
    return updatedCourse;
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

// Delete a course
export const deleteVideoCourse = async (id: string) => {
  try {
    const deletedCourse = await models.VideoCourses.findByIdAndDelete(id);

    // Recalculate displayIds after deleting a course
    await updateDisplayIds();
    return deletedCourse;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};

export const getVideoCourseModule = async (id: string) => {
  const videoCourse = await models.VideoCourses.findById(id).lean().exec();
  const module = videoCourse?.modules?.length ? videoCourse.modules[0] : null;
  return { module };
};

export const createVideoCourseModule = async (id: string, data: unknown) => {
  const videoCourseId = id;
  const videoCourse = await models.VideoCourses.findById(videoCourseId)
    .lean()
    .exec();
  videoCourse?.modules.push(data);

  const updatedVideoCouse = await models.VideoCourses.findByIdAndUpdate(
    videoCourseId,
    videoCourse
  );
  return { videoCourse: updatedVideoCouse };
};

export const updateVideoCourseModule = async (id: string, data: unknown) => {
  const videoCourseId = id;
  const videoCourse = await models.VideoCourses.findById(videoCourseId)
    .lean()
    .exec();
  videoCourse["modules"] = [data];

  const updatedVideoCouse = await models.VideoCourses.findByIdAndUpdate(
    videoCourseId,
    videoCourse
  );
  return { videoCourse: updatedVideoCouse };
};

export const deleteVideoCourseModule = async (id: string) => {
  const videoCourseId = id;
  const videoCourse = await models.VideoCourses.findById(videoCourseId)
    .lean()
    .exec();
  const updatedVideoCourse = { ...videoCourse, modules: [] };
  return models.VideoCourses.findByIdAndUpdate(
    videoCourseId,
    updatedVideoCourse
  );
};

export const createVideoCourseModuleSection = async (
  id: string,
  data: unknown
) => {
  const videoCourseId = id;
  const videoCourse = await models.VideoCourses.findById(videoCourseId)
    .lean()
    .exec();
  const module = videoCourse.modules[0];
  module.sections.push(data);
  videoCourse["modules"] = [module];

  const updatedVideoCouse = await models.VideoCourses.findByIdAndUpdate(
    videoCourseId,
    videoCourse
  );
  return { videoCourse: updatedVideoCouse };
};

export const updateVideoCourseModuleSection = async (
  id: string,
  sectionId: string,
  data: any
) => {
  const videoCourseId = id;
  const videoCourse = await models.VideoCourses.findById(videoCourseId)
    .lean()
    .exec();
  const courseModule = videoCourse.modules[0];
  courseModule.sections = courseModule.sections.map((section: any) =>
    section._id.toString() === sectionId ? { ...section, ...data } : section
  );
  videoCourse["modules"] = [courseModule];
  const updatedVideoCouse = await models.VideoCourses.findByIdAndUpdate(
    videoCourseId,
    videoCourse
  );
  return { videoCourse: updatedVideoCouse };
};

export const deleteVideoCourseModuleSection = async (
  id: string,
  sectionId: string
) => {
  const videoCourseId = id;
  const videoCourse = await models.VideoCourses.findById(videoCourseId)
    .lean()
    .exec();
  const courseModule = videoCourse.modules[0];
  courseModule.sections = courseModule.sections.filter(
    (section: any) => section._id.toString() !== sectionId
  );
  videoCourse["modules"] = [courseModule];
  const updatedVideoCouse = await models.VideoCourses.findByIdAndUpdate(
    videoCourseId,
    videoCourse
  );
  return { videoCourse: updatedVideoCouse };
};

export const createVideoCourseModuleSubSection = async (
  id: string,
  sectionId: string,
  data: unknown
) => {
  const videoCourseId = id;
  const videoCourse = await models.VideoCourses.findById(videoCourseId)
    .lean()
    .exec();
  const module = videoCourse?.modules[0];
  module["sections"] = module?.sections?.map((section) => {
    if (section?._id.toString() === sectionId) {
      return {
        ...section,
        subSections: [...section?.subSections, data],
      };
    }
    return section;
  });
  videoCourse["modules"] = [module];

  const updatedVideoCouse = await models.VideoCourses.findByIdAndUpdate(
    videoCourseId,
    videoCourse
  );

  return { videoCourse: updatedVideoCouse };
};

export const getVideoCourseModuleSubSection = async (
  id: string,
  sectionId: string,
  subSectionId: string
) => {
  const videoCourseId = id;
  const videoCourse = await models.VideoCourses.findById(videoCourseId)
    .lean()
    .exec();
  const module = videoCourse?.modules[0];
  const section = module?.sections?.find(
    (section) => section._id.toString() === sectionId
  );
  const subSection = section?.subSections?.find(
    (subSection) => subSection._id.toString() === subSectionId
  );

  if (subSection.note) {
    const noteId = subSection?.note;
    subSection.note = await models.Notes.findById(noteId);
  }

  if (subSection.video) {
    const videoId = subSection?.video;
    subSection.video = await models.Videos.findById(videoId).populate(
      "categories"
    );
  }
  let questions = [];
  if (subSection.questions) {
    for (let i = 0; i < subSection.questions.length; i++) {
      const questionId = subSection.questions[i];
      const questionData = await models.Questions.findById(questionId);
      questions.push(questionData);
    }
    subSection.questions = questions;
  }

  return subSection;
};

export const editVideoCourseModuleSubSection = async (
  id: string,
  sectionId: string,
  subSectionId: string,
  data: unknown
) => {
  const videoCourseId = id;
  const videoCourse = await models.VideoCourses.findById(videoCourseId)
    .lean()
    .exec();
  const module = videoCourse?.modules[0];
  module["sections"] = module?.sections?.map((section) => {
    if (section?._id.toString() === sectionId) {
      return {
        ...section,
        subSections: section?.subSections?.map((subSection) => {
          if (subSection?._id.toString() === subSectionId) {
            return { ...subSection, ...data };
          }
          return subSection;
        }),
      };
    }
    return section;
  });
  videoCourse["modules"] = [module];

  const updatedVideoCouse = await models.VideoCourses.findByIdAndUpdate(
    videoCourseId,
    videoCourse
  );

  return { videoCourse: updatedVideoCouse };
};

export const deleteVideoCourseModuleSubSection = async (
  id: string,
  sectionId: string,
  subSectionId: string
) => {
  const videoCourseId = id;
  const videoCourse = await models.VideoCourses.findById(videoCourseId)
    .lean()
    .exec();
  const module = videoCourse?.modules[0];
  module["sections"] = module?.sections?.map((section) => {
    if (section?._id.toString() === sectionId) {
      return {
        ...section,
        subSections: section?.subSections?.filter(
          (subSection) => subSection._id.toString() !== subSectionId
        ),
      };
    }
    return section;
  });
  videoCourse["modules"] = [module];

  const updatedVideoCouse = await models.VideoCourses.findByIdAndUpdate(
    videoCourseId,
    videoCourse
  );

  return { videoCourse: updatedVideoCouse };
};

export const getVideoCourseModuleSubSectionQuestions = async (
  id: string,
  sectionId: string,
  subSectionId: string,
  questionIds: string[]
) => {
  const videoCourseId = id;

  // Fetch the video course and drill down to the subSection
  const videoCourse = await models.VideoCourses.findById(videoCourseId)
    .lean()
    .exec();
  const module = videoCourse?.modules[0];
  const section = module?.sections?.find(
    (section) => section._id.toString() === sectionId
  );
  const subSection = section?.subSections?.find(
    (subSection) => subSection._id.toString() === subSectionId
  );

  if (!subSection) {
    return { subSectionQuestions: [], sectionName: section?.name ?? "" };
  }

  // Flatten the questions from all subSectionBlocks
  const allQuestions = await Promise.all(
    subSection.subSectionBlocks.map(async (subSectionBlock) =>
      Promise.all(
        subSectionBlock.questions.map(async (qId) => {
          const question = await models.Questions.findById(qId).populate(
            "categories"
          );
          return question;
        })
      )
    )
  );

  // Map questions by their IDs to avoid duplicate fetching
  const questionMap = allQuestions
    .flat() // Flatten nested arrays
    .reduce((map, question) => {
      if (question) {
        map[question._id.toString()] = question; // Use question ID as the key
      }
      return map;
    }, {} as Record<string, any>);

  // Build the final array while maintaining the order of questionIds
  const finalQuestions = questionIds.map((qId) => {
    return questionMap[qId] || null; // Use the questionMap to fetch the question
  });

  // Filter out null values in case some question IDs are invalid
  const filteredQuestions = finalQuestions.filter((question) => question);

  return {
    subSectionQuestions: filteredQuestions,
    sectionName: section?.name ?? "",
  };
};

// subSectionBlock
export const createVideoCourseModuleSubSectionBlock = async (
  id: string,
  sectionId: string,
  subSectionId: string,
  blockData: unknown
) => {
  const videoCourseId = id;
  const videoCourse = await models.VideoCourses.findById(videoCourseId)
    .lean()
    .exec();

  const module = videoCourse?.modules[0];

  module["sections"] = module?.sections?.map((section) => {
    if (section?._id.toString() === sectionId) {
      section["subSections"] = section?.subSections?.map((subSection) => {
        if (subSection?._id.toString() === subSectionId) {
          return {
            ...subSection,
            subSectionBlocks: [...subSection?.subSectionBlocks, blockData],
          };
        }
        return subSection;
      });
      return section;
    }
    return section;
  });

  videoCourse["modules"] = [module];

  const updatedVideoCourse = await models.VideoCourses.findByIdAndUpdate(
    videoCourseId,
    videoCourse,
    { new: true }
  );

  return { videoCourse: updatedVideoCourse };
};

export const getVideoCourseModuleSubSectionBlock = async (
  id: string,
  sectionId: string,
  subSectionId: string,
  subSectionBlockId: string
) => {
  const videoCourse = await models.VideoCourses.findById(id).lean().exec();
  const module = videoCourse?.modules[0];
  const section = module?.sections?.find(
    (section) => section._id.toString() === sectionId
  );
  const subSection = section?.subSections?.find(
    (subSection) => subSection._id.toString() === subSectionId
  );
  const subSectionBlock = subSection?.subSectionBlocks?.find(
    (block) => block._id.toString() === subSectionBlockId
  );

  if (subSectionBlock) {
    if (subSectionBlock.note) {
      subSectionBlock.note = await models.Notes.findById(
        subSectionBlock.note
      ).populate("categories");
    }
    if (subSectionBlock.video) {
      subSectionBlock.video = await models.Videos.findById(
        subSectionBlock.video
      ).populate("categories");
    }
    if (subSectionBlock.questions) {
      subSectionBlock.questions = await Promise.all(
        subSectionBlock.questions.map((qId) =>
          models.Questions.findById(qId).populate("categories")
        )
      );
    }
  }

  return subSectionBlock;
};

export const updateVideoCourseModuleSubSectionBlock = async (
  id: string,
  sectionId: string,
  subSectionId: string,
  subSectionBlockId: string,
  data: unknown
) => {
  const videoCourse = await models.VideoCourses.findById(id).lean().exec();
  const module = videoCourse?.modules[0];

  module["sections"] = module?.sections?.map((section) => {
    if (section._id.toString() === sectionId) {
      section["subSections"] = section?.subSections?.map((subSection) => {
        if (subSection._id.toString() === subSectionId) {
          return {
            ...subSection,
            subSectionBlocks: subSection?.subSectionBlocks?.map((block) => {
              if (block._id.toString() === subSectionBlockId) {
                return { ...block, ...data };
              }
              return block;
            }),
          };
        }
        return subSection;
      });
    }
    return section;
  });

  videoCourse["modules"] = [module];

  const updatedVideoCourse = await models.VideoCourses.findByIdAndUpdate(
    id,
    videoCourse,
    { new: true }
  );

  return { videoCourse: updatedVideoCourse };
};

export const deleteVideoCourseModuleSubSectionBlock = async (
  id: string,
  sectionId: string,
  subSectionId: string,
  subSectionBlockId: string
) => {
  const videoCourse = await models.VideoCourses.findById(id).lean().exec();
  const module = videoCourse?.modules[0];

  module["sections"] = module?.sections?.map((section) => {
    if (section._id.toString() === sectionId) {
      section["subSections"] = section?.subSections?.map((subSection) => {
        if (subSection._id.toString() === subSectionId) {
          return {
            ...subSection,
            subSectionBlocks: subSection?.subSectionBlocks?.filter(
              (block) => block._id.toString() !== subSectionBlockId
            ),
          };
        }
        return subSection;
      });
    }
    return section;
  });

  videoCourse["modules"] = [module];

  const updatedVideoCourse = await models.VideoCourses.findByIdAndUpdate(
    id,
    videoCourse,
    { new: true }
  );

  return { videoCourse: updatedVideoCourse };
};

// subCectionBlock notes,questions,video
export const updateVideoCourseModuleSubSectionBlockNote = async (
  id: string,
  sectionId: string,
  subSectionId: string,
  subSectionBlockId: string,
  noteId: string
) => {
  const videoCourseId = id;
  const videoCourse = await models.VideoCourses.findById(videoCourseId)
    .lean()
    .exec();
  const module = videoCourse?.modules[0];
  module["sections"] = module?.sections?.map((section) => {
    if (section._id.toString() === sectionId) {
      return {
        ...section,
        subSections: section.subSections.map((subSection) => {
          if (subSection._id.toString() === subSectionId) {
            return {
              ...subSection,
              subSectionBlocks: subSection.subSectionBlocks.map((block) => {
                if (block._id.toString() === subSectionBlockId) {
                  console.log("from services", { ...block, note: noteId });
                  return { ...block, note: noteId };
                }
                return block;
              }),
            };
          }
          return subSection;
        }),
      };
    }
    return section;
  });
  videoCourse["modules"] = [module];

  const updatedVideoCourse = await models.VideoCourses.findByIdAndUpdate(
    videoCourseId,
    videoCourse
  );

  return updatedVideoCourse;
};

export const deleteVideoCourseModuleSubSectionBlockNote = async (
  id: string,
  sectionId: string,
  subSectionId: string,
  subSectionBlockId: string
) => {
  const videoCourseId = id;
  const videoCourse = await models.VideoCourses.findById(videoCourseId)
    .lean()
    .exec();
  const module = videoCourse?.modules[0];
  module["sections"] = module?.sections?.map((section) => {
    if (section._id.toString() === sectionId) {
      return {
        ...section,
        subSections: section.subSections.map((subSection) => {
          if (subSection._id.toString() === subSectionId) {
            return {
              ...subSection,
              subSectionBlocks: subSection.subSectionBlocks.map((block) => {
                if (block._id.toString() === subSectionBlockId) {
                  return { ...block, note: null };
                }
                return block;
              }),
            };
          }
          return subSection;
        }),
      };
    }
    return section;
  });
  videoCourse["modules"] = [module];

  const updatedVideoCourse = await models.VideoCourses.findByIdAndUpdate(
    videoCourseId,
    videoCourse
  );

  return updatedVideoCourse;
};

export const updateVideoCourseModuleSubSectionBlockVideo = async (
  id: string,
  sectionId: string,
  subSectionId: string,
  subSectionBlockId: string,
  videoId: string
) => {
  const videoCourseId = id;
  const videoCourse = await models.VideoCourses.findById(videoCourseId)
    .lean()
    .exec();
  const module = videoCourse?.modules[0];
  module["sections"] = module?.sections?.map((section) => {
    if (section._id.toString() === sectionId) {
      return {
        ...section,
        subSections: section.subSections.map((subSection) => {
          if (subSection._id.toString() === subSectionId) {
            return {
              ...subSection,
              subSectionBlocks: subSection.subSectionBlocks.map((block) => {
                if (block._id.toString() === subSectionBlockId) {
                  return { ...block, video: videoId };
                }
                return block;
              }),
            };
          }
          return subSection;
        }),
      };
    }
    return section;
  });
  videoCourse["modules"] = [module];

  const updatedVideoCourse = await models.VideoCourses.findByIdAndUpdate(
    videoCourseId,
    videoCourse
  );

  return updatedVideoCourse;
};

export const deleteVideoCourseModuleSubSectionBlockVideo = async (
  id: string,
  sectionId: string,
  subSectionId: string,
  subSectionBlockId: string
) => {
  const videoCourseId = id;
  const videoCourse = await models.VideoCourses.findById(videoCourseId)
    .lean()
    .exec();
  const module = videoCourse?.modules[0];
  module["sections"] = module?.sections?.map((section) => {
    if (section._id.toString() === sectionId) {
      return {
        ...section,
        subSections: section.subSections.map((subSection) => {
          if (subSection._id.toString() === subSectionId) {
            return {
              ...subSection,
              subSectionBlocks: subSection.subSectionBlocks.map((block) => {
                if (block._id.toString() === subSectionBlockId) {
                  return { ...block, video: null };
                }
                return block;
              }),
            };
          }
          return subSection;
        }),
      };
    }
    return section;
  });
  videoCourse["modules"] = [module];

  const updatedVideoCourse = await models.VideoCourses.findByIdAndUpdate(
    videoCourseId,
    videoCourse
  );

  return updatedVideoCourse;
};

export const updateVideoCourseModuleSubSectionBlockQuestions = async (
  id: string,
  sectionId: string,
  subSectionId: string,
  subSectionBlockId: string,
  questions: string[]
) => {
  const videoCourseId = id;
  const videoCourse = await models.VideoCourses.findById(videoCourseId)
    .lean()
    .exec();
  const module = videoCourse?.modules[0];
  module["sections"] = module?.sections?.map((section) => {
    if (section._id.toString() === sectionId) {
      return {
        ...section,
        subSections: section.subSections.map((subSection) => {
          if (subSection._id.toString() === subSectionId) {
            return {
              ...subSection,
              subSectionBlocks: subSection.subSectionBlocks.map((block) => {
                if (block._id.toString() === subSectionBlockId) {
                  return { ...block, questions };
                }
                return block;
              }),
            };
          }
          return subSection;
        }),
      };
    }
    return section;
  });
  videoCourse["modules"] = [module];

  const updatedVideoCourse = await models.VideoCourses.findByIdAndUpdate(
    videoCourseId,
    videoCourse
  );

  return updatedVideoCourse;
};

export const deleteVideoCourseModuleSubSectionBlockQuestion = async (
  id: string,
  sectionId: string,
  subSectionId: string,
  subSectionBlockId: string,
  questionId: string
) => {
  const videoCourseId = id;
  const videoCourse = await models.VideoCourses.findById(videoCourseId)
    .lean()
    .exec();
  const module = videoCourse?.modules[0];
  module["sections"] = module?.sections?.map((section) => {
    if (section._id.toString() === sectionId) {
      return {
        ...section,
        subSections: section.subSections.map((subSection) => {
          if (subSection._id.toString() === subSectionId) {
            return {
              ...subSection,
              subSectionBlocks: subSection.subSectionBlocks.map((block) => {
                if (block._id.toString() === subSectionBlockId) {
                  return {
                    ...block,
                    questions: block.questions.filter(
                      (question) => question.toString() !== questionId
                    ),
                  };
                }
                return block;
              }),
            };
          }
          return subSection;
        }),
      };
    }
    return section;
  });
  videoCourse["modules"] = [module];

  const updatedVideoCourse = await models.VideoCourses.findByIdAndUpdate(
    videoCourseId,
    videoCourse
  );

  return updatedVideoCourse;
};

// subSectionBlockEnd

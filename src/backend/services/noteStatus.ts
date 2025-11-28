import { models } from "../mongo/models";

// Get notes status by user
export const getNotesStatusByUser = async (userId: string) => {
  const notesStatus = await models.NoteStatus.find({ userId }).lean().exec();
  return notesStatus;
};

// Add or update notes status
export const addOrUpdateNotesStatus = async (
  userId: string,
  noteId: string,
  noteName: string,
  url: string,
  contentId: string,
  completed: boolean
) => {
  if (!userId || !noteId || !contentId || !noteName || !url) {
    throw new Error(
      "userId, noteId, noteName, url, and contentId are required"
    );
  }

  // Find the note status for the user and note
  const existingNotesStatus = await models.NoteStatus.findOne({
    userId,
    noteId,
    noteName,
  });

  if (existingNotesStatus) {
    // Filter out any existing entries for the same contentId
    existingNotesStatus.content = existingNotesStatus.content.filter(
      (content) => content.contentId.toString() !== contentId
    );

    // Add the new or updated content entry
    existingNotesStatus.content.push({ contentId, completed });

    existingNotesStatus.url = url;

    await existingNotesStatus.save();
    return existingNotesStatus;
  }

  // If the note status does not exist, create a new entry
  const note = await models.Notes.findById(noteId);
  const notesStatus = await models.NoteStatus.create({
    userId,
    noteId,
    noteName,
    url,
    content: note?.content.map((content) =>
      content._id.toString() === contentId
        ? { contentId: content._id, completed: completed }
        : { contentId: content._id, completed: false }
    ),
  });

  return notesStatus;
};

import { NotePayload } from "@/backend/types";
import { models } from "@/backend/mongo/models";

const startDisplayId = 1100;

// Function to recalculate displayIds in sequential order
const updateDisplayIds = async () => {
  try {
    // Retrieve all questions sorted by creation order
    const notes = await models.Notes.find({}).sort({ createdAt: 1 });

    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      const newDisplayId = `SN-${startDisplayId + i}`;

      // Only update if the displayId has changed
      if (note.displayId !== newDisplayId) {
        await models.Notes.updateOne(
          { _id: note._id },
          { $set: { displayId: newDisplayId } }
        );
      }
    }

    console.log("Display IDs updated successfully!");
  } catch (error) {
    console.error("Error updating display IDs:", error);
  }
};

// Retrieve a single note
export const getNote = (id: string) =>
  models.Notes.findById(id).populate("categories");

// Retrieve all notes
export const getNotes = () => models.Notes.find().populate("categories");

// Create a new note
export const createNote = async (data: NotePayload) => {
  try {
    const newNote = await models.Notes.create(data);
    // Recalculate displayIds after adding a new note
    await updateDisplayIds();
    return newNote;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

// Update an existing note
export const updateNote = async (id: string, data: NotePayload) => {
  try {
    const updatedNote = await models.Notes.findByIdAndUpdate(id, data, {
      new: true,
    });
    // Ensure displayIds remain sequential (optional for updates)
    await updateDisplayIds();
    return updatedNote;
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  }
};

// Delete a note
export const deleteNote = async (id: string) => {
  try {
    const deletedNote = await models.Notes.findByIdAndDelete(id);
    // Recalculate displayIds after deleting a note
    await updateDisplayIds();
    return deletedNote;
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
};

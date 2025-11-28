export type NoteContent = {
  contentId: string; // Unique ID for the content in the note
  completed: boolean; // Indicates if the content was completed
};

export type NoteStatus = {
  _id: string;
  userId: string;
  noteId: string; // Reference to the note
  noteName: string;
  content: NoteContent[]; // Array of content objects with completion status
};

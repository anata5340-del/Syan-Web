import { Category, Note } from "@/backend/types";
import axios from "axios";
import { useState, useEffect } from "react";

// const basePath = process.env.NEXT_PUBLIC_BASE_URL ?? "";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);


  const getNotes = () => {
    axios
      .get("/api/notes")
      .then(({ data }) => {
        const { notes } = data;
        setNotes(notes);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteNote = (id: string) => {
    axios
      .delete(`/api/notes/${id}`)
      .then(getNotes)
      .catch((error) => {
        console.error(error);
      });
  };



  const handleDeleteNote = (id: string) => deleteNote(id);

  useEffect(() =>{
    getNotes();
  }, []);

  return { notes, handleDeleteNote, refetchNotes: getNotes };
};

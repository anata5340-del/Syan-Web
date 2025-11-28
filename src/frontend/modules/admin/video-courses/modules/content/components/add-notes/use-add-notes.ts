import axios from "axios";
import { set } from "lodash";
import { useEffect, useState } from "react";

type useAddNotesProps = {
  selectedNote: null | { _id: string };
  refetch: () => void;
  parentIds: {
    videoCourseId: string;
    moduleId: string;
    sectionId: string;
    subSectionId: string;
    subSectionBlockId: string;
  };
};

export const useAddNotes = ({
  selectedNote,
  refetch,
  parentIds,
}: useAddNotesProps) => {
  const {
    videoCourseId,
    moduleId,
    sectionId,
    subSectionId,
    subSectionBlockId,
  } = parentIds;
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(
    selectedNote ? selectedNote?._id : null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleOk = async () => {
    const data = { noteId: selectedNoteId };
    try {
      const result = await axios.put(
        `/api/videoCourses/${videoCourseId}/modules/${moduleId}/section/${sectionId}/subSection/${subSectionId}/subSectionBlock/${subSectionBlockId}/note`,
        data
      );
      refetch();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedNoteId(null);
    setNotes((prev) => prev.map((note) => ({ ...note, isChecked: false })));
  };

  const getNotes = async () => {
    try {
      const {
        data: { notes: notesList },
      } = await axios.get("/api/notes");
      const filteredNotes = notesList.map((note: { _id: string }) => {
        const noteId = selectedNote ? selectedNote?._id : null;
        const isNoteSelected = note._id === noteId;
        return {
          ...note,
          isChecked: isNoteSelected,
        };
      });
      setNotes(filteredNotes);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isModalOpen) getNotes();
  }, [isModalOpen]);

  useEffect(
    () => setSelectedNoteId(selectedNote ? selectedNote?._id : null),
    [selectedNote]
  );

  const handleNoteSelect = (noteId: string) => {
    const updatedNotes = notes?.map((note: { _id: string }) => {
      const isNoteSelected = note._id === noteId;
      return {
        ...note,
        isChecked: isNoteSelected,
      };
    });
    setNotes(updatedNotes);
    setSelectedNoteId(noteId);
  };

  return {
    notes,
    handleNoteSelect,
    isModalOpen,
    toggleModal,
    handleCancel,
    handleOk,
  };
};

import { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Category } from "@/backend/types";
import toast from "react-hot-toast";

const basePath = process.env.NEXT_PUBLIC_BASE_URL ?? "";

// type FormData = {
//   name: string;
//   title: string;
//   author: string;
//   categories: Category[];
//   content: { name: string; content: string }[];
//   color: string;
//   image: string;
// };

// const initialFormData = {
//   name: "",
//   title: "",
//   author: "",
//   categories: [],
//   content: [],
//   color: "red",
//   image: `${uuidv4()}`,
// };

type UseAddNotesProps = {
  refetchNotes: () => void;
};

export const useAddNotes = ({ refetchNotes }: UseAddNotesProps) => {
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    author: "",
    categories: [],
    content: [],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [updateContentIndex, setUpdateContentIndex] = useState(null);

  useEffect(() => {
    getCategories();
  }, []);

  const createNotes = () => {
    const data = { note: formData };
    axios
      .post(`/api/notes`, data)
      .then(() => {
        setFormData({
          name: "",
          title: "",
          author: "",
          categories: [],
          content: [],
        });
        handleToggleNotesModal();
        refetchNotes();
        toast.success("Note added successfully!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Note addittion failed!");
      });
  };

  const getCategories = () => {
    axios
      .get(`/api/categories`)
      .then(({ data }: { data: { categories: Category[] } }) => {
        const categoriesList = data?.categories?.map((category) => ({
          ...category,
          value: category?._id,
          label: category?.name,
        }));

        // Ensure no duplicate categories are added
        setCategories((prevCategories) => {
          const existingIds = new Set(prevCategories.map((cat) => cat.value));
          const newCategories = categoriesList.filter(
            (category) => !existingIds.has(category.value)
          );
          return [...prevCategories, ...newCategories];
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleFormData = (key: string, value: Category) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleToggleNotesModal = () => {
    setIsNotesModalOpen(!isNotesModalOpen);
  };

  const handleSaveNotes = () => {
    createNotes();
  };

  const handleUpdateNotes = (noteId: any) => {
    const data = { id: noteId, note: formData };
    axios
      .put(`/api/notes`, data)
      .then(() => {
        handleToggleNotesModal();
        refetchNotes();
        toast.success("Note updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Note updation failed!");
      });
  };

  const handleAddContent = () => {
    const newContent = { name: "", content: "" };
    setFormData({ ...formData, content: [...formData.content, newContent] });
  };

  const handleUpdateContent = (index: number, key: string, value: string) => {
    const newContent = formData.content.map((content, i) =>
      i === index ? { ...content, [key]: value } : content
    );
    setFormData({ ...formData, content: newContent });
  };

  const handleDeleteContent = (index: number) => {
    const newContent = formData.content.filter((_, i) => i !== index);
    setFormData({ ...formData, content: newContent });
  };

  const handleToggleContentModal = () => {
    setIsContentModalOpen(!isContentModalOpen);
  };

  return {
    categories,
    formData,
    handleFormData,
    isNotesModalOpen,
    setFormData,
    handleToggleNotesModal,
    handleSaveNotes,
    handleUpdateNotes,
    handleAddContent,
    handleUpdateContent,
    handleDeleteContent,
    isContentModalOpen,
    handleToggleContentModal,
    updateContentIndex,
    setUpdateContentIndex,
  };
};

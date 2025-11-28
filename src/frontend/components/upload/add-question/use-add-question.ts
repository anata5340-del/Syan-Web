import { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const basePath = process.env.NEXT_PUBLIC_BASE_URL ?? "";

type FormData = {
  name: string;
  statement: string;
  categories: [];
  options: [];
  difficultyLevel: string;
  explanation: string;
  topic: string;
  reference: string;
};

const initialFormData = {
  name: "",
  statement: "",
  categories: [],
  options: [],
  difficultyLevel: "",
  topic: "",
  explanation: "",
  reference: "",
};

type UseAddQuestionProps = {
  refetch: () => void;
};

export const useAddQuestion = ({ refetch }: UseAddQuestionProps) => {
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [correctOption, setCorrectOption] = useState("");
  const [categories, setCategories] = useState([]);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [updateContentIndex, setUpdateContentIndex] = useState(null);

  useEffect(() => {
    getCategories();
  }, []);

  const createQuestion = () => {
    const data = { question: formData };
    axios
      .post(`/api/questions`, data)
      .then(() => {
        setFormData(initialFormData);
        handleToggleQuestionModal();
        refetch();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getCategories = () => {
    axios
      .get(`/api/categories`)
      .then(({ data }) => {
        const categoriesList = data?.categories?.map(
          (category: { _id: string; name: string }) => ({
            ...category,
            value: category?._id,
            label: category?.name,
          })
        );
        setCategories(categoriesList);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleFormData = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleToggleQuestionModal = () => {
    setIsQuestionModalOpen(!isQuestionModalOpen);
  };

  const handleSaveQuestion = () => {
    createQuestion();
  };

  const handleAddOption = () => {
    const newOption = { name: "", isCorrect: false };
    setFormData({ ...formData, options: [...formData.options, newOption] });
  };

  const handleUpdateOption = (
    index: number,
    key: string,
    value: string | boolean
  ) => {
    const updatedOptions = formData.options.map((option, i) =>
      i === index
        ? { ...option, [key]: value }
        : { ...option, isCorrect: false }
    );
    setFormData({ ...formData, options: updatedOptions });
  };

  const handleDeleteOption = (index: number) => {
    const newOption = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOption });
  };

  const handleToggleContentModal = () => {
    setIsContentModalOpen(!isContentModalOpen);
  };

  const handleSetCorrectOption = (value) => {
    setCorrectOption(value);
    handleUpdateOption(value, "isCorrect", true);
  };

  const correctOptions = formData.options.map((option, index) => ({
    ...option,
    label: option.name,
    value: index,
  }));

  return {
    categories,
    formData,
    handleFormData,
    isQuestionModalOpen,
    handleToggleQuestionModal,
    handleSaveQuestion,
    handleAddOption,
    handleUpdateOption,
    handleDeleteOption,
    isContentModalOpen,
    handleToggleContentModal,
    updateContentIndex,
    setUpdateContentIndex,
    correctOptions,
    correctOption,
    handleSetCorrectOption,
  };
};

import { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

const basePath = process.env.NEXT_PUBLIC_BASE_URL ?? "";

type FormData = {
  name: string;
  statement: string;
  categories: [];
  options: [];
  difficultyLevel: string;
  topic: string;
  explanation: string;
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
  existingQuestion?: FormData; // Optional prop for editing an existing question
};

export const useAddQuestion = ({
  refetch,
  existingQuestion,
}: UseAddQuestionProps) => {
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  // Set form data to existing question if available, else use initial form data
  const [formData, setFormData] = useState<FormData>(
    existingQuestion || initialFormData
  );
  const [correctOption, setCorrectOption] = useState("");
  const [categories, setCategories] = useState([]);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [updateContentIndex, setUpdateContentIndex] = useState(null);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (existingQuestion) {
      setFormData(existingQuestion);
      setCorrectOption(
        existingQuestion.options.find((option) => option.isCorrect)?.name || ""
      );
    }
  }, [existingQuestion]);

  const createQuestion = async (reset: boolean) => {
    try {
      const { data } = await axios.post(`/api/questions`, {
        question: formData,
      });
      if (reset) {
        setFormData(initialFormData);
      }
      handleToggleQuestionModal();
      refetch();
      toast.success("Question Created Successfully!");
      return data.question; // Return the created question
    } catch (error) {
      console.error(error);
      toast.error("Question wasn't created!");
      throw error; // Rethrow error for caller to handle
    }
  };

  const updateQuestion = async (questionId: string, reset = true) => {
    try {
      const { data } = await axios.put(`/api/questions`, {
        id: questionId,
        question: formData,
      });
      if (reset) {
        setFormData(initialFormData);
      }
      handleToggleQuestionModal();
      refetch();
      toast.success("Question Updated Successfully!");
      return data.question; // Return the updated question
    } catch (error) {
      console.error(error);
      toast.error("Question wasn't updated!");
      throw error; // Rethrow error for caller to handle
    }
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

  const handleSaveQuestion = async (reset = true) => {
    if (existingQuestion) {
      return updateQuestion(existingQuestion._id, reset); // If editing, update the question
    } else {
      return createQuestion(reset); // Otherwise, create a new question
    }
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

  const handleSetCorrectOption = (selectedIndex) => {
    const updatedOptions = formData.options.map((option, index) => ({
      ...option,
      isCorrect: index === selectedIndex,
    }));
    setFormData({ ...formData, options: updatedOptions });
    setCorrectOption(formData.options[selectedIndex]?.name || "");
  };

  const correctOptions = formData.options.map((option, index) => ({
    ...option,
    label: option.name,
    value: index,
  }));

  return {
    categories,
    formData,
    setFormData,
    handleFormData,
    isQuestionModalOpen,
    handleToggleQuestionModal,
    handleSaveQuestion,
    handleUpdateQuestion: updateQuestion,
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

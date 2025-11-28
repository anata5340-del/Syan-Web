import axios from "axios";
import { useState, useEffect } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_URL ?? "";

export const useQuiz = () => {
  const [addData, setAddData] = useState(null);
  const [quizes, setQuizes] = useState([]);
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false);

  const handleAddQuestions = (quizId: string) => {
    // const quiz = quizes.find((quiz) => quiz._id === quizId);
    // setAddData({ quiz, mode: "add" });
    // toggleQuestionsModal();
  };

  const handleCancelAddQuestions = () => {
    setAddData(null);
    toggleQuestionsModal();
  };

  const toggleQuestionsModal = () => {
    setIsQuestionsModalOpen(!isQuestionsModalOpen);
  };

  const getQuizes = () => {
    axios
      .get(`/api/quizes`)
      .then(({ data }) => {
        const { quizes } = data;
        setQuizes(quizes);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteQuiz = (id: string) => {
    axios
      .delete(`/api/quizes/${id}`)
      .then(() => {
        getQuizes();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeleteQuiz = (id: string) => deleteQuiz(id);

  useEffect(() => getQuizes(), []);

  return {
    quizes,
    handleDeleteQuiz,
    refetchQuizes: getQuizes,
    handleAddQuestions,
    isQuestionsModalOpen,
    handleCancelAddQuestions,
    addQuestionsData: addData,
  };
};

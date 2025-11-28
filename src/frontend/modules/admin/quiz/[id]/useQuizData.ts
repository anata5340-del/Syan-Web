import { Paper, Quiz } from "@/backend/types";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useQuizData = () => {
  const router = useRouter();
  const { id } = router.query;
  const quizId = id as string;
  const [quizData, setQuizData] = useState<Quiz | null>(null);
  const [quizPaperData, setQuizPaperData] = useState<Paper | null>(null);
  const [isAddLibraryQuestionsModalOpen, setisAddLibraryQuestionsModalOpen] =
    useState(false);

  const toggleAddLibraryQuestionsModal = () => {
    if (isAddLibraryQuestionsModalOpen) {
      setQuizPaperData(null);
    }
    setisAddLibraryQuestionsModalOpen(!isAddLibraryQuestionsModalOpen);
  };

  const getQuizData = async () => {
    try {
      const { data } = await axios.get(`/api/quizes/${quizId}`);
      const { quiz } = data;
      setQuizData(quiz);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePaperDelete = async (paperId: string) => {
    try {
      await axios.delete(`/api/quizes/${quizId}/library/${paperId}`);
      getQuizData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLibraryAddQuestions = (paperData: Paper) => {
    setQuizPaperData(paperData);
    setisAddLibraryQuestionsModalOpen(true);
  };

  useEffect(() => {
    if (quizId) {
      getQuizData();
    }
  }, [quizId]);

  return {
    quizId,
    quizData,
    quizCustomQuestions: quizData?.customQuestions,
    refetchQuiz: getQuizData,
    quizPaperData,
    setQuizPaperData,
    handlePaperDelete,
    isAddLibraryQuestionsModalOpen,
    toggleAddLibraryQuestionsModal,
    handleLibraryAddQuestions,
  };
};

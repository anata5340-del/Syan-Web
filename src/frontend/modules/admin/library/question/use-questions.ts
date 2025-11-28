import { Question } from "@/backend/types";
import axios from "axios";
import { useState, useEffect } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_URL ?? "";

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  const getQuestions = () => {
    axios
      .get(`/api/questions`)
      .then(({ data }) => {
        const { questions } = data;
        setQuestions(questions);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteQuestion = (id: string) => {
    axios
      .delete(`/api/questions/${id}`)
      .then(getQuestions)
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeleteQuestion = (id: string) => deleteQuestion(id);

  useEffect(() => getQuestions(), []);

  return { questions, handleDeleteQuestion, refetchQuestions: getQuestions };
};

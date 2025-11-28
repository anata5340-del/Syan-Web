import { CustomQuestion, Quiz } from "@/backend/types";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Topic = {
  name: string;
  _id?: string;
};

type SubTopic = {
  name: string;
  questions: string[];
  _id?: string;
};

type useAddYourOwnDataProps = {
  refetch: () => void;
  quizId: string;
  quizData: CustomQuestion[] | undefined;
};

export const useAddYourOwnData = ({
  quizId,
  quizData,
  refetch,
}: useAddYourOwnDataProps) => {
  const [localQuizData, setLocalQuizData] = useState<
    CustomQuestion[] | undefined
  >(quizData ?? []); // Create a local state
  const [data, setData] = useState<Topic | SubTopic | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(
    null
  );
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false);
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);

  const getQuestions = async () => {
    try {
      const { data: questionsData } = await axios.get("/api/questions");
      setQuestions(questionsData.questions || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    quizData && setLocalQuizData(quizData); // Sync local state with the passed quizData
    getQuestions();
  }, [quizData]);

  // Directly update a topic
  const handleTopicChange = async (updatedTopicName: unknown) => {
    const updatedQuizData = [...localQuizData];
    updatedQuizData[selectedQuizIndex] = {
      ...updatedQuizData[selectedQuizIndex],
      topic: {
        ...updatedQuizData[selectedQuizIndex].topic,
        name: updatedTopicName,
      },
    };

    await updateCustomQuiz(updatedQuizData[selectedQuizIndex]);
  };

  // Directly remove a subtopic
  const handleRemoveSubTopic = async (
    quizIndex: number,
    subTopicIndex: number
  ) => {
    const updatedQuizData = [...localQuizData];
    const quiz = updatedQuizData[quizIndex];

    // Check if there's only one subtopic
    if (quiz.subTopics.length === 1) {
      toast.error("At least one subtopic is required.");
      return;
    }

    // Remove the subtopic
    updatedQuizData[quizIndex].subTopics = quiz.subTopics.filter(
      (_, index) => index !== subTopicIndex
    );

    await updateCustomQuiz(updatedQuizData[quizIndex]);
  };

  const handleAddSubTopic = async (topicIndex: number) => {
    const updatedQuizData = localQuizData.map((topic, tIndex) =>
      tIndex === topicIndex
        ? {
            ...topic,
            subTopics: [
              ...topic.subTopics,
              { name: "New Subtopic", questions: [] },
            ],
          }
        : topic
    );
    setLocalQuizData(updatedQuizData);
    refetch();
    await updateCustomQuiz(updatedQuizData[topicIndex]);
  };

  const handleAddQuestions = (target: SubTopic, subTopicIndex?: number) => {
    setData({ ...target, subTopicIndex });
    setIsQuestionsModalOpen(true);
  };

  const handleUpdateCustomQuestions = async (updatedData: any) => {
    if (
      selectedQuizIndex === null ||
      selectedQuizIndex < 0 ||
      selectedQuizIndex >= quizData.length
    ) {
      console.error("Invalid selectedQuizIndex:", selectedQuizIndex);
      toast.error("Invalid topic selected.");
      return;
    }

    const updatedQuizData = localQuizData;

    const subTopics = updatedQuizData[selectedQuizIndex]?.subTopics;
    if (
      !subTopics ||
      updatedData.subTopicIndex < 0 ||
      updatedData.subTopicIndex >= subTopics.length
    ) {
      console.error("Invalid subTopicIndex:", updatedData.subTopicIndex);
      toast.error("Invalid subtopic selected.");
      return;
    }

    // Update subtopic
    subTopics[updatedData.subTopicIndex] = {
      ...subTopics[updatedData.subTopicIndex],
      ...updatedData,
    };

    updatedQuizData[selectedQuizIndex].subTopics = subTopics;

    await updateCustomQuiz(updatedQuizData[selectedQuizIndex]);

    refetch();
    setIsQuestionsModalOpen(false);
  };

  const updateCustomQuiz = async (quiz: Quiz) => {
    try {
      if (quizId) {
        const response = await axios.patch(
          `/api/quizes/${quizId}/customLibrary`,
          quiz
        );
        toast.success("Custom Library updated successfully");
        refetch(); // Fetch the latest data after update
      }
    } catch (e) {
      toast.error("Custom Library update failed");
    }
  };

  return {
    data,
    selectedQuiz: localQuizData ? localQuizData[selectedQuizIndex!] : {},
    setSelectedQuizIndex,
    questions,
    handleTopicChange,
    handleAddQuestions,
    handleAddSubTopic,
    handleRemoveSubTopic,
    isQuestionsModalOpen,
    isTitleModalOpen,
    setIsQuestionsModalOpen,
    setIsTitleModalOpen,
    handleUpdateCustomQuestions,
  };
};

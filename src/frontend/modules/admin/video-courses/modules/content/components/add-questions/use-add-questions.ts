import axios from "axios";
import { set } from "lodash";
import { useEffect, useState } from "react";

type UseAddQuestionsProps = {
  selectedQuestions: any[];
  refetch: () => void;
  parentIds: {
    videoCourseId: string;
    moduleId: string;
    sectionId: string;
    subSectionId: string;
    subSectionBlockId: string;
  };
};

export const useAddQuestions = ({
  selectedQuestions,
  refetch,
  parentIds,
}: UseAddQuestionsProps) => {
  const {
    videoCourseId,
    moduleId,
    sectionId,
    subSectionId,
    subSectionBlockId,
  } = parentIds;
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState(
    selectedQuestions?.map((question) => question?._id)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleOk = async () => {
    const data = { questionIds: selectedQuestionIds };
    try {
      await axios.put(
        `/api/videoCourses/${videoCourseId}/modules/${moduleId}/section/${sectionId}/subSection/${subSectionId}/subSectionBlock/${subSectionBlockId}/questions`,
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
    setSelectedQuestionIds([]);
    setQuestions((prev) =>
      prev.map((question) => ({ ...question, isChecked: false }))
    );
  };

  const getQuestions = async () => {
    try {
      const {
        data: { questions: questionsList },
      } = await axios.get("/api/questions");
      const filteredQuestions = questionsList.map(
        (question: { _id: string }) => {
          const isQuestionSelected = selectedQuestions
            .map((q) => q?._id)
            .includes(question?._id);
          return {
            ...question,
            isChecked: isQuestionSelected,
          };
        }
      );
      setQuestions(filteredQuestions);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isModalOpen) getQuestions();
  }, [isModalOpen]);

  useEffect(
    () =>
      setSelectedQuestionIds(
        selectedQuestions?.map((question) => question?._id)
      ),
    [selectedQuestions]
  );

  const handleQuestionSelect = (qId: string, isChecked: boolean) => {
    const updatedQuestions = questions.map((q: any) => {
      if (q._id !== qId) {
        return q;
      }
      return {
        ...q,
        isChecked,
      };
    });
    setQuestions(updatedQuestions);
    if (!isChecked) {
      const updatedQuestionIds = selectedQuestionIds.filter((id) => id !== qId);
      setSelectedQuestionIds(updatedQuestionIds);
      return;
    }
    setSelectedQuestionIds([...selectedQuestionIds, qId]);
  };

  return {
    questions,
    handleQuestionSelect,
    isModalOpen,
    toggleModal,
    handleCancel,
    handleOk,
  };
};

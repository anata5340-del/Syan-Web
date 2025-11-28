import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { useAddYourOwnData } from "./useAddYourOwnData";
import { Button, Input } from "antd";
import AddCustomQuizQuestions from "@/frontend/components/upload/addCustomQuizQuestions/AddCustomQuizQuestions";
import AddCustomQuizTitle from "@/frontend/components/upload/addCustomQuizQuestions/AddCustomQuizTitle";
import { normalize } from "path";
import { CustomQuestion } from "@/backend/types";
import { useState } from "react";

type AddYourOwnDataProps = {
  refetch: () => void;
  quizId: string;
  quizData: CustomQuestion[] | undefined;
};

const AddYourOwnData = ({ quizId, quizData, refetch }: AddYourOwnDataProps) => {
  const {
    data,
    selectedQuiz,
    questions,
    handleAddSubTopic,
    handleTopicChange,
    handleAddQuestions,
    handleRemoveSubTopic,
    isQuestionsModalOpen,
    isTitleModalOpen,
    setIsQuestionsModalOpen,
    setIsTitleModalOpen,
    setSelectedQuizIndex,
    handleUpdateCustomQuestions,
  } = useAddYourOwnData({ quizId, quizData, refetch });

  // const [topicName, setTopicName] = useState<unknown>("");
  const handleTopicNameChange = (key: string = "name", data: unknown) => {
    // setTopicName(data);
    handleTopicChange(data);
  };

  return (
    <>
      <AddCustomQuizQuestions
        data={data}
        questions={questions}
        isModalOpen={isQuestionsModalOpen}
        setIsModalOpen={setIsQuestionsModalOpen}
        handleSave={handleUpdateCustomQuestions}
        isEditMode={true}
      />

      <AddCustomQuizTitle
        data={selectedQuiz}
        isModalOpen={isTitleModalOpen}
        setIsModalOpen={setIsTitleModalOpen}
        handleNameChange={handleTopicNameChange}
        handleSave={() => {}}
      />

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
        {quizData.map((topic, topicIndex) => (
          <div
            key={topic._id}
            className="flex flex-col gap-4 my-6 p-4 rounded-lg shadow-lg bg-[#F6F6F6]"
          >
            <div className="flex gap-4 items-center">
              <Input value={topic.topic.name} readOnly />
              <img
                style={{ cursor: "pointer" }}
                src="/assets/img/icon12.png"
                className="edit"
                onClick={() => {
                  setIsTitleModalOpen(true);
                  setSelectedQuizIndex(topicIndex);
                }}
              />
            </div>
            {topic.subTopics.map((subTopic, subTopicIndex) => (
              <div key={subTopic._id} className="flex gap-4 items-center">
                <Input disabled value={subTopic.name} />
                <CloseOutlined
                  onClick={() => {
                    setSelectedQuizIndex(topicIndex);
                    handleRemoveSubTopic(topicIndex, subTopicIndex);
                  }}
                />
                <PlusOutlined
                  onClick={() => {
                    setSelectedQuizIndex(topicIndex);
                    handleAddQuestions(subTopic, subTopicIndex);
                  }}
                />
              </div>
            ))}
            <Button
              className="saveBtn mt-auto"
              type="primary"
              onClick={() => handleAddSubTopic(topicIndex)}
            >
              + Add Subtopic
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default AddYourOwnData;

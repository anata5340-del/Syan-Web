// "use client";
import { Button, Input, Modal, Form } from "antd";

import { CheckOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";
import AddCustomQuizQuestions from "../addCustomQuizQuestions/AddCustomQuizQuestions";
import AddCustomQuizTitle from "../addCustomQuizQuestions/AddCustomQuizTitle";
import axios from "axios";
import { toast } from "react-hot-toast";
import { sub } from "date-fns";

const addBtnStyle = {
  background: "#01B067",
  padding: "0px 15px",
  borderRadius: "5px",
};

const modalStyle = {
  top: 80,
  left: 300,
  backgroundColor: "#EDF7FF",
  paddingBottom: 0,
};

const initialTopicData = {
  name: "",
  questions: [],
};

const initialSubTopicsData = [
  {
    name: "",
    questions: [],
  },
];

const isNumber = (index?: number) => typeof index === "number" && !isNaN(index);

type AddCustomQuizLibraryProps = {
  type: string;
  toggleModal: () => void;
  isModalOpen: boolean;
  quizId?: string;
  quizData: any;
  refetch: () => void;
};

export const AddCustomQuizLibrary = ({
  type,
  toggleModal,
  isModalOpen,
  quizId,
  quizData,
  refetch,
}: AddCustomQuizLibraryProps) => {
  const [topic, setTopic] = useState(initialTopicData);
  const [data, setData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [subTopicsData, setSubTopicsData] = useState(initialSubTopicsData);
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false);
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);

  const getQuestions = () => {
    axios.get("/api/questions").then(({ data: questionsData }) => {
      const { questions: questionsList } = questionsData;
      setQuestions(questionsList);
    });
  };

  useEffect(() => {
    getQuestions();
    if (quizData?.topic) {
      setTopic(quizData.topic);
    }
    if (quizData?.subTopics) {
      setSubTopicsData(quizData.subTopics);
    }
  }, [quizData]);

  const handleAddQuestions = (
    data: any,
    index?: number,
    topic: boolean = false
  ) => {
    if (!isNumber(index)) {
      setData(data);
    }
    setData({ ...data, index });
    topic ? setIsTitleModalOpen(true) : setIsQuestionsModalOpen(true);
  };

  const handleCreateCustomLibrary = async () => {
    const payload = {
      topic,
      subTopics: subTopicsData,
    };

    try {
      if (quizId) {
        await axios.post(`/api/quizes/${quizId}/customLibrary`, payload);
        toast.success("Custom Library created successfully");
        setData(null);
        setTopic(initialTopicData);
        setSubTopicsData(initialSubTopicsData);
        refetch();
        toggleModal();
      }
    } catch (e) {
      toast.error("Custom Library creation failed");
    }
  };

  const handleSave = () => {
    handleCreateCustomLibrary();
  };

  const handleCancel = () => {
    setData(null);
    setTopic(initialTopicData);
    setSubTopicsData(initialSubTopicsData);
    toggleModal();
  };

  const handleChangeTopic = (key: string, value: unknown) => {
    setTopic((prev) => ({ ...prev, [key]: value }));
  };

  const handleChangeSubTopic = (key: string, value: unknown, index: number) => {
    const updatedSubTopicsData = subTopicsData?.map((el, elIndex) => {
      if (elIndex === index) {
        return { ...el, [key]: value };
      }
      return el;
    });
    setSubTopicsData(updatedSubTopicsData);
  };

  const addSubField = () => {
    setSubTopicsData((prev) => [...prev, initialSubTopicsData]);
  };

  const handleSaveCustomQuestions = (updatedFieldData: unknown) => {
    if (!isNumber(updatedFieldData?.index)) {
      setTopic({
        ...topic,
        questions: updatedFieldData?.questions,
      });
    } else {
      const updatedSubTopicsData = subTopicsData.map((subTopicData, index) => {
        if (index === updatedFieldData.index) {
          return {
            ...subTopicData,
            questions: updatedFieldData?.questions,
          };
        }
        return subTopicData;
      });
      setSubTopicsData(updatedSubTopicsData);
    }
    setData(null);
  };

  const handleRemoveSubTopic = (index: number) => {
    if (subTopicsData.length === 1) {
      toast.error("Atleast one subtopic is required");
      return;
    }
    const updatedSubTopicsData = subTopicsData.filter(
      (_, subTopicIndex) => subTopicIndex !== index
    );
    setSubTopicsData(updatedSubTopicsData);
  };

  return (
    <>
      <div className="flex-start">
        {type === "customLibrary" && (
          <Button
            // disabled={quizData}
            type="primary"
            onClick={toggleModal}
            style={addBtnStyle}
            icon={<PlusOutlined />}
          >
            Add Field
          </Button>
        )}
      </div>
      <AddCustomQuizQuestions
        isModalOpen={isQuestionsModalOpen}
        setIsModalOpen={setIsQuestionsModalOpen}
        handleSave={handleSaveCustomQuestions}
        data={data}
        questions={questions}
      />
      <AddCustomQuizTitle
        isModalOpen={isTitleModalOpen}
        setIsModalOpen={setIsTitleModalOpen}
        handleSave={handleSaveCustomQuestions}
        handleNameChange={handleChangeTopic}
        data={data}
      />
      <Modal
        footer={[
          <div className="flex gap-5 justify-end items-center py-7 px-9 bg-[#EDF7FF]">
            <Button
              className="saveBtn"
              key="submit"
              type="primary"
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              className="cancelBtn"
              key="cancel"
              type="primary"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>,
        ]}
        style={modalStyle}
        open={isModalOpen}
        closable={false}
        width={420}
        className="nameModal !left-0"
      >
        <div className="px-9 pt-6 bg-[#EDF7FF] flex flex-col gap-3">
          <div className="flex gap-4">
            <Input value={topic.name} readOnly />
            {/* <CloseOutlined />
            <CheckOutlined /> */}
            <img
              style={{ cursor: "pointer" }}
              src="/assets/img/icon12.png"
              className="edit"
              onClick={() => {
                setIsTitleModalOpen(true);
              }}
            />
            {/* <PlusOutlined
              onClick={() => handleAddQuestions(topic, undefined, true)}
            /> */}
          </div>
          <div>
            <Button className="saveBtn" type="primary" onClick={addSubField}>
              + Add Fields
            </Button>
          </div>

          {subTopicsData.map((subTopicData, index) => {
            return (
              <div key={index} className="flex gap-4">
                <Input
                  value={subTopicData.name}
                  onChange={(e) =>
                    handleChangeSubTopic("name", e.target.value, index)
                  }
                />
                <CloseOutlined onClick={() => handleRemoveSubTopic(index)} />
                <PlusOutlined
                  onClick={() => handleAddQuestions(subTopicData, index)}
                />
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
};

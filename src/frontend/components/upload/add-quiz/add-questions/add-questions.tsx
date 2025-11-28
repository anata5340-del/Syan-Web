"use client";

import { Button, Modal, Select, Input } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import AddQuizTable from "@/frontend/components/table/addQuizTable";
import axios from "axios";
import { set } from "lodash";

const addBtnStyle = {
  background: "#01B067",
  padding: "16px 35px",
  borderRadius: "unset",
};

const filterOption = (
  input: string,
  option?: { label: string; value: string }
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

type AddQuestionsProps = {
  refetch: () => void;
  isOpenModal: boolean;
  data: any;
  handleCancel: () => void;
};

export default function AddQuestions({
  refetch,
  isOpenModal,
  data,
  handleCancel,
}: AddQuestionsProps) {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  useEffect(() => {
    if (data?.quiz?.questions) {
      setSelectedQuestionIds(data.quiz.questions.map((q: any) => q._id));
    }
  }, [data]);

  const getQuestions = () => {
    axios
      .get("/api/questions")
      .then(({ data: questiosData }) => {
        const qIds = data.quiz.questions.map((q: any) => q._id);
        const questionsWithIsChecked = questiosData.questions.map((q: any) => {
          return {
            ...q,
            isChecked: qIds.includes(q._id),
          };
        });
        setQuestions(questionsWithIsChecked);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getQuestions();
  }, [data]);

  const handleOk = () => {
    const quizId = data?.quiz?._id ?? null;

    const payload = {
      id: quizId,
      quiz: {
        questions: selectedQuestionIds,
      },
    };

    const formData = new FormData();
    formData.append("id", payload.id);

    // Append the questions
    payload.quiz.questions.forEach((questionId, index) => {
      formData.append(`quiz[questions][${index}]`, questionId);
    });

    axios
      .put(`/api/quizes/${quizId}`, formData)
      .then((res) => {
        setSelectedQuestionIds([]);
        handleCancel();
        setQuestions([]);
        refetch();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSelectQuestions = (qId: string, isChecked: boolean) => {
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

  const handleCancelAddQuestions = () => {
    setSelectedQuestionIds([]);
    handleCancel();
    setQuestions([]);
  };

  return (
    <Modal
      className="addCourseModal !left-0"
      footer={[
        <div
          key={"course-modal-footer"}
          className="flex gap-5 justify-end py-5 px-5"
        >
          <Button
            className="saveBtn"
            key="submit"
            type="primary"
            onClick={handleOk}
          >
            Save
          </Button>
          <Button
            className="cancelBtn"
            key="cancel"
            type="primary"
            onClick={handleCancelAddQuestions}
          >
            Cancel
          </Button>
        </div>,
      ]}
      style={{ left: 250, paddingBottom: 0 }}
      open={isOpenModal}
      centered
      closable={false}
      width={900}
    >
      <div className="flex flex-col gap-5 justify-between items-center pb-10">
        <div className="bg-colorred flex justify-center border-0 rounded-t-md items-center h-16 w-full text-xs">
          <div className="text-white text-xl">Quiz</div>
        </div>
        <div className="flex gap-10 justify-between">
          <div className="flex">
            <p className="text-black text-2xl">List of all quiz</p>
          </div>
          <div className="flex gap-20">
            <Input
              className="userSearch"
              style={{ width: 250 }}
              prefix={<SearchOutlined style={{ fontSize: "20px" }} />}
              suffix={"Search"}
            />
            <Select
              className="quizCategory"
              showSearch
              placeholder="Category"
              optionFilterProp="children"
              filterOption={filterOption}
              options={[
                {
                  value: "gross anatomy",
                  label: "gross anatomy",
                },
                {
                  value: "gross anatomy",
                  label: "gross anatomy",
                },
                {
                  value: "gross anatomy",
                  label: "gross anatomy",
                },
              ]}
            />
          </div>
          <div>{/* <AddQuiz /> */}</div>
        </div>
        <div className="w-full">
          {/* Add Questions Table */}
          <AddQuizTable
            dataSource={questions}
            onSelect={handleSelectQuestions}
          />
        </div>
      </div>
    </Modal>
  );
}

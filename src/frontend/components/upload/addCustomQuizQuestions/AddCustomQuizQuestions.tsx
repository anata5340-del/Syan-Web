"use client";

import { Button, Modal, Input } from "antd";
import AddCoursesTable from "../../table/addCoursesTable";
import { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";

type AddCustomQuizQuestionsProps = {
  data: unknown;
  isModalOpen: boolean;
  questions: unknown[];
  isEditMode?: boolean;
  handleSave: (data: unknown) => void;
  setIsModalOpen: (value: boolean) => void;
};

const AddCustomQuizQuestions = ({
  data,
  handleSave,
  isModalOpen,
  setIsModalOpen,
  isEditMode = false,
  questions: questionsList,
}: AddCustomQuizQuestionsProps) => {
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState(questionsList);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState(questions ?? []);

  useEffect(() => {
    const filtered = questions.filter((pack) => {
      const matchesQuery = pack.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesQuery;
    });
    setFilteredQuestions(filtered);
  }, [searchQuery, questions]);

  useEffect(() => {
    if (data && isModalOpen) {
      const questionsWithIsChecked = questionsList?.map((q: any) => {
        return {
          ...q,
          isChecked: data?.questions?.includes(q._id),
        };
      });
      if (isEditMode) {
        setName(data?.name);
      }
      setQuestions(questionsWithIsChecked);
      setSelectedQuestionIds(data?.questions ?? []);
    } else {
      if (isEditMode) {
        setName("");
      }
      setQuestions([]);
      setSelectedQuestionIds([]);
    }
  }, [data]);

  const handleOk = () => {
    if (data) {
      const updatedData = { ...data, questions: selectedQuestionIds };
      if (isEditMode) {
        updatedData.name = name;
      }
      handleSave(updatedData);
      setQuestions([]);
      setSelectedQuestionIds([]);
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setName("");
    setQuestions([]);
    setSelectedQuestionIds([]);
    setIsModalOpen(false);
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

  return (
    <>
      <Modal
        footer={[
          <div className="flex gap-5 justify-center py-5 px-5">
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
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>,
        ]}
        centered
        open={isModalOpen}
        closable={false}
        width={800}
        className="addCustomQuizQuestions"
        zIndex={1000}
      >
        <div className="flex flex-col justify-between items-center pb-10">
          <div className="bg-colordarkblue flex justify-center border-0 rounded-t-md items-center h-16 w-full text-xs">
            <div className="text-white text-xl">Add Questions</div>
          </div>
          <div className="flex flex-col w-full px-10">
            <div className="flex mt-5 items-center gap-5">
              <label>Topic</label>
              <Input
                placeholder="Title"
                disabled={!isEditMode}
                value={isEditMode ? name : data?.name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex justify-center mt-3">
              <Input
                className="userSearch"
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                }}
                style={{ width: 350 }}
                prefix={<SearchOutlined style={{ fontSize: "20px" }} />}
                placeholder="Search Questions"
              />
            </div>
            <div className="w-full mt-5">
              <AddCoursesTable
                dataSource={filteredQuestions ?? []}
                onSelect={handleSelectQuestions}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddCustomQuizQuestions;

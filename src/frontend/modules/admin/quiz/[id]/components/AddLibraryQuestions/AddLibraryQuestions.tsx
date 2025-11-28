"use client";

import { Button, Modal, Select, Input } from "antd";
import { useEffect, useState } from "react";
import { useCategories } from "@/frontend/modules/admin/library/useCategories";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
import AddQuizTable from "@/frontend/components/table/addQuizTable";

const addBtnStyle = {
  background: "#01B067",
  padding: "16px 35px",
  borderRadius: "unset",
};

type AddQuestionsProps = {
  refetch: () => void;
  isModalOpen: boolean;
  data: any;
  handleCancel: () => void;
  quizId: string;
};

export function AddLibraryQuestions({
  type,
  quizId,
  refetch,
  isModalOpen,
  data,
  handleCancel,
}: AddQuestionsProps) {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState(questions);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const { categories } = useCategories();

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  useEffect(() => {
    const filtered = questions.filter((question) => {
      const categoriesMap = question.categories?.map(
        (category) => category.name
      );
      const matchesQuery = question.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        filterCategory === "All" || categoriesMap?.includes(filterCategory);

      return matchesQuery && matchesCategory;
    });
    setFilteredQuestions(filtered);
  }, [searchQuery, questions, filterCategory]);

  useEffect(() => {
    if (data) {
      const initialQuestions = data?.questions ?? [];
      getQuestions(initialQuestions);
      setSelectedQuestionIds(data?.questions ?? []);
    }
  }, [data]);

  const getQuestions = (qIds: string[]) => {
    axios
      .get("/api/questions")
      .then(({ data: questiosData }) => {
        const questionsWithIsChecked = questiosData.questions.map((q: any) => {
          return {
            ...q,
            isChecked: qIds.includes(q._id),
          };
        });
        setQuestions(questionsWithIsChecked);
      })
      .catch((error) => {
        console.error("/api/questions : ", error);
      });
  };

  const handleOk = () => {
    const quizPaperId = data?._id ?? null;

    const payload = {
      id: quizPaperId,
      paper: {
        questions: selectedQuestionIds,
      },
    };

    const formData = new FormData();
    formData.append("paperId", payload.id);

    // Append the questions
    payload.paper.questions.forEach((questionId, index) => {
      formData.append(`questions[${index}]`, questionId);
    });

    axios
      .put(`/api/quizes/${quizId}/library`, formData)
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
      open={isModalOpen}
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
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
              }}
              style={{ width: 250 }}
              prefix={<SearchOutlined style={{ fontSize: "20px" }} />}
              suffix={"Search"}
            />
            <Select
              className="quizCategory"
              onChange={(value) => setFilterCategory(value)}
              showSearch
              placeholder="Category"
              optionFilterProp="children"
              filterOption={filterOption}
              options={[
                {
                  label: "All",
                  value: "All",
                },
                ...categories?.map((category) => ({
                  label: category.name,
                  value: category.name,
                })),
              ]}
            />
          </div>
          <div>{/* <AddQuiz /> */}</div>
        </div>
        <div className="w-full">
          {/* Add Questions Table */}
          <AddQuizTable
            dataSource={filteredQuestions}
            onSelect={handleSelectQuestions}
          />
        </div>
      </div>
    </Modal>
  );
}

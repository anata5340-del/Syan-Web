import ContentTable from "@/frontend/components/table/contentTable";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import AddQuestion from "./add-questions";
import { Button, Input, Select } from "antd";
import { useQuestions } from "./use-questions";
import { useEffect, useState } from "react";
import { useCategories } from "../useCategories";
import { useAddQuestion } from "./use-add-question";
import AddCategories from "../AddCategories";

const addBtnStyle = {
  color: "#4F4F4F",
  background: "#FAB683",
  padding: "15px 20px",
  borderRadius: "5px",
};

export default function Quiz() {
  const { questions, handleDeleteQuestion, refetchQuestions } = useQuestions();
  const { categories, refetchCategories } = useCategories();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [filteredQuestions, setFilteredQuestions] = useState(questions);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const { handleToggleQuestionModal, isQuestionModalOpen } = useAddQuestion({
    refetch: refetchQuestions,
  });

  const [selectedQuestion, setSelectedQuestion] = useState(null); // State for the clicked note
  const [mode, setMode] = useState(""); // State for the clicked note

  const handleQuestionEdit = (question) => {
    setSelectedQuestion(question); // Store the note data for editing
    setMode("Edit");
    handleToggleQuestionModal();
  };

  const handleQuestionView = (question) => {
    setSelectedQuestion(question); // Store the note data for viewing
    setMode("View");
    handleToggleQuestionModal();
  };

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
  return (
    <>
      <div className="flex justify-between mt-2 mb-5">
        <AddCategories
          isModalOpen={showModal}
          categories={categories}
          toggleModal={() => {
            setShowModal((prev) => !prev);
          }}
          refetch={refetchCategories}
        />
        <div className="flex">
          <p className="text-black text-2xl">List of all Questions</p>
        </div>
        <div className="flex gap-20">
          <Input
            onChange={(e) => {
              const value = e.target.value;
              setSearchQuery(value);
            }}
            className="userSearch"
            style={{ width: 250 }}
            prefix={<SearchOutlined style={{ fontSize: "20px" }} />}
            suffix={"Search"}
          />
          <div>
            <Select
              className="quizCategory"
              showSearch
              onChange={(value) => setFilterCategory(value)}
              placeholder="Category"
              optionFilterProp="children"
              options={[
                {
                  label: "All",
                  value: "All",
                },
                ...categories.map((category) => ({
                  label: category.name,
                  value: category.name,
                })),
              ]}
              filterOption={filterOption}
            />
            <Button
              type="primary"
              onClick={() => {
                setShowModal(true);
              }}
              style={addBtnStyle}
              icon={<PlusOutlined />}
            ></Button>
          </div>
        </div>
        <div>
          <AddQuestion
            refetch={refetchQuestions}
            isQuestionModalOpen={isQuestionModalOpen}
            onToggle={handleToggleQuestionModal}
            mode={mode}
            setMode={setMode}
            question={selectedQuestion}
          />
        </div>
      </div>
      <div>
        <ContentTable
          dataSource={filteredQuestions}
          onDelete={handleDeleteQuestion}
          onEdit={handleQuestionEdit} // Pass the handleQuestionEdit callback
          onView={handleQuestionView} // Pass the handleQuestionView callback
        />
      </div>
    </>
  );
}

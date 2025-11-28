"use client";

import { Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import QuizTable from "@/frontend/components/table/quizTable";
// import CourseUpload from "@/frontend/components/upload/courseUpload";
import { useQuiz } from "./use-quiz";
import AddQuiz from "@/frontend/components/upload/add-quiz/add-quiz";
import AddQuestions from "@/frontend/components/upload/add-quiz/add-questions/add-questions";
import { useEffect, useState } from "react";
import { set } from "lodash";

const size: SizeType = "middle";

export default function Quiz() {
  const {
    quizes,
    handleDeleteQuiz,
    handleAddQuestions,
    refetchQuizes,
    isQuestionsModalOpen,
    addQuestionsData,
    handleCancelAddQuestions,
  } = useQuiz();

  const [quizMode, setQuizMode] = useState("add");
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const toggleQuizModal = () => setIsQuizModalOpen(!isQuizModalOpen);

  const [filteredQuizes, setFilteredQuizes] = useState(quizes ?? []);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const filtered = quizes?.filter((course) => {
      const matchesQuery = course.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesQuery;
    });
    setFilteredQuizes(filtered);
  }, [searchQuery, quizes]);

  const handleView = (record: any) => {
    setQuizMode("view");
    setQuizData(record);
    setIsQuizModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setQuizMode("edit");
    setQuizData(record);
    setIsQuizModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col mt-8 rounded-t-xl">
        <div className="flex flex-col text-white">
          <div className="bg-colordarkblue flex justify-center items-center rounded-t-xl h-20 px-4">
            <p className="text-2xl">Quiz Courses</p>
          </div>
          <div className="border border-x-black">
            <div className="flex justify-between align-middle my-10 mx-5">
              <div className="flex gap-12 items-center">
                <h2 className="text-3xl font-medium text-colorblack">
                  List of all quiz Courses
                </h2>
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
              </div>

              {/* add update view quiz modal */}
              <AddQuiz
                setQuizData={setQuizData}
                data={quizData}
                mode={quizMode}
                refetch={refetchQuizes}
                isModalOpen={isQuizModalOpen}
                toggleModal={toggleQuizModal}
                setQuizMode={setQuizMode}
              />
            </div>
          </div>
        </div>
        <div>
          {/* add update questions modal */}
          <AddQuestions
            refetch={refetchQuizes}
            handleCancel={handleCancelAddQuestions}
            isOpenModal={isQuestionsModalOpen}
            data={addQuestionsData}
          />
          <QuizTable
            dataSource={filteredQuizes}
            onDelete={handleDeleteQuiz}
            onAdd={handleAddQuestions}
            onView={handleView}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </>
  );
}

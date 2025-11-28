"use client";

import React from "react";
import { useModules } from "./useModules";
import { AddLibraryQuestions, Tabs } from "./components";
import { AddQuizLibrary } from "@/frontend/components/upload/addQuizLibrary/addQuizLibrary";
import { AddCustomQuizLibrary } from "@/frontend/components/upload/addCustomQuizLibrary/addCustomQuizLibrary";
import { useQuizData } from "./useQuizData";
import AddYourOwnData from "./components/AddYourOwn/AddYourOwnData/AddYourOwnData";
import LiraryListing from "./components/LibraryListing/LibraryListing";
import { Paper } from "@/backend/types";

const addBtnStyle = {
  background: "#01B067",
  padding: "0px 15px",
  borderRadius: "5px",
};

export default function Modules() {
  const {
    libraryMode,
    isAddLibraryModalOpen,
    toggleAddLibraryModal,
    isAddCustomQuestionsModalOpen,
    toggleAddCustomQuestionsModal,
    quizType,
    toggleQuizType,
    setLibraryMode,
  } = useModules();
  const {
    handleLibraryAddQuestions,
    isAddLibraryQuestionsModalOpen,
    toggleAddLibraryQuestionsModal,
    handlePaperDelete,
    quizData,
    quizCustomQuestions,
    quizId,
    refetchQuiz,
    setQuizPaperData,
    quizPaperData,
  } = useQuizData();
  const handleLibraryEdit = (data: Paper) => {
    setLibraryMode("edit");
    toggleAddLibraryModal();
    setQuizPaperData(data);
  };

  return (
    <div className="flex flex-col mt-8">
      <div className="flex flex-col text-white">
        <div className="bg-colordarkblue flex justify-center items-center rounded-t-xl h-20 px-4">
          <p className="text-2xl">Quiz Data</p>
        </div>
        <Tabs type={quizType} toggleQuizType={toggleQuizType} />
        <div className="flex mt-4">
          {/* Add quiz custom library */}
          {/* <CourseUpload type="SubChildModule" /> */}
          <AddCustomQuizLibrary
            // mode={quizType}
            type={quizType}
            quizId={quizId}
            refetch={refetchQuiz}
            quizData={quizCustomQuestions}
            isModalOpen={isAddCustomQuestionsModalOpen}
            toggleModal={toggleAddCustomQuestionsModal}
          />

          {/* Add quiz Library */}
          <AddQuizLibrary
            type={quizType}
            data={quizPaperData}
            quizId={quizId}
            mode={libraryMode}
            toggleModal={toggleAddLibraryModal}
            isModalOpen={isAddLibraryModalOpen}
            refetch={refetchQuiz}
          />

          <AddLibraryQuestions
            quizId={quizId}
            data={quizPaperData}
            refetch={refetchQuiz}
            isModalOpen={isAddLibraryQuestionsModalOpen}
            handleCancel={toggleAddLibraryQuestionsModal}
          />
          {/* <Button type="primary" style={addBtnStyle} icon={<PlusOutlined />}>
            Add Field yes
          </Button> */}
        </div>
      </div>
      <div className="mt-10">
        <div className="flex gap-10">
          {quizType === "library" ? (
            <LiraryListing
              data={quizData}
              onAdd={handleLibraryAddQuestions}
              onDelete={handlePaperDelete}
              onEdit={handleLibraryEdit}
            />
          ) : (
            <AddYourOwnData
              refetch={refetchQuiz}
              quizId={quizId}
              quizData={quizData?.customQuestions}
            />
          )}
        </div>
      </div>
    </div>
  );
}

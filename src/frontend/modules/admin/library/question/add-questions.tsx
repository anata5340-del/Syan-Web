"use client";

import { useState } from "react";
import { Button, Modal, Select, Input } from "antd";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useAddQuestion } from "./use-add-question";
import Actions from "@/frontend/components/upload/add-question/components/add-question-modal/actions";
import { Dispatch, SetStateAction, useEffect } from "react";

import * as pdfjsLib from "pdfjs-dist/webpack.mjs";

const addBtnStyle = {
  background: "#01B067",
  padding: "16px 35px",
  borderRadius: "3px",
};
const addBtnStyle1 = {
  background: "#01B067",
  padding: "0px 15px",
  borderRadius: "5px",
};

type AddQuestionProps = {
  refetch: () => void;
  isQuestionModalOpen: true | false;
  mode: string;
  onToggle: () => void;
  question: any;
  setMode?: Dispatch<SetStateAction<string>>;
};

const difficultyLevels = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];

export default function AddQuestion({
  refetch,
  onToggle,
  mode,
  setMode,
  question,
  isQuestionModalOpen,
}: AddQuestionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [questions, setQuestions] = useState([]);

  // Pagination logic
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const {
    correctOption,
    correctOptions,
    categories,
    formData,
    setFormData,
    handleFormData,
    handleSaveQuestion,
    handleUpdateQuestion,
    handleAddOption,
    handleUpdateOption,
    handleDeleteOption,
    handleSetCorrectOption,
  } = useAddQuestion({
    refetch,
  });

  useEffect(() => {
    if (question && mode !== "New") {
      setFormData({
        name: question.name,
        statement: question.statement,
        categories: question.categories,
        options: question.options,
        difficultyLevel: question.difficultyLevel,
        topic: question.topic,
        explanation: question.explanation,
        reference: question.reference,
      });
    }
  }, [question, setFormData, mode]);

  useEffect(() => {
    if (
      isBulkMode &&
      questions[currentQuestionIndex] &&
      (mode === "New" || mode === "Edit")
    ) {
      setFormData({
        name: questions[currentQuestionIndex].name,
        statement: questions[currentQuestionIndex].statement,
        categories: [],
        options: questions[currentQuestionIndex].options,
        difficultyLevel: questions[currentQuestionIndex].difficultyLevel,
        topic: questions[currentQuestionIndex].topic,
        explanation: questions[currentQuestionIndex].explanation,
        reference: questions[currentQuestionIndex].reference,
      });
      if (questions[currentQuestionIndex].saved) {
        setMode("Edit");
      } else {
        setMode("New");
      }
    } else if (mode !== "New" || "Edit") {
      setIsBulkMode(false);
    }
  }, [questions, isBulkMode, questions[currentQuestionIndex]]);

  const handleSave = async () => {
    try {
      const updatedQuestion = await handleSaveQuestion(
        isBulkMode ? false : true
      );
      console.log(updatedQuestion);

      isBulkMode &&
        setQuestions((prev) => {
          const updatedQuestions = [...prev]; // Create a shallow copy of the array
          updatedQuestions[currentQuestionIndex] = {
            ...updatedQuestions[currentQuestionIndex],
            ...updatedQuestion,
            saved: true,
          };
          return updatedQuestions; // Return the updated array
        });

      if (!isBulkMode) {
        onToggle();
      }
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  const handleEdit = async () => {
    try {
      const questionToUpdateId = isBulkMode
        ? questions[currentQuestionIndex]._id
        : question._id;

      const updatedQuestion = await handleUpdateQuestion(
        questionToUpdateId,
        !isBulkMode
      );
      console.log(updatedQuestion);

      isBulkMode &&
        setQuestions((prev) => {
          const updatedQuestions = [...prev]; // Create a shallow copy of the array
          const indexToUpdate = currentQuestionIndex;

          if (indexToUpdate !== -1) {
            updatedQuestions[indexToUpdate] = {
              ...updatedQuestions[indexToUpdate],
              ...updatedQuestion,
            };
          }

          return updatedQuestions; // Return the updated array
        });

      if (!isBulkMode) {
        onToggle();
      }
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const onAddNew = () => {
    onToggle();
    setMode("New");
    setFormData({
      name: "",
      statement: "",
      categories: [],
      options: [],
      difficultyLevel: "",
      topic: "",
      explanation: "",
      reference: "",
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const typedArray = new Uint8Array(e.target.result);

        try {
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          let extractedText = "";

          // Extract text from each page
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item) => item.str)
              .join(" ");
            extractedText += pageText + "\n";
          }

          console.log("Extracted text:", extractedText);

          // Preprocess text: Remove unnecessary line breaks and join lines
          const preprocessedText = extractedText
            .replace(/\n/g, " ") // Replace line breaks with spaces
            .replace(/\s{2,}/g, " ") // Remove extra spaces
            .replace(/(\d+\.\s+)/g, "\n$1") // Add line breaks before each question number
            .trim();

          console.log("Preprocessed text:", preprocessedText);

          // Parse questions
          const questions = [];
          const questionBlocks = preprocessedText.split("\n");

          questionBlocks.forEach((block) => {
            // Updated regex to match multiple question formats: "Q-1:", "1.", etc.
            const questionMatch = block.match(
              /^(?:\d+\:|\d+\.)\s+(.*?)(?=a\)|Key:|$)/i
            );
            if (questionMatch) {
              const statement = questionMatch[1].trim();

              // Match options
              const optionsText = block.slice(questionMatch[0].length); // Remaining text after statement
              const options = [];
              const optionMatches = optionsText.matchAll(
                /([a-e])\)\s+(.*?)(?=[a-e]\)|Key:|$)/gi
              );
              for (const match of optionMatches) {
                options.push({
                  name: match[2].trim(),
                  isCorrect: false, // Default to false, will update later if matched with the key
                });
              }

              // Match the key
              const keyMatch = block.match(/Key:\s+([a-e])/i);
              if (keyMatch) {
                const correctAnswer = keyMatch[1].toLowerCase();
                const correctOptionIndex = "abcde".indexOf(correctAnswer);
                if (options[correctOptionIndex]) {
                  options[correctOptionIndex].isCorrect = true;
                }
              }

              // Match the reference (supports both Ref: and Reference:)
              const refMatch = block.match(/(?:Ref:|Reference:)\s+(.*)$/i);
              const reference = refMatch ? refMatch[1].trim() : "";

              // Add the parsed question to the array
              questions.push({
                _id: `${questions.length + 1}`,
                name: `Question #${questions.length + 1}`,
                statement,
                categories: [],
                options,
                difficultyLevel: "medium", // Default difficulty level
                topic: file.name.replace(/_/g, " ").replace(/\.[^/.]+$/, ""),
                explanation: "Understanding the question is part of the exam.",
                reference,
                saved: false,
              });
            }
          });

          setQuestions(questions);
          setIsBulkMode(true);
          console.log("Parsed Questions:", questions);
        } catch (error) {
          console.error("Error parsing PDF:", error);
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <>
      <Button
        type="primary"
        onClick={onAddNew}
        style={addBtnStyle}
        icon={<PlusOutlined />}
      ></Button>
      <Modal
        footer={
          <Actions
            handleCancel={() => {
              setIsBulkMode(false);
              setCurrentQuestionIndex(0);
              onToggle();
            }}
            handleSave={
              mode === "View"
                ? onToggle
                : mode === "Edit"
                ? handleEdit
                : handleSave
            }
          />
        }
        centered
        open={isQuestionModalOpen}
        closable={false}
        width={800}
        className="addCourseModal"
      >
        <div className="flex flex-col justify-between items-center pb-10">
          <div className="bg-colordarkblue flex justify-center border-0 rounded-t-md items-center h-16 w-full text-xs">
            <div className="text-white text-xl">Add Question</div>
          </div>
          <div className="flex flex-col w-full px-10">
            <div className="flex items-center justify-between w-full mt-5">
              <div className="flex flex-col w-3/5">
                <label>Category:</label>
                <Select
                  value={formData.categories.map((cat) => cat.name)} // Display category names in the select box
                  mode="tags"
                  style={{ width: "100%" }}
                  placeholder="Add Category"
                  options={categories
                    .filter(
                      (category) =>
                        !formData.categories.some(
                          (selectedCategory) =>
                            selectedCategory._id === category._id
                        )
                    )
                    .map((category) => ({
                      label: category.name, // Display category name in the dropdown
                      value: category.name, // Store category ID as the value (what's sent in the form data)
                    }))}
                  onChange={(selectedCategoryNames) => {
                    // Map selected category names to their corresponding full category objects
                    const selectedCategories = categories.filter(
                      (category) =>
                        selectedCategoryNames.includes(category.name) // Match the selected names
                    );
                    handleFormData("categories", selectedCategories); // Update formData with full category objects
                  }}
                  disabled={mode === "View"}
                />
              </div>

              {(mode === "New" || questions[currentQuestionIndex]) && (
                <div className="flex gap-5 mt-5">
                  <Button
                    type="primary"
                    onClick={() => {
                      document.getElementById("bulkFileInput")?.click();
                    }}
                    style={addBtnStyle1}
                  >
                    Add Bulk
                  </Button>
                  {/* Hidden file input */}
                  <input
                    type="file"
                    id="bulkFileInput"
                    style={{ display: "none" }}
                    accept=".pdf"
                    onChange={(e) => handleFileUpload(e)}
                    onClick={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.value = ""; // Reset the input value to allow re-uploading the same file
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col mt-4">
              <label className="font-medium">Quiz Name:</label>
              <Input
                value={formData?.name}
                placeholder="Enter Name"
                onChange={(e) => handleFormData("name", e.target.value)}
                disabled={mode === "View"}
              />
            </div>
            <div className="flex flex-col mt-4">
              <label className="font-medium">Statement:</label>
              <TextArea
                value={formData?.statement}
                rows={7}
                onChange={(e) => handleFormData("statement", e.target.value)}
                disabled={mode === "View"}
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button
                type="primary"
                onClick={handleAddOption}
                style={addBtnStyle1}
                disabled={mode === "View"}
              >
                Add Options
              </Button>
            </div>
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center gap-3 mt-4 option">
                <label className="font-sm text-sm flex-none">
                  Option {index + 1}
                </label>
                <Input
                  value={option?.name}
                  onChange={(e) =>
                    handleUpdateOption(index, "name", e.target.value)
                  }
                  disabled={mode === "View"}
                />
                <img
                  className={
                    mode === "View" ? "cursor-not-allowed" : "cursor-pointer"
                  }
                  src="/assets/img/icon24.png"
                  alt="Delete"
                  onClick={
                    mode === "View" ? () => {} : () => handleDeleteOption(index)
                  }
                />
              </div>
            ))}
            {formData.options.length ? (
              <div className="flex mt-5 items-center gap-5">
                <label>Correct Option</label>
                <Select
                  style={{ width: 200 }}
                  onChange={handleSetCorrectOption}
                  value={
                    correctOption
                      ? correctOption
                      : formData.options.find((option) => option.isCorrect)
                          ?.name || ""
                  }
                  placeholder="Select option"
                  options={correctOptions}
                  disabled={mode === "View"}
                />
              </div>
            ) : null}
            <div className="mt-5">
              <label className="font-medium">Add Explanation:</label>
              <div className="bg-[#EEFFF8] px-5 rounded-md pt-1 pb-5 border border-black">
                <div className="flex justify-between gap-44 ">
                  <div className="flex flex-col mt-4 w-2/4">
                    <label className="font-medium">Difficulty level:</label>
                    <Select
                      className="transparentInput"
                      value={formData?.difficultyLevel}
                      style={{ width: "100%" }}
                      placeholder="Enter Level"
                      options={difficultyLevels}
                      onChange={(value) =>
                        handleFormData("difficultyLevel", value)
                      }
                      disabled={mode === "View"}
                    />
                  </div>
                  <div className="flex flex-col mt-4 w-2/4">
                    <label className="font-medium">Topic:</label>
                    <Input
                      value={formData?.topic}
                      className="transparentInput"
                      placeholder="Enter Topic"
                      onChange={(e) => handleFormData("topic", e.target.value)}
                      disabled={mode === "View"}
                    />
                  </div>
                </div>
                <div className="flex flex-col mt-4">
                  <label className="font-medium">Explanation:</label>
                  <TextArea
                    value={formData?.explanation}
                    className="transparentInput"
                    rows={7}
                    onChange={(e) =>
                      handleFormData("explanation", e.target.value)
                    }
                    disabled={mode === "View"}
                  />
                </div>
                <div className="flex flex-col mt-6">
                  <label className="font-medium">Reference:</label>
                  <Input
                    value={formData?.reference}
                    className="referenceInput transparentInput"
                    placeholder="Enter Topic"
                    onChange={(e) =>
                      handleFormData("reference", e.target.value)
                    }
                    disabled={mode === "View"}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Pagination Controls */}
          {isBulkMode && (
            <>
              {questions[currentQuestionIndex]?.saved && (
                <div className="flex px-3 mt-5 mb-2 rounded-full text-white p-1 justify-center bg-green-600">
                  Saved
                </div>
              )}
              <div
                className={`flex justify-between items-center -mb-8 ${
                  !questions[currentQuestionIndex]?.saved && "mt-5"
                }`}
              >
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                <div className="px-3">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
                <Button
                  onClick={handleNext}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}

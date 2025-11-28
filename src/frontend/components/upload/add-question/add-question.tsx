"use client";

import { Button, Modal, Select, Input } from "antd";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useAddQuestion } from "./use-add-question";
import Actions from "./components/add-question-modal/actions";

const { Option } = Select;

const addBtnStyle = {
  background: "#01B067",
  padding: "16px 35px",
  borderRadius: "unset",
};
const addBtnStyle1 = {
  background: "#01B067",
  padding: "0px 15px",
  borderRadius: "5px",
};
const downloadBtnStyle = {
  background: "#FDC9CE",
  color: "#000",
};

type AddQuestionProps = {
  refetch: () => void;
};

const difficultyLevels = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];

export default function AddQuestion({ refetch }: AddQuestionProps) {
  const {
    correctOption,
    correctOptions,
    categories,
    formData,
    handleFormData,
    handleToggleQuestionModal,
    handleSaveQuestion,
    isQuestionModalOpen,
    handleAddOption,
    handleUpdateOption,
    handleDeleteOption,
    handleSetCorrectOption,
  } = useAddQuestion({
    refetch,
  });

  return (
    <>
      <Button
        type="primary"
        onClick={handleToggleQuestionModal}
        style={addBtnStyle}
        icon={<PlusOutlined />}
      ></Button>
      <Modal
        footer={
          <Actions
            handleCancel={handleToggleQuestionModal}
            handleSave={handleSaveQuestion}
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
                  value={formData?.categories}
                  mode="tags"
                  style={{ width: "100%" }}
                  placeholder="Add Category"
                  options={categories}
                  onChange={(value) => handleFormData("categories", value)}
                />
              </div>
              {/* <div className="flex gap-5 mt-5">
                <Button
                  type="primary"
                  style={downloadBtnStyle}
                  shape="round"
                  icon={<DownloadOutlined />}
                >
                  Sample
                </Button>
                <Button type="primary" style={addBtnStyle1}>
                  Add Bulk
                </Button>
              </div> */}
            </div>
            <div className="flex flex-col mt-4">
              <label className="font-medium">Quiz Name:</label>
              <Input
                value={formData?.name}
                placeholder="Enter Name"
                onChange={(e) => handleFormData("name", e.target.value)}
              />
            </div>
            <div className="flex flex-col mt-4">
              <label className="font-medium">Statement:</label>
              <TextArea
                value={formData?.statement}
                rows={7}
                onChange={(e) => handleFormData("statement", e.target.value)}
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button
                type="primary"
                onClick={handleAddOption}
                style={addBtnStyle1}
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
                />
                <img
                  src="/assets/img/icon24.png"
                  alt="Delete"
                  onClick={() => handleDeleteOption(index)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            ))}
            {formData.options.length ? (
              <div className="flex mt-5 items-center gap-5">
                <label>Correct Option</label>
                <Select
                  style={{ width: 200 }}
                  onChange={handleSetCorrectOption}
                  value={correctOption}
                  placeholder="Select option"
                  options={correctOptions}
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
                    />
                  </div>
                  <div className="flex flex-col mt-4 w-2/4">
                    <label className="font-medium">Topic:</label>
                    <Input
                      value={formData?.topic}
                      className="transparentInput"
                      placeholder="Enter Topic"
                      onChange={(e) => handleFormData("topic", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col mt-4">
                  <label className="font-medium">Statement:</label>
                  <TextArea
                    value={formData?.explanation}
                    className="transparentInput"
                    rows={7}
                    onChange={(e) =>
                      handleFormData("explanation", e.target.value)
                    }
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
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

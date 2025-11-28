"use client";

import { Button, Modal, Select, Input } from "antd";
import { useState } from "react";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

export default function AddQuestion() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const { Option } = Select;
  const children = [""];

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
  const [options, setOptions] = useState([{ id: 1, label: "Option A" }]);

  const handleAddBulk = () => {
    const newId = options.length + 1;
    const newLabel = String.fromCharCode(65 + options.length);
    setOptions([...options, { id: newId, label: `Option ${newLabel}` }]);
  };

  const handleDeleteOption = (id: number) => {
    setOptions(options.filter((option) => option.id !== id));
  };
  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        style={addBtnStyle}
        icon={<PlusOutlined />}
      ></Button>
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
                  mode="tags"
                  style={{ width: "100%" }}
                  placeholder="Add Category"
                >
                  {children}
                </Select>
              </div>
              <div className="flex gap-5 mt-5">
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
              </div>
            </div>
            <div className="flex flex-col mt-4">
              <label className="font-medium">Quiz Name:</label>
              <Input placeholder="Enter Name" />
            </div>
            <div className="flex flex-col mt-4">
              <label className="font-medium">Statement:</label>
              <TextArea rows={7} />
            </div>
            <div className="flex justify-end mt-4">
              <Button
                type="primary"
                onClick={handleAddBulk}
                style={addBtnStyle1}
              >
                Add Bulk
              </Button>
            </div>
            {options.map((option) => (
              <div
                key={option.id}
                className="flex items-center gap-3 mt-4 option"
              >
                <label className="font-sm text-sm flex-none">
                  {option.label}
                </label>
                <Input />
                <img
                  src="/assets/img/icon24.png"
                  alt="Delete"
                  onClick={() => handleDeleteOption(option.id)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            ))}
            <div className="flex mt-5 items-center gap-5">
              <label>Correct Option</label>
              <Select
                placeholder="Select option"
                options={options.map((option) => ({
                  value: option.id,
                  label: option.label,
                }))}
              />
            </div>
            <div className="mt-5">
              <label className="font-medium">Add Explanation:</label>
              <div className="bg-[#EEFFF8] px-5 rounded-md pt-1 pb-5 border border-black">
                <div className="flex justify-between gap-44 ">
                  <div className="flex flex-col mt-4 w-2/4">
                    <label className="font-medium">Difficulty level:</label>
                    <Input
                      className="transparentInput"
                      placeholder="Enter Level"
                    />
                  </div>
                  <div className="flex flex-col mt-4 w-2/4">
                    <label className="font-medium">Topic:</label>
                    <Input
                      className="transparentInput"
                      placeholder="Enter Topic"
                    />
                  </div>
                </div>
                <div className="flex flex-col mt-4">
                  <label className="font-medium">Statement:</label>
                  <TextArea className="transparentInput" rows={7} />
                </div>
                <div className="flex flex-col mt-6">
                  <label className="font-medium">Reference:</label>
                  <Input
                    className="referenceInput transparentInput"
                    placeholder="Enter Topic"
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

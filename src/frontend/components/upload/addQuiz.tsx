"use client";

import { Button, Modal, Select, Input } from "antd";
import { useState } from "react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import AddQuizTable from "../table/addQuizTable";

const addBtnStyle = {
  background: "#01B067",
  padding: "16px 35px",
  borderRadius: "unset",
};

const filterOption = (
  input: string,
  option?: { label: string; value: string }
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

export default function AddQuiz() {
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
          <div className="flex gap-5 justify-end py-5 px-5">
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
        style={{ left: 250, paddingBottom: 0 }}
        open={isModalOpen}
        centered
        closable={false}
        width={900}
        className="addCourseModal"
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
            <div>
              <AddQuiz />
            </div>
          </div>
          <div className="w-full">
            <AddQuizTable />
          </div>
        </div>
      </Modal>
    </>
  );
}

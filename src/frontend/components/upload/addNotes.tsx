"use client";

import { Button, Modal, Select, Input } from "antd";
import { useState } from "react";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import type { CollapseProps } from "antd";
import { Collapse } from "antd";

export default function AddNotes() {
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

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "This is panel header 1",
      children: (
        <div className="flex flex-col mt-4">
          <TextArea rows={7} />
        </div>
      ),
    },
  ];
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
            <div className="text-white text-xl">Add Notesss</div>
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
            </div>
            <div className="flex flex-col mt-4">
              <label className="font-medium">Notes Name:</label>
              <Input placeholder="Enter Name" />
            </div>
            <div className="flex flex-col mt-4">
              <label className="font-medium">Title</label>
              <Input placeholder="Enter Name" />
            </div>
            <div className="flex justify-between mt-4">
              <div className="flex items-center gap-5">
                <label className="font-medium">Author:</label>
                <Input className="flex-none" placeholder="Enter Name" />
              </div>
              <div>
                <Button
                  className=""
                  type="primary"
                  onClick={handleAddBulk}
                  style={addBtnStyle1}
                >
                  Add Content
                </Button>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-start gap-3">
              <Collapse
                className="w-full notesAccordion"
                accordion
                items={items}
                expandIconPosition="end"
              />
              <img src="/assets/img/icon12.png" />
              <img src="/assets/img/icon14.png" />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

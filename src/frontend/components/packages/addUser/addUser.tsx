"use client";

import { Button, Input, Modal } from "antd";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import AddUserTable from "../../table/addUserTable";

const addBtnStyle = {
  background: "#01B067",
  padding: "16px 35px",
  borderRadius: "unset",
  margin: "15px 0",
};

export default function AddUser() {
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
        className="addCourseModal !left-0"
      >
        <div className="flex flex-col justify-between items-center pb-10">
          <div className="bg-colorred flex justify-center border-0 rounded-t-md items-center h-16 w-full text-xs">
            <div className="text-white text-xl">All Users</div>
          </div>
          <div className="w-full">
            <AddUserTable />
          </div>
        </div>
      </Modal>
    </>
  );
}

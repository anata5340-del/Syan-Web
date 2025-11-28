"use client";

import { Button, Modal, Input } from "antd";
import { useEffect, useState } from "react";

type AddCustomQuizQuestionsProps = {
  data: unknown;
  isModalOpen: boolean;
  handleSave?: (data: unknown) => void;
  handleNameChange: (key: string, value: unknown) => void;
  setIsModalOpen: (value: boolean) => void;
};

const AddCustomQuizQuestions = ({
  data,
  handleSave,
  isModalOpen,
  handleNameChange,
  setIsModalOpen,
}: AddCustomQuizQuestionsProps) => {
  const [name, setName] = useState("");
  useEffect(() => {
    setName(data?.topic?.name);
  }, [data]);

  const handleOk = () => {
    handleNameChange("name", name);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setName("");
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        footer={[
          <div className="flex gap-5 justify-center pb-5 px-5">
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
        width={400}
        className="addCustomQuizQuestions"
        zIndex={1000}
      >
        <div className="flex flex-col justify-between items-center pb-2">
          <div className="bg-colordarkblue flex justify-center border-0 rounded-t-md items-center h-16 w-full text-xs">
            <div className="text-white text-xl">Edit Topic</div>
          </div>
          <div className="flex flex-col w-full px-10">
            <div className="flex mt-5 items-center gap-5">
              <label>Topic</label>
              <Input
                placeholder="Title"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddCustomQuizQuestions;

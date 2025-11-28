"use client";

import { Button, ColorPicker, Input, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function CourseUpload(props: { type: string }) {
  const type = props.type;
  const addBtnStyle = {
    background: "#01B067",
    padding: "0px 15px",
    borderRadius: "5px",
  };

  const [isModalOpen, setModalOpen] = useState(false);

  const showModal = () => {
    setModalOpen(true);
  };

  const modelOk = () => {
    setModalOpen(false);
  };

  const modelCancel = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        style={addBtnStyle}
        icon={<PlusOutlined />}
      >
        Add Field
      </Button>
      <Modal
        footer={[
          <div className="flex gap-5 justify-end items-center py-7 px-9 bg-[#EDF7FF]">
            {type === "SubModule" || type === "SubChildModule" ? (
              <div className="flex flex-col items-start justify-center -mt-4">
                <label className="font-medium">Topic:</label>
                <Input placeholder="Enter Topic" />
              </div>
            ) : (
              <></>
            )}
            <div className="flex gap-2 justify-end items-center w-2/3">
              <Button
                className="saveBtn"
                key="submit"
                type="primary"
                onClick={modelOk}
              >
                Save
              </Button>
              <Button
                className="cancelBtn"
                key="cancel"
                type="primary"
                onClick={modelCancel}
              >
                Cancel
              </Button>
            </div>
          </div>,
        ]}
        style={{
          top: 80,
          left: 300,
          backgroundColor: "#EDF7FF",
          paddingBottom: 0,
        }}
        open={isModalOpen}
        closable={false}
        width={420}
        className="nameModal"
      >
        <div className="px-9 pt-6 bg-[#EDF7FF] flex flex-col gap-3">
          <div>
            <label className="font-medium">Name:</label>
            <Input placeholder="Enter Name" />
          </div>
          <div>
            <label className="font-medium">Color Pick:</label>
            <div className="flex gap-2 items-center">
              <img
                className="border border-[#636363] rounded-md"
                src="/assets/img/icon20.png"
              />
              <ColorPicker className="colorPickerBtn" defaultValue="#fff" />
            </div>
          </div>
          {type === "Module" ? (
            <></>
          ) : (
            <div>
              {type === "SubChildModule" ? (
                <label className="font-medium">Upload Icon:</label>
              ) : (
                <label className="font-medium">Image:</label>
              )}
              <div className="bg-[#F9D293] h-28 rounded-lg flex flex-col justify-center items-center">
                <img src="/assets/img/icon19.png" />
                {type === "SubChildModule" ? (
                  <p>Upload Icon</p>
                ) : (
                  <p>Upload Image</p>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

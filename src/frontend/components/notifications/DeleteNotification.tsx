"use client";

import { Button, Modal } from "antd";
import { useState } from "react";

type Props = {
  onDelete: () => void;
};

export default function DeleteNotification({ onDelete }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    onDelete();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div>
        <img
          style={{ cursor: "pointer" }}
          src="/assets/img/icon14.png"
          width={18}
          onClick={showModal}
          className="m-auto"
        />
        <Modal
          footer={[
            <div
              key="delete-notification-modal"
              className="flex items-center justify-center gap-5 py-7 px-10 bg-[#EDF7FF]"
            >
              <Button
                className="yesBtn"
                key="submit"
                type="primary"
                onClick={handleOk}
              >
                Yes
              </Button>
              <Button
                className="noBtn"
                key="cancel"
                type="primary"
                onClick={handleCancel}
              >
                No
              </Button>
            </div>,
          ]}
          style={{
            top: 220,
            left: 500,
            backgroundColor: "#EDF7FF",
            paddingBottom: 0,
          }}
          open={isModalOpen}
          closable={false}
          width={300}
          className="nameModal !left-0"
        >
          <div className="flex flex-col justify-center items-center gap-3 px-10 pt-7 bg-[#EDF7FF]">
            <img src="/assets/img/icon15.png" />
            <p className="text-lg font-medium">Are you sure?</p>
          </div>
        </Modal>
      </div>
    </>
  );
}

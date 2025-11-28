"use client";

import { Button, Modal, Switch } from "antd";
import { useState } from "react";

type Props = {
  onActive: (active: boolean) => void;
  isActive: boolean;
};

export default function UserActiveInActiveNotification({
  onActive,
  isActive,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [active, setActive] = useState(isActive);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    onActive(active);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setActive(isActive);
    setIsModalOpen(false);
  };

  const handleChangeUserStatus = (isUserActive: boolean) => {
    console.log("argument", isUserActive);
    setActive((prev) => !prev);
    showModal();
  };

  return (
    <>
      <div>
        {/* <img
          src="/assets/img/icon14.png"
          width={18}
          onClick={showModal}
          className="ml-5"
        /> */}
        <>
          <Switch
            checked={active}
            onChange={handleChangeUserStatus}
            className="activeStatusBtn"
          />
          <span className="pl-2">OFF/ON</span>
        </>
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
            <p className="text-lg font-medium">
              Are you sure you want to {active ? "activate" : "de activate"}{" "}
              this user ?
            </p>
          </div>
        </Modal>
      </div>
    </>
  );
}

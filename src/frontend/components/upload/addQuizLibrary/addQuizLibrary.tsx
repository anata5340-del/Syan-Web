// "use client";
import { Button, ColorPicker, Input, Modal, Form } from "antd";
import FormItem from "antd/es/form/FormItem";

import {
  CheckCircleTwoTone,
  CloseCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  useEffect,
  useState,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from "react";
import axios from "axios";
import { rgbaToHex } from "../utils";
import toast from "react-hot-toast";

const addBtnStyle = {
  background: "#01B067",
  padding: "0px 15px",
  borderRadius: "5px",
};

export const AddQuizLibrary = ({
  type,
  data,
  quizId,
  mode,
  toggleModal,
  isModalOpen,
  refetch,
}) => {
  const [form] = Form.useForm();
  const [image, setImage] = useState<File>();

  //handle and edit and view case
  useEffect(() => {
    if ((mode === "view" || mode === "edit") && data) {
      form.setFieldsValue({
        name: data.name,
        color: data.color,
        topic: data.topic,
      });
      setImage(data.icon);
    }
  }, [data, mode]);

  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>,
    setState: Dispatch<SetStateAction<File | undefined>>
  ) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setState(file);
    }
  };

  const handleOk = async () => {
    const formData = new FormData();
    const formEntries = Object.entries(form.getFieldsValue());
    formEntries.forEach(([key, value]) => {
      let updatedValue = value;
      if (key === "color") {
        if (typeof value === "string") {
          updatedValue = value;
        } else {
          const { r, g, b, a } = value?.metaColor ?? { r: 0, g: 0, b: 0, a: 1 };
          updatedValue = rgbaToHex(r, g, b, a);
        }
      }
      formData.append(`paper[${key}]`, `${updatedValue}`);
    });

    if (image) formData.append("icon", image);

    if (mode === "edit") {
      const paperId = data?._id;
      formData.append("paper[id]", paperId);
      try {
        await axios.patch(`/api/quizes/${quizId}/library`, formData);
        refetch();
        toast.success("Quiz Library Paper Updated Successfully");
      } catch (error) {
        console.error(error);
        toast.error("Quiz Library Paper Updation Failed");
      } finally {
        toggleModal();
      }
      return;
    }

    try {
      await axios.post(`/api/quizes/${quizId}/library`, formData);
      refetch();
      toast.success("Quiz Library Added Successfully");
      handleCancel();
    } catch (error) {
      console.error(error);
      toast.error("Quiz Library Addition Failed");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setImage(undefined);
    toggleModal();
  };

  const isDisabled = mode === "view";

  return (
    <>
      <div className="flex justify-end w-full">
        {type === "library" && (
          <Button
            type="primary"
            onClick={toggleModal}
            style={addBtnStyle}
            icon={<PlusOutlined />}
          >
            Add Field
          </Button>
        )}
      </div>
      <Modal
        footer={[
          <div
            key="footer-content"
            className="flex gap-5 justify-end items-center py-7 px-9 bg-[#EDF7FF]"
          >
            <div className="flex gap-2 justify-end items-center w-2/3">
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
        <Form
          form={form}
          initialValues={{
            color: "#000",
          }}
        >
          <div className="px-9 pt-6 bg-[#EDF7FF] flex flex-col gap-3">
            {mode === "view" && (
              <div className="flex justify-end">
                <CloseCircleOutlined onClick={handleCancel} />
              </div>
            )}
            <div>
              <label className="font-medium">Name:</label>
              <FormItem name="name">
                <Input placeholder="Enter Name" disabled={isDisabled} />
              </FormItem>
            </div>
            <div>
              <label className="font-medium">Color Pick:</label>
              <div className="flex gap-2 pt-1">
                {/* <img
                  className="border border-[#636363] rounded-md"
                  src="/assets/img/icon20.png"
                /> */}
                <FormItem name="color">
                  <ColorPicker
                    disabled={isDisabled}
                    className="colorPickerBtn pl-0"
                  />
                </FormItem>
              </div>
            </div>

            <div>
              <label className="font-medium">Upload Image:</label>

              <div
                // style={{ cursor: mode === "view" ? "not-allowed" : "pointer" }}
                onClick={() => {
                  const fileInput = document.getElementById("imageInput");
                  fileInput?.click();
                }}
                className="bg-[#F9D293] h-28 rounded-lg flex flex-col justify-center items-center"
              >
                {image ? (
                  <CheckCircleTwoTone
                    style={{ fontSize: "30px" }}
                    twoToneColor="#52c41a"
                  />
                ) : (
                  <img src="/assets/img/icon19.png" />
                )}

                {image ? <p>Image Selected</p> : <p>Upload Image</p>}
                <input
                  // disabled={mode === "view"}
                  id="imageInput"
                  onChange={(event) => handleImageUpload(event, setImage)}
                  type="file"
                  className="!hidden"
                />
              </div>
            </div>
            <div className="flex flex-col items-start justify-center mt-4">
              <label className="font-medium">Topic:</label>
              <FormItem name="topic" className="w-full">
                <Input placeholder="Enter Topic" disabled={isDisabled} />
              </FormItem>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};

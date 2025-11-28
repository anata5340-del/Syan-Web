"use client";

import { Button, ColorPicker, Input, Modal, Form } from "antd";
import { CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import FormItem from "antd/es/form/FormItem";
import axios from "axios";
import toast from "react-hot-toast";

import { CheckCircleTwoTone } from "@ant-design/icons";
import { rgbaToHex } from "../utils";

const addBtnStyle = {
  background: "#01B067",
  padding: "0px 15px",
  borderRadius: "5px",
};

type dataType = {
  _id?: string;
  name: string;
  image: string | File;
  color: string;
};

type AddVideoCourseProps = {
  refetch: () => void;
  toggleModal: () => void;
  isModalOpen: boolean;
  setMode: Dispatch<SetStateAction<string>>;
  mode: string;
  data: dataType | null;
};

export default function AddVideoCourse({
  refetch,
  toggleModal,
  isModalOpen,
  setMode,
  mode,
  data,
}: AddVideoCourseProps) {
  const [form] = Form.useForm();
  const [image, setImage] = useState<File>();

  useEffect(() => {
    if ((mode === "view" || mode === "edit") && data) {
      form.setFieldsValue({
        name: data.name,
        color: data.color,
      });
      setImage(data?.image);
    }
  }, [data, mode]);

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
      formData.append(`videoCourse[${key}]`, `${updatedValue}`);
    });

    if (image) formData.append("image", image);

    if (mode === "edit" && data?._id) {
      const videoCourseID = data._id;
      try {
        await axios.put(`/api/videoCourses/${videoCourseID}`, formData);
        refetch();
        toast.success("Video Course Updated Successfully");
      } catch (error) {
        console.error(error);
        toast.error("Video Course Update Failed");
      } finally {
        form.resetFields();
        setImage(undefined);
        toggleModal();
      }
      return;
    }

    try {
      await axios.post("/api/videoCourses", formData);
      refetch();
      toast.success("Video Course Added Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Video Course Addition Failed");
    } finally {
      form.resetFields();
      setImage(undefined);
      toggleModal();
    }
  };

  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>,
    setState: Dispatch<SetStateAction<File | undefined>>
  ) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setState(file);
    }
  };

  const handleAdd = () => {
    setMode("add");
    toggleModal();
  };

  const handleCancel = () => {
    form.resetFields();
    setImage(undefined);
    toggleModal();
  };

  return (
    <>
      <Button
        type="primary"
        onClick={handleAdd}
        style={addBtnStyle}
        icon={<PlusOutlined />}
      ></Button>
      <Modal
        footer={[
          <div
            key="footer-content"
            className="flex gap-5 updateQuizValidatorjustify-end items-center py-7 px-9 bg-[#EDF7FF]"
          >
            <div className="flex gap-2 justify-end items-center w-2/3">
              {mode !== "view" && (
                <>
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
                </>
              )}
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
                <Input placeholder="Enter Name" disabled={mode === "view"} />
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
                    disabled={mode === "view"}
                    className="colorPickerBtn pl-0"
                  />
                </FormItem>
              </div>
            </div>

            <div>
              <label className="font-medium">Upload Image:</label>

              <div
                style={{ cursor: mode === "view" ? "not-allowed" : "pointer" }}
                onClick={
                  mode === "view"
                    ? () => {}
                    : () => {
                        const fileInput = document.getElementById("imageInput");
                        fileInput?.click();
                      }
                }
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
          </div>
        </Form>
      </Modal>
    </>
  );
}

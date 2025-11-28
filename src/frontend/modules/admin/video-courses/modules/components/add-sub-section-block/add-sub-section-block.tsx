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
import { rgbaToHex } from "@/frontend/components/upload/utils";
import toast from "react-hot-toast";

const addBtnStyle = {
  background: "#01B067",
  padding: "0px 15px",
  borderRadius: "5px",
};

type AddSectionProps = {
  videoCourseId: string | string[] | undefined;
  moduleId: string | string[] | undefined;
  sectionId: string | string[] | undefined;
  subSectionId: string | string[] | undefined;
  data: any;
  mode: "add" | "edit";
  toggleModal: () => void;
  isModalOpen: boolean;
  refetch: () => void;
};

export const AddSubSectionBlock = ({
  videoCourseId,
  moduleId,
  sectionId,
  subSectionId,
  data,
  mode,
  toggleModal,
  isModalOpen,
  refetch,
}: AddSectionProps) => {
  const [form] = Form.useForm();
  const [image, setImage] = useState<File>();

  useEffect(() => {
    if (mode !== "edit") {
      return;
    }
    console.log(data);
    form.setFieldsValue(data);
    setImage(data.image);
  }, [data]);

  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>,
    setState: Dispatch<SetStateAction<File | undefined>>
  ) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setState(file);
    }

    // Reset the file input value after selection
    event.target.value = "";
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
      formData.append(`subSectionBlock[${key}]`, `${updatedValue}`);
    });

    if (image) formData.append("image", image);

    if (mode === "edit") {
      formData.append("note", data.note);
      formData.append("video", data.video);
      formData.append("questions", data.questions);
    }

    if (!videoCourseId || !moduleId || !sectionId || !subSectionId) return;
    try {
      mode === "edit"
        ? await axios.put(
            `/api/videoCourses/${videoCourseId}/modules/${moduleId}/section/${sectionId}/subSection/${subSectionId}/subSectionBlock/${data?._id}`,
            formData
          )
        : await axios.post(
            `/api/videoCourses/${videoCourseId}/modules/${moduleId}/section/${sectionId}/subSection/${subSectionId}/subSectionBlock`,
            formData
          );
      refetch();
      toggleModal();
      toast.success(
        `Block ${mode === "edit" ? "Updated" : "Added"} Successfully`
      );
    } catch (error) {
      console.error(error);
      toast.error(`Block ${mode === "edit" ? "Updation" : "Addition"} Failed`);
    } finally {
      setImage(undefined);
      form.resetFields();
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setImage(undefined);
    toggleModal();
  };

  return (
    <>
      <div className="flex justify-end w-full" />
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
            <div>
              <label className="font-medium">Name:</label>
              <FormItem name="name">
                <Input placeholder="Enter Name" />
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
                  <ColorPicker className="colorPickerBtn pl-0" />
                </FormItem>
              </div>
            </div>

            <div>
              <label className="font-medium">Upload Image:</label>

              <div
                // style={{ cursor: mode === "view" ? "not-allowed" : "pointer" }}
                onClick={() => {
                  const fileInput = document.getElementById("subImageInput");
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
                  id="subImageInput"
                  onChange={(event) => handleImageUpload(event, setImage)}
                  type="file"
                  className="!hidden"
                />
              </div>
            </div>
            {/* <div className="flex flex-col items-start justify-center mt-4">
              <label className="font-medium">Topic:</label>
              <FormItem name="topic" className="w-full">
                <Input placeholder="Enter Topic" />
              </FormItem>
            </div> */}
          </div>
        </Form>
      </Modal>
    </>
  );
};

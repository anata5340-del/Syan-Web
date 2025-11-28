"use client";

import { Button, ColorPicker, Input, Modal, Form } from "antd";
import { CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Dispatch, SetStateAction, useEffect } from "react";
import FormItem from "antd/es/form/FormItem";
import axios from "axios";
import toast from "react-hot-toast";

import { rgbaToHex } from "@/frontend/components/upload/utils";

const addBtnStyle = {
  background: "#01B067",
  padding: "0px 15px",
  borderRadius: "5px",
};

type AddModuleProps = {
  isModuleAvailable: boolean;
  videoCourseId: string;
  refetch: () => void;
  toggleModal: () => void;
  isModalOpen: boolean;
  setModuleMode: Dispatch<SetStateAction<"add" | "view" | "edit">>;
  mode: "add" | "view" | "edit";
  data: any;
};

export default function AddModule({
  isModuleAvailable,
  videoCourseId,
  refetch,
  toggleModal,
  isModalOpen,
  setModuleMode,
  mode,
  data,
}: AddModuleProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if ((mode === "view" || mode === "edit") && data) {
      form.setFieldsValue({
        name: data.name,
        color: data.color,
      });
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
      formData.append(`videoCourseModule[${key}]`, `${updatedValue}`);
    });

    if (!videoCourseId) return;

    if (mode === "edit") {
      if (!data?._id) return;
      try {
        await axios.put(
          `/api/videoCourses/${videoCourseId}/modules/${data._id}`,
          formData
        );
        refetch();
        toast.success("Video Course Module Updated Successfully");
      } catch (error) {
        console.error(error);
        toast.error("Video Course Module Update Failed");
      } finally {
        setModuleMode("add");
        form.resetFields();
        toggleModal();
      }
      return;
    }

    try {
      await axios.post(`/api/videoCourses/${videoCourseId}/modules`, formData);
      refetch();
      toast.success("Video Course Module Added Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Video Course Module Addition Failed");
    } finally {
      setModuleMode("add");
      form.resetFields();
      toggleModal();
    }
  };

  const handleAdd = () => {
    setModuleMode("add");
    toggleModal();
  };

  const handleCancel = () => {
    setModuleMode("add");
    form.resetFields();
    toggleModal();
  };

  return (
    <>
      <Button
        disabled={isModuleAvailable}
        type="primary"
        onClick={handleAdd}
        style={addBtnStyle}
        icon={<PlusOutlined />}
      ></Button>
      <Modal
        footer={[
          <div
            key="footer-content"
            className="flex gap-5 justify-end items-center py-7 px-9 bg-[#EDF7FF]"
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
          </div>
        </Form>
      </Modal>
    </>
  );
}

"use client";

import { Button, Modal, InputNumber, DatePicker, Form } from "antd";
import FormItem from "antd/es/form/FormItem";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function EditDate({ data, onUpdate }) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      startDate: data.startDate ? dayjs(data.startDate, "DD-MM-YYYY") : null,
      endDate: data.endDate ? dayjs(data.endDate, "DD-MM-YYYY") : null,
      price: data.price,
    });
  }, [data]);

  const [isPackageModalOpen, setPackageModalOpen] = useState(false);

  const showPackageModal = () => {
    setPackageModalOpen(true);
  };

  const packageModelOk = () => {
    const formData = form.getFieldsValue();
    const { startDate, endDate, price } = formData;
    const payload = {
      packageId: data._id,
      startDate: dayjs(startDate.$d).format("DD-MM-YYYY"),
      endDate: dayjs(endDate.$d).format("DD-MM-YYYY"),
      price,
    };
    onUpdate(payload);

    setPackageModalOpen(false);
  };

  const packageModelCancel = () => {
    setPackageModalOpen(false);
  };

  return (
    <>
      <img
        src="/assets/img/icon12.png"
        width={18}
        onClick={showPackageModal}
        className="m-auto cursor-pointer"
      />
      <Modal
        footer={[
          <div className="flex gap-5 justify-end py-5 px-10 bg-[#EDF7FF]">
            <Button
              className="saveBtn"
              key="submit"
              type="primary"
              onClick={packageModelOk}
            >
              Save
            </Button>
            <Button
              className="cancelBtn"
              key="cancel"
              type="primary"
              onClick={packageModelCancel}
            >
              Cancel
            </Button>
          </div>,
        ]}
        style={{
          top: 150,
          left: 500,
          backgroundColor: "#EDF7FF",
          paddingBottom: 0,
        }}
        open={isPackageModalOpen}
        closable={false}
        width={350}
        className="nameModal !left-0"
      >
        <Form form={form}>
          <div className="flex flex-col gap-2 px-10 pt-4 bg-[#EDF7FF] text-black font-bold">
            <label>Start from:</label>
            <div className="flex gap-5">
              <FormItem name="startDate" className="w-full">
                <DatePicker
                  placeholder="Enter Start Date"
                  className="editDateInput w-full"
                />
              </FormItem>
              {/* <Input placeholder="Enter Start Date" className="editDateInput" /> */}
              <img src="/assets/img/icon18.png" style={{ height: "35px" }} />
            </div>
            <label>End at:</label>
            <div className="flex gap-5">
              <FormItem name="endDate" className="w-full">
                <DatePicker
                  placeholder="Enter End Date"
                  className="editDateInput w-full"
                />
              </FormItem>

              {/* <Input placeholder="Enter End Date" className="editDateInput" /> */}
              <img src="/assets/img/icon18.png" style={{ height: "35px" }} />
            </div>
            <label>Price:</label>
            <FormItem name="price">
              <InputNumber
                placeholder="Enter Price"
                className="editDateInput w-full"
              />
            </FormItem>
          </div>
        </Form>
      </Modal>
    </>
  );
}

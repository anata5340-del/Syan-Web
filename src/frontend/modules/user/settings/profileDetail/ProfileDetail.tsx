"use client";

import { useForm } from "antd/es/form/Form";
import DetailProfile from "@/frontend/components/userProfile/detailProfile";
import { useEffect } from "react";
import { userStore } from "@/store/user/user";
import toast from "react-hot-toast";
import axios from "axios";
import { User } from "@/backend/types";

export default function ProfileDetail() {
  const [form] = useForm();

  const { user, setUser } = userStore();

  useEffect(() => {
    if (!user) return;
    form.setFieldsValue(user);
    if (!user.cnicBack) {
      form.setFieldValue("cnicBack", undefined);
    }
    if (!user.cnicFront) {
      form.setFieldValue("cnicFront", undefined);
    }
  });

  const handleOk = async () => {
    const formData = new FormData();
    const values = form.getFieldsValue();
    Object.keys(values).forEach((key) => {
      formData.append(`user[${key}]`, values[key]);
    });
    formData.append("user[password]", user?.password);
    formData.delete("user[image]");
    formData.delete("user[cnicFront]");
    formData.delete("user[cnicFront]");
    formData.delete("user[cnicBack]");
    formData.delete("user[cnicBack]");
    formData.delete("user[_id]");

    if (values.image?.file?.originFileObj)
      formData.append("user[image]", values?.image?.file?.originFileObj);
    if (values.cnicFront) formData.append("user[cnicFront]", values?.cnicFront);
    if (values.cnicBack) formData.append("user[cnicBack]", values?.cnicBack);
    try {
      const isEdit = values._id;
      const endPoint = isEdit ? `/api/users/${values._id}` : `/api/users`;
      const method = isEdit ? `PUT` : `POST`;
      const { data } = await axios<{ user: User }>(endPoint, {
        data: formData,
        method,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      form.setFieldsValue(data.user);
      setUser(data.user);
      toast.success(`User ${isEdit ? "Updated" : "Added"} Successfully`);
    } catch (error: any) {
      console.error(error);
      toast.error(
        `User Addition Failed Due To: ${error?.response?.data?.error?.message}`
      );
    }
  };

  // const deleteUser = async (id: string) => {
  //   try {
  //     await axios.delete(`/api/users/${id}`);
  //     toast.success("User deleted successfully");
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to delete user");
  //   }
  // };

  // const setFormFields = (id: string, isView = false) => {
  //   const user = dataSource.find((user) => user._id === id);
  //   if (!user) return;
  //   form.setFieldsValue(user);
  //   if (!user.cnicBack) {
  //     form.setFieldValue("cnicBack", undefined);
  //   }
  //   if (!user.cnicFront) {
  //     form.setFieldValue("cnicFront", undefined);
  //   }
  //   setIsModalOpen(true);
  // };

  return (
    <>
      <div className="flex flex-col mt-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl text-[#F9954B] font-medium">
            Profile Details
          </h2>
          <p>You have full control to manage your own account setting.</p>
        </div>
        <div>
          <DetailProfile form={form} onSave={handleOk} />
        </div>
      </div>
    </>
  );
}

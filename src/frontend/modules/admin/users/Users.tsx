"use client";

import { Button, Input, Modal } from "antd";
import {
  DownloadOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import UserTable from "@/frontend/components/table/userTable";
import React, { useEffect, useState } from "react";
import UserProfile from "@/frontend/components/userProfile/userProfile";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import toast from "react-hot-toast";
import { User } from "@/backend/types";
import { omit } from "lodash";

export default function Users() {
  const size: SizeType = "middle";
  const downloadBtnStyle = {
    background: "#FDC9CE",
    color: "#000",
  };
  const addBtnStyle = {
    background: "#01B067",
    padding: "16px 35px",
    borderRadius: "3px",
  };
  const [isAllUsersTab, setIsAllUsersTab] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState<User[]>([]);
  const [form] = useForm();

  const [filteredUsers, setFilteredUsers] = useState(dataSource);
  const [searchQuery, setSearchQuery] = useState("");

  const counts = filteredUsers.reduce(
    (acc, user) => {
      if (user.isDeleted) {
        acc.deletedUsers++;
      } else {
        acc.activeUsers++;
      }
      return acc;
    },
    { activeUsers: 0, deletedUsers: 0 } // Initial counts
  );

  useEffect(() => {
    const filtered = dataSource?.filter((user) => {
      const matchesQuery =
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesQuery;
    });
    setFilteredUsers(filtered);
  }, [searchQuery, dataSource]);

  const onCreateHandler = () => {
    setIsModalOpen(true);
    form.resetFields();
  };

  const recoverUser = async (id: string) => {
    try {
      await axios.patch(`/api/users/${id}`);
      setDataSource((previous) =>
        previous.map((user) =>
          user._id === id ? { ...user, isDeleted: false } : user
        )
      );
      toast.success("User recovered successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to recover user");
    }
  };
  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`/api/users/${id}`);
      setDataSource((previous) =>
        previous.map((user) =>
          user._id === id ? { ...user, isDeleted: true } : user
        )
      );
      toast.success("User deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    }
  };

  const updateUserStatus = async (
    id: string,
    status: "pending" | "approved" | "rejected"
  ) => {
    try {
      console.log("Sending status update request:", { id, status });
      const response = await axios.patch(
        `/api/users/${id}/status`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Status update response:", response.data);
      setDataSource((previous) =>
        previous.map((user) => (user._id === id ? { ...user, status } : user))
      );
      toast.success(`User status updated to ${status} successfully`);
    } catch (error: any) {
      console.error("Error updating user status:", error);
      console.error("Error response data:", error?.response?.data);
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update user status";
      toast.error(errorMessage);
    }
  };

  const setFormFields = (id: string, isView = false) => {
    const user = dataSource.find((user) => user._id === id);
    if (!user) return;
    form.setFieldsValue(user);
    if (!user.cnicBack) {
      form.setFieldValue("cnicBack", undefined);
    }
    if (!user.cnicFront) {
      form.setFieldValue("cnicFront", undefined);
    }
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const formData = new FormData();
    const values = form.getFieldsValue();

    // Add all form values to formData
    Object.keys(values).forEach((key) => {
      formData.append(`user[${key}]`, values[key]);
    });

    // Remove unnecessary fields
    formData.delete("user[image]");
    formData.delete("user[cnicFront]");
    formData.delete("user[cnicBack]");
    formData.delete("user[_id]");

    // Append files if present
    if (values.image?.file?.originFileObj) {
      formData.append("user[image]", values.image.file.originFileObj);
    }
    if (values.cnicFront?.file?.originFileObj) {
      formData.append("user[cnicFront]", values.cnicFront.file.originFileObj);
    }
    if (values.cnicBack?.file?.originFileObj) {
      formData.append("user[cnicBack]", values.cnicBack.file.originFileObj);
    }

    try {
      const isEdit = values._id;

      // Check email availability only for new users or when email is updated
      const originalUser = dataSource.find((user) => user._id === values._id);
      const originalEmail = originalUser?.email;

      if (!isEdit || (originalEmail && originalEmail !== values.email)) {
        const emailCheckResponse = await axios.post("/api/users/check-email", {
          email: values.email,
        });

        if (!emailCheckResponse.data.available) {
          toast.error(
            "The email is already in use. Please use a different email."
          );
          return; // Stop further execution if the email is not available
        }
      }

      // Determine endpoint and method
      const endPoint = isEdit ? `/api/users/${values._id}` : `/api/users`;
      const method = isEdit ? `PUT` : `POST`;

      // Make the request to add or update the user
      const { data } = await axios<{ user: User }>(endPoint, {
        data: formData,
        method,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update the table data source
      setDataSource((previous) => {
        if (isEdit) {
          return previous.map((user) =>
            user._id === values._id ? data.user : user
          );
        } else {
          return [...previous, data.user];
        }
      });

      // Reset form and close the modal
      form.resetFields();
      toast.success(`User ${isEdit ? "Updated" : "Added"} Successfully`);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error(error);
      toast.error(
        `User Addition Failed Due To: ${error?.response?.data?.error?.message}`
      );
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    axios
      .get("/api/users")
      .then((res) => {
        setDataSource(res.data.users);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to fetch users");
      });
  }, []);

  return (
    <>
      <div className="flex justify-between align-middle mt-10">
        <div>
          <h2 className="text-3xl font-medium text-colorblack">
            List of all Users
          </h2>
        </div>
        <div className="flex gap-10">
          <Input
            className="userSearch"
            onChange={(e) => {
              const value = e.target.value;
              setSearchQuery(value);
            }}
            style={{ width: 400 }}
            prefix={<SearchOutlined style={{ fontSize: "20px" }} />}
            suffix={"Search"}
          />
          <Button
            type="primary"
            style={downloadBtnStyle}
            shape="round"
            icon={<DownloadOutlined />}
            size={size}
          >
            Download CSV
          </Button>
          <Button
            onClick={onCreateHandler}
            type="primary"
            style={addBtnStyle}
            icon={<PlusOutlined />}
          ></Button>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex mt-4 text-white gap-1">
          <div
            id="allUsers"
            className="w-2/4 bg-colorred rounded-t-xl flex items-center justify-center h-16 px-4 cursor-pointer"
            onClick={() => setIsAllUsersTab(true)}
          >
            <div className="flex-grow flex justify-center text-2xl">
              All Users
            </div>
            <span>{counts.activeUsers}</span>
          </div>
          <div
            id="removedUsers"
            className="w-2/4 bg-colorblue rounded-t-xl flex items-center justify-center h-16 px-4 cursor-pointer"
            onClick={() => setIsAllUsersTab(false)}
          >
            <div className="flex-grow flex justify-center text-2xl">
              Removed Users
            </div>
            <span>{counts.deletedUsers}</span>
          </div>
        </div>
        <div>
          <UserTable
            isAllUsersTab={isAllUsersTab}
            dataSource={filteredUsers}
            recoverUser={recoverUser}
            deleteUser={deleteUser}
            setFormFields={setFormFields}
            updateUserStatus={updateUserStatus}
          />
        </div>
      </div>
      <Modal
        destroyOnClose
        open={isModalOpen}
        footer={[
          <div
            key="user-modal-footer"
            className="flex gap-5 justify-end py-5 px-10"
          >
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
        onOk={handleOk}
        closable={false}
        width={600}
      >
        <UserProfile form={form} />
      </Modal>
    </>
  );
}

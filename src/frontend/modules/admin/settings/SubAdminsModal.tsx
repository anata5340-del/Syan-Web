import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Space, Input, Checkbox } from "antd";
import { CloseOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import toast from "react-hot-toast";

const SubAdminsModal = ({ isModalVisible, setIsModalVisible }) => {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isAddEditModalVisible, setIsAddEditModalVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [currentSubAdmin, setCurrentSubAdmin] = useState({
    email: "",
    username: "",
    password: "",
    excludedModules: [""],
  });

  const [subAdmins, setSubAdmins] = useState([]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Fetch all sub-admins when the modal is opened
  useEffect(() => {
    if (isModalVisible) {
      fetchSubAdmins();
    }
  }, [isModalVisible]);

  const fetchSubAdmins = async () => {
    try {
      const { data } = await axios.get("/api/admins");
      setSubAdmins(data);
    } catch (error) {
      console.error("Failed to fetch sub-admins:", error.message);
      toast.error("Failed to fetch sub-admins");
    }
  };

  const handleAddEdit = async () => {
    try {
      if (selectedKey) {
        // Update sub-admin
        await axios.put(`/api/admins?id=${selectedKey}`, currentSubAdmin);
        toast.success("Sub-admin updated successfully!");
      } else {
        // Create new sub-admin
        await axios.post("/api/admins", currentSubAdmin);
        toast.success("Sub-admin added successfully!");
      }
      fetchSubAdmins();
      setIsAddEditModalVisible(false);
      resetCurrentSubAdmin();
    } catch (error) {
      console.error("Failed to add/edit sub-admin:", error.message);
      toast.error(
        error.response?.data?.message || "Failed to add/edit sub-admin"
      );
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/admins?id=${selectedKey}`);
      toast.success("Sub-admin deleted successfully!");
      fetchSubAdmins();
      setIsDeleteModalVisible(false);
      setSelectedKey(null);
    } catch (error) {
      console.error("Failed to delete sub-admin:", error.message);
      toast.error("Failed to delete sub-admin");
    }
  };

  const resetCurrentSubAdmin = () => {
    setCurrentSubAdmin({
      email: "",
      username: "",
      password: "",
      excludedModules: [],
    });
    setSelectedKey(null);
  };

  const columns = [
    {
      title: "User Name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "Role",
      key: "role",
      render: (_, record) =>
        record.excludedModules.length !== 0 ? "Partial" : "Full",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => {
              setSelectedKey(record._id);
              setCurrentSubAdmin({
                email: record.email,
                username: record.username,
                password: record.password,
                excludedModules: record.excludedModules,
              });
              setIsAddEditModalVisible(true);
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            type="link"
            danger
            onClick={() => {
              setSelectedKey(record._id);
              setIsDeleteModalVisible(true);
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Modal
        title={
          <div style={{ justifyContent: "space-between" }}>
            <div className="flex pt-2 mx-5">
              <h2 className="text-xl">Add & Manage Sub Admin Users</h2>
              <Button
                type="primary"
                style={{
                  backgroundColor: "#F27D24",
                }}
                className="ml-auto rounded-3xl"
                onClick={() => {
                  setIsAddEditModalVisible(true);
                  setCurrentSubAdmin({
                    email: "",
                    username: "",
                    password: "",
                    excludedModules: [],
                  });
                }}
              >
                + Add
              </Button>
              <Button
                icon={<CloseOutlined />}
                onClick={handleCancel}
                className="rounded-3xl bg-[#f1f1f1] ml-2"
                type="text"
              >
                Close
              </Button>
            </div>
            <p className="font-normal mx-5">
              Add admin members to manage SYAN Academy.
            </p>
          </div>
        }
        open={isModalVisible}
        closable={false}
        onCancel={handleCancel}
        footer={null}
        width={800}
        styles={{
          body: {
            padding: "20px", // Padding for the modal body
            borderRadius: "0.25rem",
          },
        }}
      >
        <Table
          columns={columns}
          dataSource={subAdmins}
          bordered
          pagination={false}
          style={{
            border: "1px solid #EDEDED",
          }}
        />
      </Modal>
      {/* Delete Modal */}
      <Modal
        title={
          <div
            style={{
              padding: "0.5rem",
              backgroundColor: "red",
              textAlign: "center",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
            }}
            className=" rounded-t-md"
          >
            Are You Sure?
          </div>
        } // Custom styling for title
        open={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        closeIcon={false}
        footer={[
          <div className="p-2 pt-0 flex justify-center">
            <button
              className="py-2 px-4  bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200"
              key="cancel"
              onClick={() => setIsDeleteModalVisible(false)}
            >
              Cancel
            </button>
            <button
              className="py-2 px-4 ml-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
              key="submit"
              onClick={() => handleDelete()}
            >
              Confirm
            </button>
          </div>,
        ]}
      ></Modal>
      {/* Add/Edit Modal */}
      <Modal
        title={<h3 className="text-lg">Add A Sub-Admin</h3>}
        open={isAddEditModalVisible}
        onCancel={() => setIsAddEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsAddEditModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            style={{ backgroundColor: "#F27D24" }}
            onClick={handleAddEdit}
          >
            Add & Save
          </Button>,
        ]}
        width={700}
        styles={{
          header: {
            padding: "2em",
            paddingTop: "1em",
            paddingBottom: "0em",
          },
          body: {
            padding: "2em",
            paddingTop: "0",
            paddingBottom: "1em",
          },
          footer: {
            padding: "2em",
            paddingTop: "0",
            display: "flex",
            justifyContent: "center",
          },
        }}
      >
        <div className="modal-content">
          <div className="flex gap-4">
            <div style={{ width: "50%" }}>
              <label>Email</label>
              <Input
                value={currentSubAdmin.email}
                onChange={(e) =>
                  setCurrentSubAdmin({
                    ...currentSubAdmin,
                    email: e.target.value,
                  })
                }
              />
            </div>
            <div style={{ width: "50%" }}>
              <label>User Name</label>
              <Input
                value={currentSubAdmin.username}
                onChange={(e) =>
                  setCurrentSubAdmin({
                    ...currentSubAdmin,
                    username: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div style={{ marginTop: "1em", width: "50%" }}>
              <label>Password</label>
              <Input.Password
                type="password"
                value={currentSubAdmin.password}
                onChange={(e) =>
                  setCurrentSubAdmin({
                    ...currentSubAdmin,
                    password: e.target.value,
                  })
                }
              />
            </div>
            <div style={{ marginTop: "1em", width: "50%" }}>
              <label>
                Exclude Modules{" "}
                <span className="text-xs text-gray-700">
                  (Leave empty for full access)
                </span>
              </label>
              <div className="h-8 flex items-center">
                <Checkbox
                  checked={currentSubAdmin.excludedModules.includes("Users")}
                  onChange={(e) => {
                    const modules = currentSubAdmin.excludedModules;
                    setCurrentSubAdmin({
                      ...currentSubAdmin,
                      excludedModules: e.target.checked
                        ? [...modules, "Users"]
                        : modules.filter((mod) => mod !== "Users"),
                    });
                  }}
                >
                  Users
                </Checkbox>
                <Checkbox
                  checked={currentSubAdmin.excludedModules.includes("Packages")}
                  onChange={(e) => {
                    const modules = currentSubAdmin.excludedModules;
                    setCurrentSubAdmin({
                      ...currentSubAdmin,
                      excludedModules: e.target.checked
                        ? [...modules, "Packages"]
                        : modules.filter((mod) => mod !== "Packages"),
                    });
                  }}
                >
                  Packages
                </Checkbox>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SubAdminsModal;

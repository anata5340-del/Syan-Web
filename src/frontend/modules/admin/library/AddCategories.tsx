"use client";

import { Modal, Input, Button, Table } from "antd";
import { useState } from "react";
import axios from "axios";
import DeleteNotification from "../../../components/notifications/DeleteNotification";

type Category = {
  _id: string;
  name: string;
};

type AddCategoriesProps = {
  categories: Category[];
  isModalOpen: boolean;
  toggleModal: () => void;
  refetch: () => void;
};

export default function AddCategories({
  categories,
  isModalOpen,
  toggleModal,
  refetch,
}: AddCategoriesProps) {
  const [newCategory, setNewCategory] = useState<string>("");

  const handleAddCategory = async () => {
    try {
      await axios.post("/api/categories", {
        category: { name: newCategory },
      });
      toggleModal();
      refetch();
      setNewCategory("");
    } catch (error: any) {
      console.error(
        "Error adding category:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.error || "Failed to add category");
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      await axios.delete(`/api/categories/${categoryId}`, {
        // Pass `id` in the request body
      });
      toggleModal();
      refetch();
    } catch (error: any) {
      console.error(
        "Error deleting category:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.error || "Failed to delete category"
      );
    }
  };

  const columns = [
    {
      title: "Category Id",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Remove",
      key: "8",
      render: (value: any, record: any) => (
        <DeleteNotification
          onDelete={() => {
            deleteCategory(record._id);
          }}
        />
      ),
      align: "center",
    },
  ];

  return (
    <Modal
      title={
        <div
          style={{
            backgroundColor: "#076BB4", // Custom background color for title
            padding: "15px 20px",
            textAlign: "center",
            color: "white", // White text for better contrast
            borderRadius: "5px 5px 0 0", // Rounded top corners
          }}
        >
          Manage Categories
        </div>
      }
      centered
      open={isModalOpen}
      onCancel={toggleModal}
      footer={null}
      width={600}
    >
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center gap-4">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
          />
          <Button
            type="primary"
            onClick={handleAddCategory}
            disabled={!newCategory.trim()}
          >
            Add
          </Button>
        </div>
        <Table
          dataSource={categories}
          columns={columns}
          rowKey="_id"
          pagination={false}
        />
      </div>
    </Modal>
  );
}

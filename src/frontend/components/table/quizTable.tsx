"use client";

import { Button, Table } from "antd";

import { PlusOutlined } from "@ant-design/icons";
import DeleteNotification from "../notifications/DeleteNotification";
import Link from "next/link";
// import Link from "next/link";

const addBtnStyle = {
  background: "#01B067",
  padding: "16px 35px",
  borderRadius: "3px",
};

export default function QuizTable({
  dataSource,
  onDelete,
  onAdd,
  onView,
  onEdit,
}) {
  const columns = [
    {
      title: "Id",
      dataIndex: "displayId",
      key: "1",
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "2",
      width: 200,
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "updatedAt",
      key: "3",
      align: "center",
      width: 70,
      render: (value: any) => {
        return <div>{new Date(value).toLocaleDateString()}</div>;
      },
    },
    {
      title: "Add Data",
      dataIndex: "questions",
      key: "4",
      align: "center",
      width: 200,
      render: (value: any, record: any) => {
        return (
          <Link href="/admin/quiz/[id]" as={`/admin/quiz/${record?._id}`}>
            <Button
              type="primary"
              style={addBtnStyle}
              icon={<PlusOutlined />}
            ></Button>
          </Link>
        );
      },
    },
    {
      title: "Edit",
      key: "5",
      width: 20,
      align: "center",
      render: (value: any, record: any) => {
        return (
          <img
            style={{ cursor: "pointer" }}
            src="/assets/img/icon12.png"
            width={18}
            className="m-auto"
            onClick={() => onEdit(record)}
          />
        );
      },
    },
    {
      title: "View",
      key: "6",
      width: 20,
      align: "center",
      render: (value: any, record: any) => {
        return (
          <img
            style={{ cursor: "pointer" }}
            src="/assets/img/icon13.png"
            width={18}
            className="m-auto"
            onClick={() => onView(record)}
          />
        );
      },
    },
    {
      title: "Delete",
      key: "6",
      align: "center",
      width: 30,
      render: (value: any, record: any) => {
        return <DeleteNotification onDelete={() => onDelete(record._id)} />;
      },
    },
  ];

  return <Table dataSource={dataSource} columns={columns} bordered={true} />;
}

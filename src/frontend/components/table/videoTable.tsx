"use client";

import { Button, Table, Switch } from "antd";

import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import DeleteNotification from "../notifications/DeleteNotification";

export default function VideoTable({ dataSource, onDelete, onEdit, onView }) {
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
    // {
    //   title: "Date",
    //   dataIndex: "updatedAt",
    //   key: "3",
    //   align: "center",
    //   width: 70,
    // },
    {
      title: "Add Data",
      render: (value: any, record: any) => {
        return (
          <Link href={`videoCourses/modules?videoCourseId=${record?._id}`}>
            <Button
              type="primary"
              style={{
                background: "#01B067",
                padding: "16px 35px",
                borderRadius: "3px",
              }}
              icon={<PlusOutlined />}
            ></Button>
          </Link>
        );
      },
      key: "4",
      align: "center",
      width: 200,
    },
    {
      title: "Edit",
      render: (value: any, record: any) => {
        return (
          <img
            style={{ cursor: "pointer" }}
            src="/assets/img/icon12.png"
            width={18}
            className="m-auto"
            onClick={() => onEdit(record._id)}
          />
        );
      },
      key: "5",
      width: 20,
      align: "center",
    },
    {
      title: "View",
      render: (value: any, record: any) => {
        return (
          <img
            style={{ cursor: "pointer" }}
            src="/assets/img/icon13.png"
            width={18}
            className="m-auto"
            onClick={() => onView(record._id)}
          />
        );
      },
      key: "6",
      width: 20,
      align: "center",
    },
    {
      title: "Delete",
      key: "7",
      width: 20,
      align: "center",
      render: (value: any, record: { _id: string }) => {
        return <DeleteNotification onDelete={() => onDelete(record._id)} />;
      },
    },
  ];

  return <Table dataSource={dataSource} columns={columns} bordered={true} />;
}

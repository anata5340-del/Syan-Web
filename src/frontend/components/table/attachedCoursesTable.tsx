"use client";

import { Table } from "antd";
import DeleteNotification from "../notifications/DeleteNotification";

export default function AttachedCoursesTable({
  dataSource,
  onDelete,
}: {
  dataSource: any[];
  onDelete: (courseId: string) => void;
}) {
  const columns = [
    {
      title: "Id",
      dataIndex: "displayId",
      key: "1",
      width: "250px",
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "2",
      width: "200px",
      align: "center",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "3",
      width: "250px",
      align: "center",
      render: (value: string) => new Date(value).toISOString().split("T")[0], // Formats the date
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "4",
      width: "150px",
      align: "center",
    },
    {
      title: "Delete",
      render: (value: any, record: any) => {
        return <DeleteNotification onDelete={() => onDelete(record._id)} />;
      },
      key: "5",
      width: "100px",
      align: "center",
    },
  ];

  return (
    <>
      <Table
        style={{ gap: "20px" }}
        className="attachedCoursesTable"
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
    </>
  );
}

"use client";

import { Checkbox, Table } from "antd";
import DeleteNotification from "../notifications/DeleteNotification";

const dataSource = [
  {
    key: "1",
    id: "1001",
    coursename: "FCCP",
  },
  {
    key: "2",
    id: "1003",
    coursename: "FCCP",
  },
];

export default function AddCoursesTable({
  dataSource,
  onSelect,
}: {
  dataSource: any[];
  onSelect: (id: string, isChecked: boolean) => void;
}) {
  const columns = [
    {
      title: "Id",
      dataIndex: "displayId",
      key: "1",
      width: "100px",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "2",
      width: "250px",
      align: "center",
    },
    {
      title: "Add",
      dataIndex: "isChecked",
      render: (value: boolean, record: any) => {
        return (
          <Checkbox
            checked={value}
            onChange={(e) => onSelect(record._id, e.target.checked)}
          ></Checkbox>
        );
      },
      key: "3",
      width: 20,
      align: "center",
    },
  ];

  return <Table dataSource={dataSource} columns={columns} pagination={false} />;
}

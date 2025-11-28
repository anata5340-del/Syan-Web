"use client";

import { Checkbox, Table } from "antd";

export default function AddQuestionsTable({ dataSource, onSelect }) {
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
      width: "150px",
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "updatedAt",
      key: "3",
      width: "150px",
      align: "center",
      render: (value: string) => new Date(value).toISOString().split("T")[0], // Formats the date
    },
    {
      title: "Category",
      dataIndex: "categories",
      key: "4",
      width: "250px",
      align: "center",
      render: (value: any[], record: any[]) => (
        <div>
          {value.map((category, index) => {
            return (
              <span key={`${record._id}-${index}`}>
                {`${index > 0 ? ", " : ""}${category.name}`}
              </span>
            );
          })}
        </div>
      ),
    },
    {
      title: "Edit",
      dataIndex: "isChecked",
      width: 20,
      align: "center",
      render: (value: any, record: any) => {
        return (
          <Checkbox
            checked={value}
            onChange={(e) => onSelect(record._id, e.target.checked)}
          />
        );
      },
      key: "5",
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      rowKey={(record) => record._id}
    />
  );
}

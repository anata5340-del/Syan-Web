"use client";

import { Checkbox, Table } from "antd";

export default function AddQuizTable({ dataSource, onSelect }) {
  const columns = [
    {
      title: "Id",
      dataIndex: "displayId",
      key: "1",
      width: "100px",
    },
    {
      title: "Quiz Name",
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
      render: (value: any) => {
        return <div>{new Date(value).toLocaleDateString()}</div>;
      },
    },
    {
      title: "Category",
      dataIndex: "categories",
      key: "4",
      width: "250px",
      align: "center",
      render: (value: any[]) => (
        <div>
          {value.map((category, index) => {
            return (
              <span key={category}>{`${
                index === 0 ? category.name : " ," + category.name
              }`}</span>
            );
          })}
        </div>
      ),
    },
    {
      title: "Edit",
      dataIndex: "isChecked",
      render: (value: any, record: any) => {
        return (
          <Checkbox
            checked={value}
            onChange={(e) => onSelect(record._id, e.target.checked)}
          />
        );
      },
      key: "5",
      width: 20,
      align: "center",
    },
  ];

  return (
    <>
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </>
  );
}

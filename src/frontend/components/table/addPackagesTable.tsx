"use client";

import { Button, Checkbox, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { start } from "repl";

export default function AddPackagesTable({ dataSource, onSelectDeselect }) {
  const columns = [
    {
      title: "Id",
      dataIndex: "displayId",
      key: "1",
      width: "20px",
    },
    {
      title: "Packages",
      dataIndex: "name",
      key: "2",
      width: 40,
    },
    // {
    //   title: "Start from",
    //   dataIndex: "startfrom",
    //   key: "3",
    //   width: 40,
    // },
    // {
    //   title: "End at",
    //   dataIndex: "endat",
    //   key: "4",
    //   width: 40,
    // },
    // {
    //   title: "Price",
    //   dataIndex: "price",
    //   key: "4",
    //   width: 40,
    // },
    {
      title: "Add",
      dataIndex: "isChecked",
      key: "6",
      width: 20,
      align: "center",
      render: (value: any, record: any) => (
        <Checkbox
          checked={value}
          onChange={(e) => onSelectDeselect(record._id, e.target.checked)}
        />
      ),
    },
  ];

  return <Table dataSource={dataSource} columns={columns} pagination={false} />;
}

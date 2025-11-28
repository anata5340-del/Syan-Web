"use client";

import { Table } from "antd";
import { UsergroupDeleteOutlined } from "@ant-design/icons";
import Link from "next/link";
import DeleteNotification from "../notifications/DeleteNotification";
import AttachedCourses from "../packages/attachedCourses/attachedCourses";
import { daysToWeeks } from "date-fns";

export default function PackageTable({
  dataSource,
  onDelete,
  onView,
  onUpdate,
}) {
  const columns = [
    {
      title: "ID",
      dataIndex: "displayId",
      key: "1",
      width: 100,
      align: "center",
    },
    {
      title: "Package",
      dataIndex: "name",
      key: "2",
      width: 300,
      align: "center",
    },
    // {
    //   title: "Price",
    //   dataIndex: "price",
    //   key: "3",
    //   width: 300,
    //   align: "center",
    // },
    {
      title: "Date",
      dataIndex: "updatedAt",
      key: "4",
      width: 180,
      align: "center",
      render: (value: any) => new Date(value).toISOString().split("T")[0],
    },
    {
      title: "Attached Courses",
      key: "5",
      width: 200,
      align: "center",
      render: (value: any, record: any) => (
        <Link href={""} onClick={() => onView(record._id)}>
          View
        </Link>
      ),
    },
    {
      title: "Edit",
      key: "6",
      align: "center",
      width: 30,
      render: (value: any, record: any) => {
        return (
          <img
            style={{ cursor: "pointer" }}
            src="/assets/img/icon12.png"
            width={18}
            className="m-auto"
            onClick={() => onUpdate(record._id, record.name)}
          />
        );
      },
    },
    {
      title: "Delete",
      key: "7",
      align: "center",
      width: 30,
      render: (value: any, record: any) => (
        <DeleteNotification onDelete={() => onDelete(record._id)} />
      ),
    },
    // {
    //   title: <UsergroupDeleteOutlined />,
    //   key: "8",
    //   align: "center",
    //   width: 40,
    //   render: (_record: any) => {
    //     return <>2045</>;
    //   },
    // },
  ];

  return (
    <>
      <Table dataSource={dataSource} columns={columns} bordered={true} />
    </>
  );
}

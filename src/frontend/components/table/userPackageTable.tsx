"use client";

import { Switch, Table } from "antd";
import AttachedPackages from "../packages/attachedPackages/attachedPackages";
import DeleteNotification from "../notifications/DeleteNotification";
import Link from "next/link";
import UserActiveInActiveNotification from "../notifications/UserActiveInactiveNotification";

export default function UserPackageTable({
  dataSource,
  onDelete,
  onView,
  onActive,
}) {
  // const condition = props.condition;

  const columns = [
    {
      title: "Id",
      dataIndex: "displayId",
      key: "1",
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "firstName",
      key: "2",
      width: 180,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "3",
      width: 150,
    },
    {
      title: "Date",
      dataIndex: "updatedAt",
      key: "4",
      width: 150,
      render: (value: any) => new Date(value).toISOString().split("T")[0],
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "5",
      width: 100,
    },
    {
      title: "Packages",
      key: "6",
      width: 20,
      align: "center",
      render: (record: any) => (
        <Link href={""} onClick={() => onView(record._id)}>
          View
        </Link>
      ),
    },
    {
      title: "Job Status",
      dataIndex: "jobStatus",
      key: "7",
      width: 100,
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "8",
      width: 220,
      align: "center",
      render: (value: any, record: any) => {
        console.log("value:", value);
        console.log("record:", record);
        return (
          <UserActiveInActiveNotification
            isActive={value}
            onActive={(activeStatus: boolean) =>
              onActive(record?._id, activeStatus)
            }
          />
        );
      },
    },
    // {
    //   title: "Remove",
    //   render: (value: any, record: any) => {
    //     return <DeleteNotification onDelete={() => onDelete(record?._id)} />;
    //   },
    //   key: "9",
    //   width: 20,
    //   align: "center",
    // },
  ];

  return (
    <Table
      className="userPackageTable"
      dataSource={dataSource}
      columns={columns}
      bordered={true}
    />
  );
}

"use client";

import { Switch, Table } from "antd";
import DeleteNotification from "../notifications/DeleteNotification";
import EditDate from "../notifications/editDate";
import UserActiveInActiveNotification from "../notifications/UserActiveInactiveNotification";

export default function AttachedPackagesTable({
  dataSource,
  onActive,
  onDelete,
  onUpdate,
}) {
  const columns = [
    {
      title: "Id",
      dataIndex: "displayId",
      key: "1",
      width: 100,
    },
    {
      title: "Packages",
      dataIndex: "name",
      key: "2",
      width: 100,
    },
    {
      title: "Start from",
      dataIndex: "startDate",
      key: "3",
      width: 100,
    },
    {
      title: "End at",
      dataIndex: "endDate",
      key: "4",
      width: 100,
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "5",
      width: 120,
      render: (value: any, record: any) => {
        return (
          <UserActiveInActiveNotification
            isActive={value === true ? true : false}
            onActive={(activeStatus: boolean) =>
              onActive(record?._id, activeStatus)
            }
          />
        );
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "6",
      width: 80,
      render: (value: any) => value && `PKR ${value}`,
    },
    {
      title: "Edit",
      key: "7",
      render: (value: any, record: any) => {
        return <EditDate data={record} onUpdate={onUpdate} />;
      },
      align: "center",
      width: 50,
    },
    {
      title: "Remove",
      key: "8",
      render: (value: any, record: any) => (
        <DeleteNotification onDelete={() => onDelete(record._id)} />
      ),
      align: "center",
    },
  ];

  return (
    <Table
      className="attachedPackagesTable"
      dataSource={dataSource}
      columns={columns}
      pagination={false}
    />
  );
}

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { User } from "@/backend/types";
import { Button, Table } from "antd";
import { ColumnGroupType, ColumnType } from "antd/es/table";

export default function UserTable(props: {
  isAllUsersTab: boolean;
  dataSource: User[];
  recoverUser: (id: string) => void;
  deleteUser: (id: string) => void;
  setFormFields: (id: string, isView?: boolean) => void;
  updateUserStatus?: (id: string, status: "pending" | "approved" | "rejected") => void;
}) {
  const { isAllUsersTab, dataSource, recoverUser, deleteUser, setFormFields, updateUserStatus } =
    props;

  const columns: (ColumnGroupType<User> | ColumnType<User>)[] = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "2",
      width: 180,
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "2",
      width: 180,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "3",
      width: 100,
    },
    {
      title: "Institute",
      dataIndex: "institute",
      key: "5",
      width: 200,
    },
    {
      title: "City",
      dataIndex: "city",
      key: "6",
      width: 100,
    },
    {
      title: "Job Status",
      dataIndex: "jobStatus",
      key: "7",
      width: 100,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "8",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        const statusColors: Record<string, string> = {
          pending: "#FFA500",
          approved: "#52c41a",
          rejected: "#ff4d4f",
        };
        const statusLabels: Record<string, string> = {
          pending: "Pending",
          approved: "Approved",
          rejected: "Rejected",
        };
        return (
          <span
            style={{
              color: statusColors[status] || "#000",
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          >
            {statusLabels[status] || status || "Pending"}
          </span>
        );
      },
    },
    ...(isAllUsersTab
      ? [
          {
            title: "Status Actions",
            render: (_record: any) => {
              return (
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                  <Button
                    size="small"
                    type={_record.status === "approved" ? "primary" : "default"}
                    onClick={() => updateUserStatus?.(_record._id, "approved")}
                    style={{
                      backgroundColor: _record.status === "approved" ? "#52c41a" : undefined,
                      borderColor: _record.status === "approved" ? "#52c41a" : undefined,
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    size="small"
                    type={_record.status === "pending" ? "primary" : "default"}
                    onClick={() => updateUserStatus?.(_record._id, "pending")}
                    style={{
                      backgroundColor: _record.status === "pending" ? "#FFA500" : undefined,
                      borderColor: _record.status === "pending" ? "#FFA500" : undefined,
                    }}
                  >
                    Pending
                  </Button>
                  <Button
                    size="small"
                    type={_record.status === "rejected" ? "primary" : "default"}
                    danger
                    onClick={() => updateUserStatus?.(_record._id, "rejected")}
                    style={{
                      backgroundColor: _record.status === "rejected" ? "#ff4d4f" : undefined,
                      borderColor: _record.status === "rejected" ? "#ff4d4f" : undefined,
                    }}
                  >
                    Reject
                  </Button>
                </div>
              );
            },
            key: "status-actions",
            width: 200,
          },
          {
            title: "Edit",
            render: (_record: any) => {
              return (
                <>
                  <img
                    style={{ cursor: "pointer" }}
                    onClick={() => setFormFields(_record._id)}
                    src="/assets/img/icon12.png"
                    width={18}
                    className="m-auto"
                  />
                </>
              );
            },
            key: "9",
            width: 20,
          },
        ]
      : []),
    {
      title: "View",
      render: (_record: any) => {
        return (
          <>
            <img
              style={{ cursor: "pointer" }}
              onClick={() => {
                setFormFields(_record._id, true);
              }}
              src="/assets/img/icon13.png"
              width={18}
              className="m-auto"
            />
          </>
        );
      },
      key: "10",
      width: 20,
    },
    ...(isAllUsersTab
      ? [
          {
            title: "Delete",
            render: (_record: any) => {
              return (
                <>
                  <img
                    style={{ cursor: "pointer" }}
                    onClick={() => deleteUser(_record._id)}
                    src="/assets/img/icon14.png"
                    width={18}
                    className="m-auto"
                  />
                </>
              );
            },
            key: "11",
            width: 20,
          },
        ]
      : []),
    ...(isAllUsersTab
      ? []
      : [
          {
            title: "Recover",
            render: (_record: any) => {
              return (
                <>
                  <Button
                    onClick={() => {
                      recoverUser(_record._id);
                    }}
                    className="recoverBtn"
                  >
                    Recover
                  </Button>
                </>
              );
            },
            key: "12",
            width: 20,
          },
        ]),
  ];

  return (
    <>
      <Table
        dataSource={dataSource.filter(
          (user) => user.isDeleted !== isAllUsersTab
        )}
        columns={columns}
        bordered={true}
      />
    </>
  );
}

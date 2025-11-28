"use client";

import { Table } from "antd";
import DeleteNotification from "../notifications/DeleteNotification";
import { formatDateToDDMMYYYY } from "@/lib/utils/dateHelper";
import { ColumnType } from "antd/es/table";
import { Category, Note, Question, Video } from "@/backend/types";

type DataSource = {
  _id: string;
  name: string;
  date: string;
  category?: string;
};

type Props = {
  dataSource: DataSource[] | Note[] | Video[] | Question[];
  onDelete: (id: string) => void;
  showEditAndView?: true | false;
  onEdit?: (record: DataSource) => void; // Accept record as a parameter
  onView?: (record: DataSource) => void; // Accept record as a parameter
};

function ContentTable({
  dataSource,
  onDelete,
  showEditAndView = true,
  onEdit,
  onView,
}: Props) {
  const columns: ColumnType<{
    _id: string;
    name: string;
    date: string;
    category: string;
  }>[] = [
    {
      title: "Id",
      dataIndex: "displayId",
      key: "1",
      align: "center",
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "2",
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "updatedAt",
      key: "3",
      align: "center",
      width: 150,
      render: (value: any) => {
        return <div>{value && formatDateToDDMMYYYY(new Date(value))}</div>;
      },
    },
    {
      title: "Category",
      dataIndex: "categories",
      key: "4",
      align: "center",
      render: (value: Category[], record: DataSource) => {
        return <div>{value?.map((category) => category.name).join(", ")}</div>;
      },
    },
    ...(showEditAndView
      ? [
          {
            title: "Edit",
            render: (_record: DataSource) => {
              return (
                <div className="cursor-pointer">
                  <img
                    onClick={() => onEdit?.(_record)} // Pass the clicked record
                    src="/assets/img/icon12.png"
                    width={18}
                    className="m-auto"
                  />
                </div>
              );
            },
            key: "9",
            width: 20,
          },
          {
            title: "View",
            render: (_record: DataSource) => {
              return (
                <div className="cursor-pointer">
                  <img
                    onClick={() => onView?.(_record)} // Pass the clicked record
                    src="/assets/img/icon13.png"
                    width={18}
                    className="m-auto"
                  />
                </div>
              );
            },
            key: "10",
            width: 20,
          },
        ]
      : []),
    {
      title: "Delete",
      render: (value: any, record: DataSource) => {
        return <DeleteNotification onDelete={() => onDelete(record._id)} />;
      },
      key: "5",
      align: "center",
      width: 90,
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      bordered={true}
      rowKey={(record) => record?._id}
    />
  );
}

export default ContentTable;

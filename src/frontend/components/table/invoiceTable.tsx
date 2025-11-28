"use client";

import { Table } from "antd";
import jsPDF from "jspdf";

export default function InvoiceTable({ dataSource }: { dataSource: any[] }) {
  // Function to generate the PDF
  const generatePDF = (record: any) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Invoice", 105, 20, { align: "center" });

    // Add some details
    doc.setFontSize(12);
    doc.text(`Order ID: ${record.order_id}`, 20, 40);
    doc.text(`Date: ${record.date}`, 20, 50);
    doc.text(`Courses: ${record.courses}`, 20, 60);
    doc.text(`Amount: ${record.amount}`, 20, 70);
    doc.text(`Status: ${record.status}`, 20, 80);

    // Footer
    doc.setFontSize(10);
    doc.text("Thank you for your purchase!", 105, 130, { align: "center" });

    // Download the PDF
    doc.save(`Invoice-${record.order_id}.pdf`);
  };

  // Table columns
  const columns = [
    {
      title: "ORDER ID",
      dataIndex: "order_id",
      key: "1",
      width: "200px",
    },
    {
      title: "DATE",
      dataIndex: "date",
      key: "2",
      width: "200px",
    },
    {
      title: "COURSES",
      dataIndex: "courses",
      key: "3",
      width: "200px",
    },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      key: "4",
      width: "200px",
    },
    {
      title: "STATUS",
      key: "5",
      width: "150px",
      render: (value: any, record: any) => {
        return (
          <button
            className="bg-[#01B067] rounded-3xl text-xs text-[#fff] py-1 w-16"
            type="submit"
          >
            {record.status}
          </button>
        );
      },
    },
    {
      title: "DOWNLOAD",
      dataIndex: "download",
      key: "6",
      width: "100px",
      align: "center",
      render: (value: any, record: any) => {
        return (
          <button onClick={() => generatePDF(record)}>
            <img src="/assets/img/icon54.png" width={18} />
          </button>
        );
      },
    },
  ];

  return (
    <Table
      className="invoiceTable w-full"
      dataSource={dataSource}
      columns={columns}
      pagination={false}
    />
  );
}

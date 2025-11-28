import React, { useEffect, useState } from "react";
import { userStore } from "@/store/user/user";
import InvoiceTable from "@/frontend/components/table/invoiceTable";
import axios from "axios";

type Course = {
  type: string;
  _id: string;
};

type PackageInfo = {
  _id: string;
  displayId: string;
  name: string;
  price: number;
  active: boolean;
  courses: Course[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type PackageData = {
  startDate: string;
  endDate: string;
  active: boolean;
  price: number;
  _id: string;
  packageInfo: PackageInfo;
};

export default function Invoice() {
  const { user } = userStore();

  const [packages, setPackages] = useState<PackageData[]>([]);
  const getPackages = async () => {
    try {
      if (!user) return;

      const res = await axios.get(`/api/users/${user._id}/packages`);
      const data = res.data.pkgs;

      // Transform the data into the required format
      const transformedData = data.map((pkg, index) => ({
        key: (index + 1).toString(), // Unique key for each item
        order_id: pkg.packageInfo.displayId, // Package ID as the order ID
        date: pkg.startDate, // Start date
        courses: pkg.packageInfo.name, // Package name
        amount: `PKR ${pkg.price}`, // Price prefixed with "PKR"
        status: pkg.active ? "Active" : "Inactive", // Active or Inactive
      }));

      // Set the transformed data
      setPackages(transformedData);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getPackages();
  }, [user]);
  console.log(packages);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center py-7 border-b border-[#E1E1E1]">
        <div>
          <h2 className="text-3xl text-[#01B067] font-medium">Invoice</h2>
          <p>You can find all of your order Invoices.</p>
        </div>
      </div>
      <div className="w-full">
        <InvoiceTable dataSource={packages} />
      </div>
    </div>
  );
}

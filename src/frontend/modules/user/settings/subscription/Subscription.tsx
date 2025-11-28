import React, { useEffect, useState } from "react";
import { Form } from "antd";
import { userStore } from "@/store/user/user";
import SubscriptionCard from "@/frontend/components/subscriptionCard/subscriptionCard";
import { PaymentOption } from "@/frontend/components/paymentOption/paymentOption";
import Link from "next/link";
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

export default function Subscription() {
  const { user } = userStore();
  const [link, setLink] = useState<string>("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [packages, setPackages] = useState<PackageData[]>([]);
  const getPackages = async () => {
    try {
      if (!user) return;
      const res = await axios.get(`/api/users/${user._id}/packages`);
      const data = res.data.pkgs;
      setPackages(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getPackages();
    fetchSettings();
  }, [user]);

  const showViewModal = () => {
    setIsViewModalOpen(true);
  };

  const handlePaymentOptionSave = () => {
    setIsViewModalOpen(false);
  };

  const handlePaymentOptionCancel = () => {
    setIsViewModalOpen(false);
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get("/api/settings");
      const { data } = response;
      if (data) {
        setLink(data.promotionLink);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error.message);
    }
  };

  return (
    <Form>
      <div className="p-10">
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center pb-4 border-b border-[#E1E1E1]">
            <div>
              <h2 className="text-3xl text-[#EF6A77] font-medium">
                My Subscription
              </h2>
              <p>
                Here is the list of packages/products that you have subscribed
                to.
              </p>
            </div>
            <div>
              <Link
                className="bg-[transparent] rounded-3xl border border-[#EF6A77] px-6 text-[#EF6A77] py-2"
                href={link ?? "#"}
                rel="noopener noreferrer"
                target="_blank"
              >
                Upgrade Now - Go pro PKR 5000
              </Link>
            </div>
          </div>

          {packages && packages.length > 0 ? (
            packages.map((pkg) => (
              <>
                <div
                  key={pkg._id}
                  className="flex flex-col gap-2 border-b border-[#E1E1E1] pb-5"
                >
                  <div className="flex flex-row justify-between gap-3">
                    <div
                      className={`text-center rounded-3xl text-sm text-[#fff] py-2 w-28 ${
                        pkg.active ? "bg-[#01B067]" : "bg-[#FF0019]"
                      }`}
                    >
                      {pkg.active ? "Active" : "Expire"}
                    </div>
                    <Link
                      className="bg-[#EF6A77] rounded-3xl px-6 text-[#fff] py-2"
                      href={link ?? "#"}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {pkg.active ? "Change Plan" : "Activate"}
                    </Link>
                  </div>
                  <h2 className="text-3xl font-medium">
                    {pkg.packageInfo.name}
                  </h2>
                  <p>Subscription ID: {pkg.packageInfo.displayId}.</p>
                  <SubscriptionCard
                    startedOn={pkg.startDate}
                    price={pkg.price}
                    access={pkg.packageInfo.active}
                    billingDate={pkg.endDate}
                  />
                </div>
              </>
            ))
          ) : (
            <div>
              <p>No subscriptions found.</p>
            </div>
          )}

          <div className="flex flex-col gap-5 mt-5">
            <div className="py-4 border-b border-[#E1E1E1]">
              <h2 className="text-3xl text-[#EF6A77] font-medium">
                Payment Methods
              </h2>
              <p>Primary payment method is used by default</p>
            </div>
            <div>
              <button
                className="bg-[transparent] rounded-3xl border border-[#EF6A77] px-6 text-[#EF6A77] py-2"
                // onClick={showViewModal}
                onClick={() => {}}
              >
                Add Payment Method
              </button>

              <PaymentOption
                isModalOpen={isViewModalOpen}
                handleSave={handlePaymentOptionSave}
                handleCancel={handlePaymentOptionCancel}
              />
            </div>
            <div className="flex flex-col gap-7">
              <div className="flex gap-5 justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Visa ending in 1234
                  </h2>
                  <p className="text-lg font-normal">Feature Coming Soon ...</p>
                </div>
                <div className="flex gap-3">
                  <img src="/assets/img/icon53.png" alt="image" />
                  <img src="/assets/img/icon52.png" alt="image" />
                </div>
              </div>
              <div className="flex gap-5 justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Mastercard ending in 1234
                  </h2>
                  <p className="text-lg font-normal">Feature Coming Soon ...</p>
                </div>
                <div className="flex gap-3">
                  <img src="/assets/img/icon53.png" alt="image" />
                  <img src="/assets/img/icon52.png" alt="image" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}

"use client";

import { Input, Modal } from "antd";
import { useEffect, useState } from "react";
import AttachedPackagesTable from "../../table/attachedPackagesTable";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import AddPackages from "../addPackages/addPackages";
import axios from "axios";

const addBtnStyle = {
  background: "#01B067",
  padding: "16px 35px",
  borderRadius: "unset",
};

export default function AttachedPackages({
  setUserId,
  userId,
  toggleModal,
  isModalOpen,
}) {
  const [userData, setUserData] = useState(null);
  const [selectedPackageIds, setSelectedPackageIds] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState(
    userData?.packages ?? []
  );
  const [searchQuery, setSearchQuery] = useState("");
  console.log(filteredPackages);
  console.log(userData);
  useEffect(() => {
    const filtered = userData?.packages.filter((pack) => {
      const matchesQuery = pack.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesQuery;
    });
    setFilteredPackages(filtered);
  }, [searchQuery, userData]);

  const getUserdata = async () => {
    axios
      .get(`/api/users/${userId}`)
      .then(({ data }) => {
        const { user } = data;
        setUserData(user);
        setSelectedPackageIds(user.packages.map((p) => p._id));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (userId) {
      getUserdata();
    }
  }, [userId]);

  const handleClose = () => {
    setUserId("");
    toggleModal();
  };

  const handleActiveInActive = (packageId: string, active: boolean) => {
    console.log(packageId, active);
    axios
      .patch(`/api/users/${userId}/packages/status`, { packageId, active })
      .then(getUserdata)
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDelete = (packageId: string) => {
    axios
      .put(`/api/users/${userId}/packages/remove`, { packageId })
      .then(getUserdata)
      .catch((error) => {
        console.error(error);
      });
  };

  const handleUpdate = (payload) => {
    axios
      .patch(`/api/users/${userId}/packages`, payload)
      .then(getUserdata)
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <Modal
        footer={null}
        style={{ paddingBottom: 0 }}
        open={isModalOpen}
        centered
        closable={false}
        width={1000}
        className="nameModal"
      >
        <div className="flex flex-col justify-between items-center gap-3 px-10 pt-5 pb-10">
          <div className="w-full flex gap-10 justify-between">
            <div className="flex gap-10 items-center">
              <p className="text-lg font-medium text-colorblack">
                Search Attached Courses
              </p>
              <Input
                className="userSearch"
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                }}
                style={{ width: 450 }}
                prefix={<SearchOutlined style={{ fontSize: "20px" }} />}
                placeholder="Search"
              />
            </div>
            {userData && (
              <AddPackages
                packageIds={selectedPackageIds}
                userId={userId}
                refetch={getUserdata}
              />
            )}
            <div>
              <CloseOutlined onClick={handleClose} />
            </div>
          </div>
          <div className="w-full pt-5">
            <AttachedPackagesTable
              dataSource={filteredPackages ?? []}
              onActive={handleActiveInActive}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

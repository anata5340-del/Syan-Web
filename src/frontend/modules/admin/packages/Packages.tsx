"use client";

import { Input, Button, Modal } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import { PlusOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { SearchOutlined } from "@ant-design/icons";
import PackageTable from "@/frontend/components/table/packageTable";
import React, { useEffect, useState } from "react";
import UserPackageTable from "@/frontend/components/table/userPackageTable";
import AddUser from "@/frontend/components/packages/addUser/addUser";
import axios from "axios";
import AttachedCourses from "@/frontend/components/packages/attachedCourses/attachedCourses";
import { PackageNameModal } from "./components/package-name-modal";
import { set } from "lodash";
import AttachedPackages from "@/frontend/components/packages/attachedPackages/attachedPackages";

const size: SizeType = "middle";

const addBtnStyle = {
  background: "#F9954B",
  padding: "16px 35px",
  borderRadius: "unset",
  margin: "15px 0",
};
const addBtnStyle1 = {
  background: "#01B067",
  padding: "16px 35px",
  borderRadius: "unset",
  margin: "15px 0",
};

const viewMode = {
  packages: "packages",
  users: "users",
};

const packageMode = {
  add: "add",
  update: "update",
};

export default function Packages() {
  const [mode, setMode] = useState(packageMode.add);

  const [view, setView] = useState(viewMode.packages);
  const [packages, setPackages] = useState([]);

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(users ?? []);
  const [userId, setUserId] = useState("");
  const [isUsersViewModalOpen, setIsUsersViewModalOpen] = useState(false);

  const [packageName, setPackageName] = useState("");
  const [packageId, setPackageId] = useState("");

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isNameModalOpen, setNameModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getPackages();
    getUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesQuery =
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesQuery;
    });
    setFilteredUsers(filtered);
  }, [searchQuery, packages]);

  const handleToggleViewModal = () => {
    if (isViewModalOpen) {
      setUserId("");
    }
    setIsViewModalOpen(!isViewModalOpen);
  };

  const handleToggleViewUsersModal = () => {
    if (isUsersViewModalOpen) {
      setPackageId("");
    }
    setIsUsersViewModalOpen(!isUsersViewModalOpen);
  };

  const handleUsersView = (id: string) => {
    setUserId(id);
    handleToggleViewUsersModal();
  };

  const handleUserActive = (id: string, activeStatus: boolean) => {
    const payload = { active: activeStatus };
    console.log(payload);

    axios
      .patch(`/api/users/${id}/status`, payload)
      .then(getUsers)
      .catch((error) => {
        console.error(error);
      });
  };

  const getUsers = () => {
    axios
      .get("/api/users")
      .then(({ data }) => {
        const { users: usersList } = data;
        const filteredDeletedUsers = usersList.filter(
          (user) => user.isDeleted === false
        );
        setUsers(filteredDeletedUsers);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleUserDelete = (id: string) => {
    axios
      .delete(`/api/users/${id}`)
      .then(getUsers)
      .catch((error) => {
        console.error(error);
      });
  };

  const getPackages = () => {
    axios
      .get("/api/packages")
      .then(({ data }) => {
        const { packages: packagesList } = data;
        setPackages(packagesList);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const createPackage = () => {
    const paylaod = {
      package: {
        name: packageName,
        active: true,
      },
    };
    axios
      .post("/api/packages", paylaod)
      .then(() => {
        setPackageName("");
        getPackages();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const updatePackage = () => {
    const paylaod = {
      id: packageId,
      package: {
        name: packageName,
      },
    };
    axios
      .patch(`/api/packages/${packageId}`, paylaod)
      .then(() => {
        getPackages();
        setPackageName("");
        setPackageId("");
        setMode(packageMode.add);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDelete = (id: string) => {
    axios
      .delete(`/api/packages/${id}`)
      .then(getPackages)
      .catch((error) => {
        console.error(error);
      });
  };

  const handleView = (id: string) => {
    setPackageId(id);
    handleToggleViewModal();
  };

  const handleUpdate = (id: string, name: string, price: number) => {
    setPackageId(id);
    setPackageName(name);
    setMode(packageMode.update);
    setNameModalOpen(true);
  };

  const showNameModal = () => {
    setNameModalOpen(true);
  };

  const handlePackageNameSave = () => {
    if (mode === packageMode.add) {
      createPackage();
    } else {
      updatePackage();
    }
    setNameModalOpen(false);
  };

  const handlePackageNameCancel = () => {
    setPackageName("");
    setNameModalOpen(false);
  };

  return (
    <>
      <div className="flex justify-between align-middle mt-10">
        <div>
          <h2 className="text-3xl font-medium text-colorblack">
            List of all {view === "users" ? "Users" : "Packages"}
          </h2>
        </div>
        <div className="flex gap-10">
          <div className="flex justify-start">
            <Search placeholder="Search" style={{ width: 300 }} />
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex mt-4 text-white">
          <div
            id="allUsers"
            className="w-2/4 bg-colorgreen rounded-t-xl flex items-center justify-center h-16 px-4 cursor-pointer"
            onClick={() => setView(viewMode.packages)}
          >
            <div className="flex-grow flex justify-center text-2xl">
              Packages
            </div>
          </div>
          <div
            id="removedUsers"
            className="w-2/4 bg-colordarkblue rounded-t-xl flex items-center justify-center h-16 px-4 cursor-pointer"
            onClick={() => setView(viewMode.users)}
          >
            <div className="flex-grow flex justify-center text-2xl">Users</div>
          </div>
        </div>

        <div>
          {view === viewMode.packages && (
            <Button
              onClick={showNameModal}
              type="primary"
              style={addBtnStyle}
              icon={<PlusOutlined />}
            ></Button>
          )}
          {view === viewMode.users && (
            <div className="flex justify-center mt-4">
              {/* add user modal */}
              {/* <AddUser /> */}
              <div className="">
                <Input
                  className="userSearch"
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchQuery(value);
                  }}
                  style={{ width: 350 }}
                  prefix={<SearchOutlined style={{ fontSize: "20px" }} />}
                  placeholder="Search"
                />
              </div>
              <div style={{ minHeight: "50px" }} />
            </div>
          )}

          {/* Add package modal */}
          <PackageNameModal
            mode={mode}
            isModalOpen={isNameModalOpen}
            handleSave={handlePackageNameSave}
            handleCancel={handlePackageNameCancel}
            packageName={packageName}
            setPackageName={setPackageName}
          />
          <div>
            {view === viewMode.packages && (
              <PackageTable
                dataSource={packages}
                onDelete={handleDelete}
                onView={handleView}
                onUpdate={handleUpdate}
              />
            )}
            {view === viewMode.users && (
              <UserPackageTable
                dataSource={filteredUsers}
                onDelete={handleUserDelete}
                onView={handleUsersView}
                onActive={handleUserActive}
              />
            )}
          </div>
          {/* view package details modal */}
          <AttachedCourses
            packageId={packageId}
            isOpen={isViewModalOpen}
            toggleModal={handleToggleViewModal}
          />
          {/* view user modal */}
          <AttachedPackages
            setUserId={setUserId}
            userId={userId}
            isModalOpen={isUsersViewModalOpen}
            toggleModal={handleToggleViewUsersModal}
          />
        </div>
      </div>
    </>
  );
}

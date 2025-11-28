"use client";

import { Button, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import AddPackagesTable from "../../table/addPackagesTable";
import axios from "axios";

const addBtnStyle = {
  background: "#01B067",
  borderRadius: "5px",
};

export default function AddPackages({ userId, packageIds, refetch }) {
  const [packages, setPackages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState(packages ?? []);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const filtered = packages.filter((pack) => {
      const matchesQuery = pack.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesQuery;
    });
    setFilteredPackages(filtered);
  }, [searchQuery, packages]);

  // useEffect(() => {
  //   console.log(packages);
  // }, [packages]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    addPackages();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getPackages = () => {
    axios
      .get("/api/packages")
      .then(({ data }) => {
        const { packages: packagesList } = data;
        const addIsChecked = packagesList.reduce((result, { _id, ...rest }) => {
          if (!packageIds.includes(_id)) {
            result.push({ ...rest, _id, isChecked: false });
          }
          return result;
        }, []);
        setPackages(addIsChecked);
      })
      .catch((error) => {
        console.error("/api/packages", error);
      });
  };

  const addPackages = () => {
    axios
      .put(`/api/users/${userId}/packages`, {
        packages: selectedPackages,
      })
      .then(() => {
        refetch();
        handleCancel();
      })
      .catch((error) => {
        console.error("/api/users/:id/packages", error);
      });
    setSelectedPackages([]);
  };

  useEffect(() => {
    getPackages();
  }, [packageIds, userId]);

  const handleSelectDeselect = (rowId, isChecked) => {
    if (isChecked) {
      const newPackage = {
        _id: rowId,
        active: true,
        startDate: undefined,
        endDate: undefined,
        price: undefined,
      };
      setSelectedPackages([...selectedPackages, newPackage]);
    } else {
      setSelectedPackages(selectedPackages.filter((p) => p._id !== rowId));
    }
    const updatedPackages = packages.map((p) => {
      if (p._id === rowId) {
        return { ...p, isChecked };
      }
      return p;
    });
    setPackages(updatedPackages);
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={showModal}
        style={addBtnStyle}
        icon={<PlusOutlined />}
      >
        Package
      </Button>
      <Modal
        footer={[
          <div className="flex gap-5 justify-end py-5 px-5">
            <Button
              className="saveBtn"
              key="submit"
              type="primary"
              onClick={handleOk}
            >
              Save
            </Button>
            <Button
              className="cancelBtn"
              key="cancel"
              type="primary"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>,
        ]}
        style={{ left: 250, paddingBottom: 0 }}
        open={isModalOpen}
        centered
        closable={false}
        width={800}
        className="addCourseModal !left-0"
      >
        <div className="flex flex-col justify-between items-center gap-3 pb-10">
          <div className="bg-colorcyan flex justify-center border-0 rounded-t-md items-center h-20 w-full gap-3 text-xs">
            <div className="text-white text-xl">List Of Package</div>
          </div>
          <div>
            <Input
              className="userSearch"
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
              }}
              style={{ width: 320 }}
              prefix={<SearchOutlined style={{ fontSize: "20px" }} />}
              suffix={"Search"}
            />
          </div>
          <div className="w-full">
            <AddPackagesTable
              dataSource={filteredPackages}
              onSelectDeselect={handleSelectDeselect}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

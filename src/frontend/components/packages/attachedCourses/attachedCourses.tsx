"use client";

import { Input, Modal } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import AttachedCoursesTable from "../../table/attachedCoursesTable";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import AddCourses from "../addCourses/addCourses";
import axios from "axios";

const addBtnStyle = {
  background: "#01B067",
  padding: "16px 35px",
  borderRadius: "unset",
};

const getCourses = (courses: any[], courseId: string) =>
  courses
    .map(({ _id, type }) => ({
      _id,
      type,
    }))
    .filter(({ _id }) => _id !== courseId);

export default function AttachedCourses({
  packageId,
  isOpen,
  toggleModal,
}: {
  packageId: string;
  isOpen: boolean;
  toggleModal: () => void;
}) {
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [packageData, setPackageData] = useState({});

  const [courses, setCourses] = useState(packageData?.courses ?? []);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const filtered = packageData?.courses?.filter((course) => {
      const matchesQuery = course.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesQuery;
    });
    setCourses(filtered);
  }, [searchQuery, packageData]);
  const handleToggleCourseModal = () => {
    setIsCourseModalOpen(!isCourseModalOpen);
  };

  const getPackageData = () => {
    axios
      .get(`/api/packages/${packageId}`)
      .then(({ data }) => {
        const { package: fetchedPackage } = data;
        setPackageData(fetchedPackage);
      })
      .catch((error) => {
        console.error("get specific package error : ", error);
      });
  };

  const handleDelete = (courseId: string) => {
    const courses = getCourses(packageData?.courses ?? [], courseId);

    if (packageId === "") return;

    const payload = {
      id: packageId,
      package: {
        courses,
      },
    };

    axios
      .put(`/api/packages/${packageId}`, payload)
      .then(getPackageData)
      .catch((error) => {
        console.error("update single package courses error", error);
      });
  };

  useEffect(() => {
    if (packageId) {
      getPackageData();
    }
  }, [packageId]);

  return (
    <>
      <Modal
        footer={null}
        style={{ paddingBottom: 0 }}
        open={isOpen}
        centered
        closable={false}
        width={1000}
        className="nameModal"
        keyboard={true}
        maskClosable={true}
      >
        <div className="flex flex-col justify-between items-center gap-3 px-10 pt-5 pb-10">
          <div className="w-full flex gap-10 justify-between">
            <div className="flex gap-10 items-center">
              <h2 className="text-lg font-medium text-colorblack">
                Search Attached Courses
              </h2>
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

            {/* select video, notes, quiz modal */}
            <AddCourses
              packageId={packageId}
              isModalOpen={isCourseModalOpen}
              toggleModal={handleToggleCourseModal}
              refetch={getPackageData}
              packageCourses={packageData?.courses ?? []}
            />

            <CloseOutlined onClick={toggleModal} />
          </div>
          <div className="w-full pt-5">
            <AttachedCoursesTable
              dataSource={courses}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

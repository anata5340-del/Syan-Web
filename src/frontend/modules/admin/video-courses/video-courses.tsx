"use client";

import { SizeType } from "antd/lib/config-provider/SizeContext";
import VideoTable from "@/frontend/components/table/videoTable";
// import CourseUpload from "@/frontend/components/upload/courseUpload";
import AddVideoCourse from "@/frontend/components/upload/add-video-course/add-video-course";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useVideoCourses } from "./use-video-courses";
import { useEffect, useState } from "react";

const size: SizeType = "middle";
export default function VideoCourses() {
  const {
    mode,
    handleView,
    handleEdit,
    handleDelete,
    videoCourses,
    editData,
    refetch,
    setMode,
    isVideoCourseModalOpen,
    toggleVideoCourseModal,
  } = useVideoCourses();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVideoCourses, setFilteredVideoCourses] = useState("");

  useEffect(() => {
    const filtered = videoCourses?.filter((course) => {
      const matchesQuery = course.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesQuery;
    });
    setFilteredVideoCourses(filtered);
  }, [searchQuery, videoCourses]);

  return (
    <div className="flex flex-col mt-8 rounded-t-xl">
      <div className="flex flex-col text-white">
        <div className="bg-colordarkblue flex justify-center items-center  rounded-t-xl  h-20 px-4">
          <p className="text-2xl">Video Courses</p>
        </div>
        <div className="border border-x-black">
          <div className="flex justify-between align-middle my-10 mx-5">
            <div className="flex gap-12 items-center">
              <h2 className="text-3xl font-medium text-colorblack">
                List of all courses
              </h2>
              <Input
                className="userSearch"
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                }}
                style={{ width: 250 }}
                prefix={<SearchOutlined style={{ fontSize: "20px" }} />}
                suffix={"Search"}
              />
            </div>
            <div>
              <AddVideoCourse
                data={editData}
                refetch={refetch}
                mode={mode}
                setMode={setMode}
                isModalOpen={isVideoCourseModalOpen}
                toggleModal={toggleVideoCourseModal}
              />
              {/* <CourseUpload type="Course" /> */}
            </div>
          </div>
        </div>
      </div>
      <div>
        <VideoTable
          dataSource={filteredVideoCourses}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onView={handleView}
        />
      </div>
    </div>
  );
}

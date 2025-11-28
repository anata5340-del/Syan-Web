"use client";

import { Button, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import AddCoursesTable from "../../table/addCoursesTable";
import { useAddCourses } from "./useAddCourses";
import axios from "axios";

const addBtnStyle = {
  background: "#01B067",
  padding: "16px 35px",
  borderRadius: "4px",
};

const courseMode = {
  video: "video",
  quiz: "quiz",
};

export default function AddCourses({
  refetch,
  packageId,
  isModalOpen,
  toggleModal,
  packageCourses,
}: {
  refetch: () => void;
  packageId: string;
  isModalOpen: boolean;
  toggleModal: () => void;
  packageCourses: unknown[];
}) {
  const [mode, setMode] = useState(courseMode.quiz);
  const [courses, setCourses] = useState<string[]>(packageCourses);
  const { videos, quizes } = useAddCourses(courses);

  const [filteredVideos, setFilteredVideos] = useState(videos ?? []);
  const [filteredQuizes, setFilteredQuizes] = useState(quizes ?? []);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const filteredQuizes = quizes.filter((pack) => {
      const matchesQuery = pack.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesQuery;
    });
    const filteredVideos = videos.filter((pack) => {
      const matchesQuery = pack.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesQuery;
    });
    setFilteredQuizes(filteredQuizes);
    setFilteredVideos(filteredVideos);
  }, [searchQuery, videos, quizes]);

  useEffect(() => {
    setCourses(packageCourses);
  }, [packageCourses]);

  const handleOk = () => {
    if (packageId === "") return;

    const payload = {
      id: packageId,
      package: {
        courses,
      },
    };

    axios
      .put(`/api/packages/${packageId}`, payload)
      .then(() => {
        refetch();
        setCourses([]);
        setMode(courseMode.quiz);
      })
      .catch((error) => {
        console.error("update package courses error", error);
      })
      .finally(() => {
        toggleModal();
      });
  };

  const handleCancel = () => {
    setMode(courseMode.quiz);
    setCourses(packageCourses);
    toggleModal();
  };

  const dataSource =
    // mode === courseMode.note
    //   ? notes
    //   :
    mode === courseMode.video ? filteredVideos : filteredQuizes;

  const handleSelectCourse = (_id: string, isChecked: boolean) => {
    if (isChecked) {
      setCourses([...courses, { _id, type: mode }]);
    } else {
      setCourses(courses.filter((course) => course._id !== _id));
    }
  };

  return (
    <>
      <div>
        <Button
          type="primary"
          onClick={toggleModal}
          style={addBtnStyle}
          icon={<PlusOutlined />}
        ></Button>
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
          style={{ left: 350, paddingBottom: 0 }}
          open={isModalOpen}
          centered
          closable={false}
          width={400}
          className="addCourseModal !left-0 min-h-[500px]"
        >
          <div className="flex flex-col justify-between items-center gap-3 pb-10">
            <div className="p-2 bg-colorcyan flex justify-center border-0 rounded-t-md items-center h-20 w-full gap-3 text-xs">
              {/* <div
                className={`h-9 flex gap-2 justify-center items-center border border-white rounded-md px-8 text-white ${
                  mode === courseMode.note && "bg-white !text-black"
                }`}
                onClick={() => setMode(courseMode.note)}
              >
                <img src="/assets/img/icon16.png" />
                Notes Courses
              </div> */}
              <div
                className={`h-9 flex gap-2 justify-center items-center border border-white rounded-md px-8 text-white cursor-pointer ${
                  mode === courseMode.quiz && "bg-white !text-black"
                }`}
                onClick={() => setMode(courseMode.quiz)}
              >
                <img
                  className={mode === courseMode.quiz ? "invert" : ""}
                  src="/assets/img/icon16.png"
                />
                Quiz Courses
              </div>
              <div
                className={`h-9 flex gap-2 justify-center items-center border border-white rounded-md px-8 cursor-pointer text-white ${
                  mode === courseMode.video && "bg-white !text-black"
                }`}
                onClick={() => setMode(courseMode.video)}
              >
                <img src="/assets/img/icon17.png" />
                Video Courses
              </div>
            </div>
            <div>
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
            <div className="w-full">
              <AddCoursesTable
                dataSource={dataSource ?? []}
                onSelect={handleSelectCourse}
              />
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}

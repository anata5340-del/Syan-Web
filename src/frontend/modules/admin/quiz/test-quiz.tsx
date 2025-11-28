"use client";

import { Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import QuizTable from "@/frontend/components/table/quizTable";
import CourseUpload from "@/frontend/components/upload/courseUpload";

export default function Quiz() {
  const size: SizeType = "middle";
  const addBtnStyle = {
    background: "#01B067",
    padding: "16px 35px",
    borderRadius: "unset",
  };

  return (
    <>
      <div className="flex flex-col mt-8 rounded-t-xl">
        <div className="flex flex-col text-white">
          <div className="bg-colordarkblue flex justify-center items-center rounded-t-xl h-20 px-4">
            <p className="text-2xl">Quiz Courses</p>
          </div>
          <div className="border border-x-black">
            <div className="flex justify-between align-middle my-10 mx-5">
              <div className="flex gap-12 items-center">
                <h2 className="text-3xl font-medium text-colorblack">
                  List of all quiz Courses
                </h2>
                <Input
                  className="userSearch"
                  style={{ width: 250 }}
                  prefix={<SearchOutlined style={{ fontSize: "20px" }} />}
                  suffix={"Search"}
                />
              </div>
              <div>
                <CourseUpload type="Course" />
              </div>
            </div>
          </div>
        </div>
        <div>
          <QuizTable />
        </div>
      </div>
    </>
  );
}

"use client";

import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React from "react";
import CourseUpload from "@/frontend/components/upload/courseUpload";
import Link from "next/link";
import { useModules } from "./useModules";
import { AddLibraryQuestions, Tabs } from "./components";
import { AddQuizLibrary } from "@/frontend/components/upload/addQuizLibrary/addQuizLibrary";
import { AddCustomQuizLibrary } from "@/frontend/components/upload/addCustomQuizLibrary/addCustomQuizLibrary";

const addBtnStyle = {
  background: "#01B067",
  padding: "0px 15px",
  borderRadius: "5px",
};

export default function Modules() {
  const {
    libraryViewMode,
    toggleLibraryViewMode,
    isAddLibraryModalOpen,
    toggleAddLibraryModal,
    isAddLibraryQuestionsModalOpen,
    toggleAddLibraryQuestionsModal,
    isAddCustomQuestionsModalOpen,
    toggleAddCustomQuestionsModal,
    quizType,
    toggleQuizType,
  } = useModules();
  console.log("quizType : ", quizType);
  return (
    <div className="flex flex-col mt-8">
      <div className="flex flex-col text-white">
        <div className="bg-colordarkblue flex justify-center items-center rounded-t-xl h-20 px-4">
          <p className="text-2xl">Quiz Data</p>
        </div>
        <Tabs type={quizType} toggleQuizType={toggleQuizType} />
        <div className="flex justify-between mt-4">
          {/* Add quiz custom library */}
          {/* <CourseUpload type="SubChildModule" /> */}
          <AddCustomQuizLibrary
            mode=""
            refetch={() => {
              console.log("library refetch called");
            }}
            data={null}
            isModalOpen={isAddCustomQuestionsModalOpen}
            toggleModal={toggleAddCustomQuestionsModal}
          />

          {/* Add quiz Library */}
          <AddQuizLibrary
            data={null}
            mode={libraryViewMode}
            toggleModal={toggleAddLibraryModal}
            isModalOpen={isAddLibraryModalOpen}
            refetch={() => {
              console.log("library refetch called");
            }}
          />

          <AddLibraryQuestions
            data={{ quiz: { questions: [] } }}
            refetch={() => {
              console.log("refetch library questions called");
            }}
            isModalOpen={isAddLibraryQuestionsModalOpen}
            handleCancel={toggleAddLibraryQuestionsModal}
          />
          {/* <Button type="primary" style={addBtnStyle} icon={<PlusOutlined />}>
            Add Field yes
          </Button> */}
        </div>
      </div>
      <div className="mt-20">
        <div className="flex gap-10">
          <div className="w-1/4">
            <div className="flex bg-slate-300 rounded-xl h-44 px-4 justify-between">
              <div className="flex flex-col justify-around w-1/2">
                <h2 className="text-black text-2xl font-semibold">
                  NLE Paper 3
                </h2>
                <div className="bg-colororange rounded-xl text-center text-white">
                  Topic 221
                </div>
              </div>
              <div className="flex flex-col justify-center gap-5 items-center">
                {/* <Link href="modules/content"> */}
                <Button
                  type="primary"
                  style={addBtnStyle}
                  icon={<PlusOutlined />}
                  onClick={toggleAddLibraryQuestionsModal}
                >
                  Add
                </Button>
                {/* </Link> */}
                <img src="/assets/img/icon25.png" alt="image" />
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <div></div>
              <div className="flex items-center gap-4">
                <img src="/assets/img/icon12.png" />
                <img src="/assets/img/icon14.png" />
              </div>
            </div>
          </div>
          <div className="w-1/4">
            <div className="flex bg-slate-300 rounded-xl h-44 px-4 justify-between">
              <div className="flex flex-col justify-around w-1/2">
                <h2 className="text-black text-2xl font-semibold">
                  NLE Paper 3
                </h2>
                <div className="bg-colororange rounded-xl text-center text-white">
                  Topic 221
                </div>
              </div>
              <div className="flex flex-col justify-center gap-5 items-center">
                <Link href="modules/content">
                  <Button
                    type="primary"
                    style={addBtnStyle}
                    icon={<PlusOutlined />}
                  >
                    Add
                  </Button>
                </Link>
                <img src="/assets/img/icon25.png" alt="image" />
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <div></div>
              <div className="flex items-center gap-4">
                <img src="/assets/img/icon12.png" />
                <img src="/assets/img/icon14.png" />
              </div>
            </div>
          </div>
          <div className="w-1/4">
            <div className="flex bg-slate-300 rounded-xl h-44 px-4 justify-between">
              <div className="flex flex-col justify-around w-1/2">
                <h2 className="text-black text-2xl font-semibold">
                  NLE Paper 3
                </h2>
                <div className="bg-colororange rounded-xl text-center text-white">
                  Topic 221
                </div>
              </div>
              <div className="flex flex-col justify-center gap-5 items-center">
                <Link href="modules/content">
                  <Button
                    type="primary"
                    style={addBtnStyle}
                    icon={<PlusOutlined />}
                  >
                    Add
                  </Button>
                </Link>
                <img src="/assets/img/icon25.png" alt="image" />
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <div></div>
              <div className="flex items-center gap-4">
                <img src="/assets/img/icon12.png" />
                <img src="/assets/img/icon14.png" />
              </div>
            </div>
          </div>
          <div className="w-1/4">
            <div className="flex bg-slate-300 rounded-xl h-44 px-4 justify-between">
              <div className="flex flex-col justify-around w-1/2">
                <h2 className="text-black text-2xl font-semibold">
                  NLE Paper 3
                </h2>
                <div className="bg-colororange rounded-xl text-center text-white">
                  Topic 221
                </div>
              </div>
              <div className="flex flex-col justify-center gap-5 items-center">
                <Link href="modules/content">
                  <Button
                    type="primary"
                    style={addBtnStyle}
                    icon={<PlusOutlined />}
                  >
                    Add
                  </Button>
                </Link>
                <img src="/assets/img/icon25.png" alt="image" />
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <div></div>
              <div className="flex items-center gap-4">
                <img src="/assets/img/icon12.png" />
                <img src="/assets/img/icon14.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

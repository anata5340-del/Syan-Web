"use client";

import Link from "next/link";
import { useRouter } from "next/router";

import { Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ContentTable from "@/frontend/components/table/contentTable";
import AddQuiz from "@/frontend/components/upload/addQuiz";
import DeleteNotification from "@/frontend/components/notifications/DeleteNotification";
import { useContent } from "./useContent";
import AddNotes from "./components/add-notes/add-notes";
import { Button } from "antd";
import AddVideos from "./components/add-videos/add-videos";

import { AddSubSection } from "../components/add-sub-section/add-sub-section";
import { useAddSubSectionBlock } from "../use-add-sub-section-block";

import { useDeleteNote } from "./useDeleteNote";
import { useDeleteVideo } from "./useDeleteVideo";
import AddQuestions from "./components/add-questions/add-questions";
import { useDeleteQuestion } from "./useDeleteQuestion";
import { AddSubSectionBlock } from "../components/add-sub-section-block/add-sub-section-block";
import subSection from "@/pages/api/videoCourses/[id]/modules/[moduleId]/section/[sectionId]/subSection";
import { useEffect, useState } from "react";

const filterOption = (
  input: string,
  option?: { label: string; value: string }
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

const addBtnStyle = {
  background: "#01B067",
  padding: "16px 20px",
};
export default function AddContent() {
  const router = useRouter();
  const { videoCourseId, moduleId, sectionId, subSectionId, sectionName } =
    router.query;
  const { refetch, subSectionData, parentIds } = useContent();
  // const { handleDeleteNote } = useDeleteNote({ refetch, parentIds });
  // const { handleDeleteVideo } = useDeleteVideo({ refetch, parentIds });
  // const { handleDeleteQuestion } = useDeleteQuestion({ refetch, parentIds });

  const {
    isAddSubSectionBlockModalOpen,
    toggleAddSubSectionBlockModal,
    subSectionBlockMode,
    handleBlockEdit,
    handleBlockDelete,
    subSectionBlockData,
    refetchSubSection,
  } = useAddSubSectionBlock({
    videoCourseId,
    moduleId,
    sectionId,
    subSectionId,
    refetchSubSection: refetch,
  });

  return (
    <div className="flex flex-col mt-8 gap-6">
      <div className="flex">
        <button
          className=" h-10 w-10 rounded-[50%]"
          onClick={() => {
            window.history.back();
          }}
        >
          <img src="/assets/img/icon62.png" alt="Back Button" />
        </button>
        <span
          className={`flex items-center ml-8 leading-[33.2px] h-[38.2px] px-8 font-semibold text-center text-[22.09px] text-white rounded-[8.82px] bg-[${"#277C72"}]`}
        >
          {sectionName}
        </span>
      </div>
      <div className="flex text-[#3E3E3E]">
        <span className="font-semibold text-[26px] leading-10">
          {subSectionData?.name}
        </span>
        <span className="ml-8 mt-auto mb-1.5 font-normal text-[16px] leading-6">
          {subSectionData?.subSectionBlocks
            ? subSectionData?.subSectionBlocks.length === 1
              ? `${subSectionData?.subSectionBlocks?.length} Topic`
              : `${subSectionData?.subSectionBlocks?.length} Topics`
            : "0 Topics"}
        </span>
      </div>
      <div className="-mt-8 text-[14px] leading-5">Videos</div>
      <div className="bg-[#F1FFFD] rounded-[15px] mb-5">
        <div
          style={{ backgroundColor: subSectionData?.color }}
          className="flex justify-center rounded-t-[15px] py-2"
        >
          <span className="bg-white rounded-[10px] px-16 py-1 text-[#3E3E3E] text-[20px] leading-[30px] font-extrabold">
            DATA ENTRY
          </span>
        </div>
        <div className="grid grid-cols-4 gap-8 p-8 justify-center min-h-96 text-[#3E3E3E]">
          {subSectionData?.subSectionBlocks &&
            subSectionData?.subSectionBlocks.map((block) => {
              return (
                <div key={block._id}>
                  <div
                    style={{ backgroundColor: block?.color }}
                    className="flex w-full h-[129px] bg-white rounded-[18px] text-[20px] leading-6 shadow-lg"
                  >
                    <span className="m-4 h-3/8 w-2/3">{block.name}</span>
                    <img
                      className="m-3 mt-auto h-5/8 w-1/3"
                      src={block.image}
                      alt="Sub Section Block Image"
                    />
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <Link
                        href={`content?videoCourseId=${videoCourseId}&moduleId=${moduleId}&sectionId=${sectionId}&subSectionId=${subSectionId}&subSectionBlockId=${block._id}`}
                        className="m-2 float-end"
                      >
                        <Button
                          type="primary"
                          style={addBtnStyle}
                          icon={<PlusOutlined />}
                        ></Button>
                      </Link>
                    </div>
                    <div className="flex items-center gap-4">
                      <img
                        style={{ cursor: "pointer" }}
                        src="/assets/img/icon12.png"
                        onClick={() => handleBlockEdit(block)}
                      />
                      <DeleteNotification
                        onDelete={() => {
                          handleBlockDelete(block?._id);
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          <div className="hidden">
            <AddSubSectionBlock
              videoCourseId={videoCourseId}
              moduleId={moduleId}
              sectionId={sectionId}
              subSectionId={subSectionId}
              data={subSectionBlockData}
              mode={subSectionBlockMode}
              toggleModal={toggleAddSubSectionBlockModal}
              isModalOpen={isAddSubSectionBlockModalOpen}
              refetch={refetchSubSection}
            />
          </div>
          <div className="flex justify-center items-center w-full h-[129px] bg-white rounded-[18px] shadow-lg">
            <Button
              type="primary"
              style={{
                background: "#01B067",
                padding: "20px 60px",
              }}
              onClick={() => toggleAddSubSectionBlockModal()}
              icon={<PlusOutlined />}
            ></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

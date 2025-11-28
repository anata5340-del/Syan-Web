"use client";

import { useRef } from "react";

import { Button } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import CourseUpload from "@/frontend/components/upload/courseUpload";
import Link from "next/link";
import { useModules } from "./useModules";
import AddModule from "./components/add-module/add-module";
import { useAddModule } from "./useAddModule";
import DeleteNotification from "@/frontend/components/notifications/DeleteNotification";
import { AddSection } from "./components/add-section/add-section";
import { useAddSection } from "./use-add-section";
import { AddSubSection } from "./components/add-sub-section/add-sub-section";
import { useAddSubSection } from "./use-add-sub-section";
import { SubSection } from "@/backend/types";

const addBtnStyle = {
  background: "#01B067",
  padding: "16px 20px",
  borderRadius: "2.77px",
};

export default function Modules() {
  const { videoCourseId, moduleData, refetchModule } = useModules();
  const {
    handleModuleDelete,
    editModuleData,
    handleModuleEdit,
    isAddModuleModalOpen,
    toggleAddModuleModal,
    moduleMode,
    setModuleMode,
  } = useAddModule({ refetchModule, videoCourseId });

  const {
    selectedSection,
    setSelectedSection,
    handleSectionClick,
    handleSectionDelete,
    handleSectionEdit,
    isAddSectionModalOpen,
    toggleAddSectionModal,
    sectionMode,
    sectionData,
  } = useAddSection({
    refetchModule,
    videoCourseId,
    moduleId: moduleData?._id,
  });

  const {
    subSectionData,
    subSectionMode,
    isAddSubSectionModalOpen,
    toggleAddSubSectionModal,
    handleSubSectionEdit,
    handleSubSectionDelete,
  } = useAddSubSection({
    videoCourseId,
    moduleId: moduleData?._id,
    sectionId: selectedSection?._id,
    refetchModule,
    setSelectedSection,
  });

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const onAdd = () => {
    const sectionElement = sectionRefs.current[selectedSection?._id];
    if (sectionElement) {
      setSelectedSection(null);
      setTimeout(() => {
        const event = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        });
        sectionElement.dispatchEvent(event); // Simulate the click event
      }, 500);
    } else {
      console.error("Section element not found for ID:", selectedSection?._id);
    }
  };

  return (
    <div className="flex flex-col mt-8 mb-5">
      <div className="flex flex-col text-white">
        <div className="bg-colordarkblue flex justify-center items-center rounded-t-xl h-20 px-4">
          <p className="text-2xl">Add Fields</p>
        </div>
        <div className="flex justify-end mt-6">
          {/* <CourseUpload type="Module" /> */}
          <AddModule
            isModuleAvailable={!!moduleData}
            videoCourseId={videoCourseId}
            refetch={refetchModule}
            toggleModal={toggleAddModuleModal}
            isModalOpen={isAddModuleModalOpen}
            setModuleMode={setModuleMode}
            mode={moduleMode}
            data={editModuleData}
          />
        </div>
        {moduleData && (
          <div
            style={{ background: moduleData?.color }}
            className="flex justify-center items-center rounded-xl h-16 px-4 mt-8"
          >
            <p className="text-2xl">{moduleData?.name}</p>
          </div>
        )}
        {moduleData && (
          <div className="flex justify-between mt-4">
            <div>
              {/* <CourseUpload type="SubModule" /> */}
              <AddSection
                videoCourseId={videoCourseId}
                moduleId={moduleData?._id}
                data={sectionData}
                mode={sectionMode}
                toggleModal={toggleAddSectionModal}
                isModalOpen={isAddSectionModalOpen}
                refetch={refetchModule}
              />
            </div>
            <div className="flex items-center gap-4">
              <img
                style={{ cursor: "pointer" }}
                src="/assets/img/icon12.png"
                onClick={() => handleModuleEdit(moduleData)}
              />
              {/* <img src="/assets/img/icon14.png" /> */}
              <DeleteNotification
                onDelete={() => handleModuleDelete(moduleData?._id)}
              />
            </div>
          </div>
        )}
        <div className="mt-4 flex items-center gap-10 w-full">
          {moduleData?.sections?.map((section) => {
            return (
              <div
                key={section?._id}
                className="felx justify-center w-2/3 h-28"
              >
                <div
                  id={section?._id}
                  ref={(el) => {
                    if (section?._id) sectionRefs.current[section._id] = el;
                  }}
                  style={{
                    background: section?.color,
                    border:
                      selectedSection?._id === section?._id
                        ? "2px solid #01B067"
                        : "",
                  }}
                  className="cursor-pointer rounded-xl h-28 flex flex-col justify-center items-center"
                  onClick={() => handleSectionClick(section)}
                >
                  <h2>{section?.name}</h2>
                  <p>Topic: {section?.topic}</p>
                </div>
                <div className="flex justify-between mt-4">
                  <div>
                    <Button
                      className="flex justify-center items-center padding-0 "
                      type="primary"
                      onClick={() => toggleAddSubSectionModal(section)}
                      style={addBtnStyle}
                      icon={<PlusOutlined />}
                    >
                      Add Field
                    </Button>
                  </div>
                  <div className="flex justify-end items-center gap-4">
                    <img
                      style={{ cursor: "pointer" }}
                      src="/assets/img/icon12.png"
                      onClick={() => handleSectionEdit(section)}
                    />
                    <DeleteNotification
                      onDelete={() => handleSectionDelete(section?._id)}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          <div className={`${isAddSectionModalOpen ? "hidden" : ""}`}>
            <AddSubSection
              refetch={refetchModule}
              mode={subSectionMode}
              videoCourseId={videoCourseId}
              moduleId={moduleData?._id}
              sectionId={selectedSection?._id}
              onAdd={onAdd}
              data={subSectionData}
              isModalOpen={isAddSubSectionModalOpen}
              toggleModal={toggleAddSubSectionModal}
            />
          </div>

          {/* <div className="w-2/6 h-28">
            <div className="bg-colordarkblue rounded-xl h-28 flex flex-col justify-center items-center">
              <h2>Anatomy</h2>
              <p>Topic: 221</p>
            </div>
            <div className="flex justify-between mt-4">
              <div>
                <CourseUpload type="SubChildModule" />
              </div>
              <div className="flex items-center gap-4">
                <img src="/assets/img/icon12.png" />
                <img src="/assets/img/icon14.png" />
              </div>
            </div>
          </div>

          <div className="w-2/6 h-28">
            <div className="bg-colordarkblue rounded-xl h-28 flex flex-col justify-center items-center">
              <h2>Anatomy</h2>
              <p>Topic: 221</p>
            </div>
            <div className="flex justify-between mt-4">
              <div>
                <CourseUpload type="SubChildModule" />
              </div>
              <div className="flex items-center gap-4">
                <img src="/assets/img/icon12.png" />
                <img src="/assets/img/icon14.png" />
              </div>
            </div>
          </div> */}
        </div>
        <div className="mt-20">
          <div className="flex gap-10">
            {selectedSection?.subSections?.map((subSection) => {
              return (
                <div key={subSection._id} className="w-1/4">
                  <div
                    style={{ background: subSection?.color }}
                    className="flex rounded-xl h-36 px-4 justify-between"
                  >
                    <div className="flex flex-col justify-around w-1/2">
                      <h2 className="text-black text-2xl font-semibold">
                        {subSection?.name}
                      </h2>
                      <div className="bg-colororange rounded-xl text-center">
                        Topic: {subSection?.topic}
                      </div>
                    </div>
                    <div className="flex justify-end items-end">
                      <img
                        src={subSection?.image}
                        className="my-3 h-5/8 w-2/3"
                        alt="image"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between mt-4">
                    <div>
                      <Link
                        href={`modules/addContent?videoCourseId=${videoCourseId}&moduleId=${moduleData?._id}&sectionId=${selectedSection?._id}&sectionName=${selectedSection?.name}&subSectionId=${subSection?._id}`}
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
                        onClick={() => handleSubSectionEdit(subSection)}
                      />
                      <DeleteNotification
                        onDelete={() => {
                          handleSubSectionDelete(subSection?._id);
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            {/* <div className="w-1/4">
              <div className="flex bg-slate-300 rounded-xl h-36 px-4 justify-between">
                <div className="flex flex-col justify-around w-1/2">
                  <h2 className="text-black text-2xl font-semibold">
                    Cell Physiology
                  </h2>
                  <div className="bg-colororange rounded-xl text-center">
                    Topic 221
                  </div>
                </div>
                <div className="flex items-center">
                  <img src="/assets/img/icon11.png" alt="image" />
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <div>
                  <Link href={"modules/content"}>
                    <Button
                      type="primary"
                      style={addBtnStyle}
                      icon={<PlusOutlined />}
                    ></Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4">
                  <img src="/assets/img/icon12.png" />
                  <img src="/assets/img/icon14.png" />
                </div>
              </div>
            </div>
            <div className="w-1/4">
              <div className="flex bg-slate-300 rounded-xl h-36 px-4 justify-between">
                <div className="flex flex-col justify-around w-1/2">
                  <h2 className="text-black text-2xl font-semibold">
                    Cell Physiology
                  </h2>
                  <div className="bg-colororange rounded-xl text-center">
                    Topic 221
                  </div>
                </div>
                <div className="flex items-center">
                  <img src="/assets/img/icon11.png" alt="image" />
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <div>
                  <Link href={"modules/content"}>
                    <Button
                      type="primary"
                      style={addBtnStyle}
                      icon={<PlusOutlined />}
                    ></Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4">
                  <img src="/assets/img/icon12.png" />
                  <img src="/assets/img/icon14.png" />
                </div>
              </div>
            </div>
            <div className="w-1/4">
              <div className="flex bg-slate-300 rounded-xl h-36 px-4 justify-between">
                <div className="flex flex-col justify-around w-1/2">
                  <h2 className="text-black text-2xl font-semibold">
                    Cell Physiology
                  </h2>
                  <div className="bg-colororange rounded-xl text-center">
                    Topic 221
                  </div>
                </div>
                <div className="flex items-center">
                  <img src="/assets/img/icon11.png" alt="image" />
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <div>
                  <Link href={"modules/content"}>
                    <Button
                      type="primary"
                      style={addBtnStyle}
                      icon={<PlusOutlined />}
                    ></Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4">
                  <img src="/assets/img/icon12.png" />
                  <img src="/assets/img/icon14.png" />
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

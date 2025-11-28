"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Module, Section } from "@/backend/types";
import SubSectionCard from "@/frontend/components/subSectionCard/subSectionCard";
import SectionCard from "@/frontend/components/sectionCard/SectionCard";
import { useRouter } from "next/router";

interface Props {
  id: string;
}

export default function Modules({ id }: Props) {
  const router = useRouter();
  const { id: courseId } = router.query;
  const [module, setModule] = useState<Module | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  const getVideoModulesFromId = async (id: string) => {
    try {
      const { data } = await axios.get(`/api/videoCourses/${id}`);
      console.log(data);
      setModule(data.quiz.modules[0]);
    } catch (error) {
      console.error("getModules error:", error);
    }
  };

  useEffect(() => {
    getVideoModulesFromId(id);
    console.log(module);
  }, []);

  return (
    <>
      <div className="flex flex-col mt-8">
        <div className="flex justify-center">
          <h2 className="text-3xl">Lectures</h2>
        </div>
        <div className="flex flex-col">
          <div className="bg-colorcyan flex justify-center items-center rounded-xl h-16 px-4 mt-8">
            <p className="text-2xl bg-[#FFFFFF] rounded-3xl px-16 text-[#EF6A77]">
              {module?.name}
            </p>
          </div>

          <div className="mt-4 flex justify-center items-center">
            <div className="flex w-5/6 gap-10">
              {module?.sections?.map((section, i) => (
                <SectionCard
                  setSelectedSection={setSelectedSection}
                  selectedSectionId={selectedSection?._id}
                  key={i}
                  section={section}
                />
              ))}
            </div>
            <div className="relative">
              <div className="absolute top-16">
                <img src="/assets/img/icon41.png" alt="image" />
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="flex gap-10">
              {selectedSection?.subSections.map((subSection, i) => (
                <SubSectionCard
                  key={i}
                  subSection={subSection}
                  link={`/user/videoCourses/${courseId}/modules/dashboard?m=${module?._id}&s=${selectedSection._id}&ss=${subSection._id}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

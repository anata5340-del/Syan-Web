"use client";
import { useState, useEffect } from "react";
import { Progress } from "antd";
import ModuleCard from "@/frontend/components/moduleCard/ModuleCard";
import axios from "axios";
import { useRouter } from "next/router";
import { Note, SubSection, Video } from "@/backend/types";
import Link from "next/link";
import QuizStartModal from "@/frontend/components/quizStartModal/QuizStartModal";
import Image from "next/image";
import questions from "@/pages/api/videoCourses/[id]/modules/[moduleId]/section/[sectionId]/subSection/[subSectionId]/subSectionBlock/[subSectionBlockId]/questions";
import { QuestionStatus } from "@/backend/types/questionStatus";
import { NoteStatus } from "@/backend/types/noteStatus";
import { VideoStatus } from "@/backend/types/videoStatus";

interface Props {
  courseId: string;
  moduleId: string;
  sectionId: string;
  subSectionId: string;
  selected: string | undefined;
}

interface Course {
  id: number;
  title: string;
  duration: string;
  iconSrc: string;
}

interface Module {
  name: string;
  color: string;
}

export default function Dashboard({
  courseId,
  moduleId,
  sectionId,
  subSectionId,
  selected,
}: Props) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(
    selected ? selected : "notes"
  );
  const [module, setModule] = useState<Module | null>(null);
  // const [quizes, setQuizes] = useState<Quiz[] | null>(null);
  const [subSection, setSubSection] = useState<SubSection | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [allSelected, setAllSelected] = useState<boolean>(false);
  const [videosDurations, setVideosDurations] = useState<string[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [questionStatuses, setQuestionStatuses] = useState<QuestionStatus[]>(
    []
  );
  const [noteStatuses, setNoteStatuses] = useState<NoteStatus[]>([]);
  const [videoStatuses, setVideoStatuses] = useState<VideoStatus[]>([]);
  // const [courses, setCourses] = useState<Course[]>([]);
  // const [videos, setVideos] = useState<Video[] | null>(null);
  // const [notes, setNotes] = useState<Note[] | null>(null);
  // const [module, setModule] = useState<Module | null>(null);
  const handleSectionClick = (section: string) => {
    setActiveSection(section);
  };
  const selectAllQuestions = () => {
    let questionCount = 0;
    subSection?.subSectionBlocks?.forEach((block) => {
      questionCount += block.questions.length;
    });

    if (selectedQuestions.length === questionCount) {
      // Deselect all questions
      setSelectedQuestions([]);
      setAllSelected(false);
    } else {
      // Select all questions, avoiding duplicates
      const allQuestions = [];
      subSection?.subSectionBlocks?.forEach((block) => {
        block.questions.forEach((question) => {
          allQuestions.push(question);
        });
      });

      setAllSelected(true);
      setSelectedQuestions(allQuestions);
    }
  };

  const getsubSection = async (
    courseId: string,
    moduleId: string,
    sectionId: string,
    subSectionId: string
  ) => {
    try {
      const { data } = await axios.get(
        `/api/videoCourses/${courseId}/modules/${moduleId}/section/${sectionId}/subSection/${subSectionId}`
      );
      setSubSection(data.subSection);
    } catch (error) {
      console.error("Error getting subSection ", error);
    }
  };

  const sectionName = module?.sections?.map((section) => {
    if (section._id === sectionId) return section.name;
  });
  // const getNote = async () => {
  //   try {
  //     const { data } = await axios.get(
  //       `/api/videoCourses/${courseId}/modules/${moduleId}/section/${sectionId}/subSection/${subSectionId}/note`
  //     );
  //     setNotes(data.notes); // Use data.notes here
  //   } catch (error) {
  //     console.error("getNote Error", error);
  //   }
  // };

  const getVideoModulesFromId = async (id: string) => {
    try {
      const { data } = await axios.get(`/api/videoCourses/${id}`);
      setModule(data.quiz.modules.find((m: any) => m._id === moduleId));
    } catch (error) {
      console.error("getModules error:", error);
    }
  };

  const getVideoTimeFromIds = async (blockIds: string[]) => {
    setVideosDurations([]); // Clear durations before fetching

    try {
      const durations = await Promise.all(
        blockIds.map(async (blockId) => {
          const { data } = await axios.get(
            `/api/videoCourses/${courseId}/modules/${moduleId}/section/${sectionId}/subSection/${subSectionId}/subSectionBlock/${blockId}/video`
          );

          // Get the last content item's endTime

          const content = data.video.content;
          const lastEndTime = content[content.length - 1].endTime;

          // Convert endTime (HH:MM:SS) to minutes
          const [hours, minutes, seconds] = lastEndTime.split(":").map(Number);
          const totalMinutes = Math.ceil(hours * 60 + minutes + seconds / 60);

          return totalMinutes; // Return duration in minutes (e.g., 1.50)
        })
      );

      setVideosDurations(durations); // Update state once all durations are processed
    } catch (error) {
      console.error("Error fetching video durations:", error);
    }
  };

  const getQuestionStatuses = async () => {
    const { data } = await axios.get("/api/users/question-status");
    setQuestionStatuses(data.questionStatuses);
  };
  const getNoteStatuses = async () => {
    const { data } = await axios.get("/api/users/note-status");
    setNoteStatuses(data.noteStatus);
  };
  const getVideoStatuses = async () => {
    const { data } = await axios.get("/api/users/video-status");
    setVideoStatuses(data.videoStatuses);
  };

  useEffect(() => {
    getsubSection(courseId, moduleId, sectionId, subSectionId);
    getVideoModulesFromId(courseId);
    getQuestionStatuses();
    getNoteStatuses();
    getVideoStatuses();
  }, []);

  function calculateProgress(
    statuses: QuestionStatus[] // Accepts questionStatuses, notesStatuses, or videoStatuses
  ): number {
    // Step 1: Extract all unique IDs from the subSection based on the key
    const uniqueItems = new Set<string>();
    subSection?.subSectionBlocks.forEach((block) => {
      block.questions?.forEach((id: string) => uniqueItems.add(id));
    });

    // Step 2: Extract all attempted IDs from the statuses
    const attemptedItems = new Set<string>(
      statuses?.map((status) => status.questionId).filter((id) => id) // Ensure valid IDs
    );

    // Step 3: Count the number of unique items attempted in the subSection
    let attemptedCount = 0;
    uniqueItems.forEach((id) => {
      if (attemptedItems.has(id)) {
        attemptedCount++;
      }
    });

    // Step 4: Calculate progress percentage
    const progress =
      uniqueItems.size > 0 ? (attemptedCount / uniqueItems.size) * 100 : 0;

    return Math.round(progress); // Return rounded progress percentage
  }

  const calculateNoteVideoProgress = (
    statuses: NoteStatus[] | VideoStatus[],
    key: "note" | "video"
  ): number => {
    // Step 1: Extract all unique blocks for the given key from the subsection
    const uniqueBlocks =
      subSection?.subSectionBlocks.filter((block) => block[key]) || [];

    // Step 2: Map the statuses to track the completion percentage for each note/video
    const completionMap = new Map<string, number>();

    statuses?.forEach((status, index) => {
      const itemId = key === "note" ? status.noteId : status.videoId;

      // Find the completion percentage for the status
      if (status.content.length > 0) {
        const completedContent = status.content.filter(
          (content) => content.completed
        );
        const completionPercentage =
          completedContent.length / status.content.length;
        completionMap.set(itemId, completionPercentage);
      } else {
        completionMap.set(itemId, 0); // No content means 0% completion
      }
    });

    // Step 3: Calculate progress for each block, ensuring equal weightage
    let totalBlockProgress = 0;

    uniqueBlocks.forEach((block) => {
      const blockId = block[key];
      const blockProgress = completionMap.get(blockId) || 0; // Default to 0% if not in statuses
      totalBlockProgress += blockProgress;
    });

    // Step 4: Calculate overall progress
    const progress =
      uniqueBlocks.length > 0
        ? (totalBlockProgress / uniqueBlocks.length) * 100
        : 0; // Avoid division by zero

    return Math.round(progress); // Return rounded progress percentage
  };

  const progress =
    activeSection === "notes"
      ? calculateNoteVideoProgress(noteStatuses, "note")
      : activeSection === "videos"
      ? calculateNoteVideoProgress(videoStatuses, "video")
      : calculateProgress(questionStatuses);

  useEffect(() => {
    let blockIds = [];
    subSection?.subSectionBlocks.map(
      (block) => block.video && blockIds.push(block._id)
    );
    getVideoTimeFromIds(blockIds);
  }, [subSection?.subSectionBlocks]);

  const showDetails = activeSection === "videos";
  const showCheckbox = activeSection === "quiz";

  const notesCount = subSection?.subSectionBlocks.reduce(
    (acc, block) => (block.note ? acc + 1 : acc),
    0
  );
  const quizesCount = subSection?.subSectionBlocks.reduce(
    (acc, block) => (block.questions.length > 0 ? acc + 1 : acc),
    0
  );
  const videosCount = subSection?.subSectionBlocks.reduce(
    (acc, block) => (block.video ? acc + 1 : acc),
    0
  );
  let index = -1;
  const topicsCount =
    activeSection === "notes"
      ? notesCount
      : activeSection === "videos"
      ? videosCount
      : quizesCount;
  return (
    <>
      <QuizStartModal
        moduleId={moduleId}
        limit={selectedQuestions.length}
        sectionId={sectionId}
        subSectionId={subSectionId}
        selectedTopics={null}
        selectedTime={null}
        courseId={courseId}
        selectedQuestions={selectedQuestions}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedPaper={null}
        quizId={null}
      />
      <div className="flex flex-col mx-auto mt-4 gap-4 max-w-7xl">
        <div className="flex justify-between mt-4">
          <div className="flex flex-col w-1/5">
            <div className="flex justify-between w-72">
              <div>
                <button onClick={() => router.back()}>
                  <Image
                    width={40}
                    height={40}
                    src="/assets/img/icon44.png"
                    alt="back-btn"
                  />
                </button>
              </div>
              <div className="bg-[#277C72] rounded-md text-white whitespace-nowrap text-base px-14 py-0 flex items-center">
                <p>{sectionName}</p>
              </div>
            </div>
            <div className="flex mt-4 justify-between items-center">
              <div className="text-[#3E3E3E] text-xl font-semibold">
                {subSection?.name}
              </div>
              <div className="text-[#3E3E3E] text-sm font-normal">{`${
                topicsCount && topicsCount > 1
                  ? topicsCount + " Topics"
                  : topicsCount + " Topic"
              } `}</div>
            </div>
            <div className="flex">
              <div className="text-[#3E3E3E] text-sm font-normal">
                {activeSection === "notes"
                  ? "Notes"
                  : activeSection === "videos"
                  ? "Videos"
                  : "Quiz"}
              </div>
            </div>
          </div>
          <div>
            <Progress
              strokeColor={"#277C72"}
              type="circle"
              percent={progress}
              format={(percent) => (
                <>
                  <div className="">{`${progress}%`}</div>
                </>
              )}
            />
          </div>
        </div>
        <div className="flex flex-col text-white">
          <div className="bg-[#309D90] flex justify-between items-center rounded-t-xl h-20 px-5 gap-5 text-lg">
            <div
              className={`border border-white cursor-pointer rounded-md gap-2 py-1 px-14 flex items-center ${
                activeSection === "notes"
                  ? "bg-[#FFD0AD] border-[#FFD0AD] text-colorblack"
                  : ""
              }`}
              onClick={
                !isModalOpen ? () => handleSectionClick("notes") : () => {}
              }
            >
              <img
                src="/assets/img/icon21.png"
                className={activeSection === "notes" ? "active-img" : ""}
                alt="Read Notes"
              />
              <p className="text-base">Read Notes</p>
            </div>
            <div
              className={`border border-white cursor-pointer rounded-md gap-2 py-1 px-20 flex items-center ${
                activeSection === "quiz"
                  ? "bg-[#FFD0AD] border-[#FFD0AD] text-colorblack"
                  : ""
              }`}
              onClick={
                !isModalOpen ? () => handleSectionClick("quiz") : () => {}
              }
            >
              <img
                src="/assets/img/icon23.png"
                className={activeSection === "quiz" ? "active-img" : ""}
                alt="Quiz"
              />
              <p className="text-base">Quiz</p>
            </div>
            <div
              className={`border border-white cursor-pointer rounded-md gap-2 py-1 px-20 flex items-center ${
                activeSection === "videos"
                  ? "bg-[#FFD0AD] border-[#FFD0AD] text-colorblack"
                  : ""
              }`}
              onClick={
                !isModalOpen ? () => handleSectionClick("videos") : () => {}
              }
            >
              <img
                src="/assets/img/icon22.png"
                className={activeSection === "videos" ? "active-img" : ""}
                alt="Videos"
              />
              <p className="text-base">Videos</p>
            </div>
          </div>
          <div className="bg-[#F1FFFD] rounded-b-lg flex-col gap-10 pt-8 pb-20 px-10 mb-5">
            {showCheckbox ? (
              <div
                onClick={selectAllQuestions}
                className="pb-3 flex justify-end items-center gap-2 cursor-pointer"
              >
                <div className="relative w-5 h-5 cursor-pointer mb-2">
                  {/* Custom styled checkbox */}
                  <span
                    className={`w-6 h-6 flex items-center justify-center rounded-full border hover:border-[#02DC81] ${
                      allSelected
                        ? "bg-[#02DC81] border-2 border-[#02DC81] after:content-['✔'] after:text-white after:font-bold after:text-[14px]"
                        : "bg-white border-2 border-gray-400"
                    }`}
                  ></span>
                </div>
                <p className="text-[#3E3E3E] text-md">Select All Topics</p>
              </div>
            ) : (
              <div
                onClick={selectAllQuestions}
                className="pt-10 flex justify-end items-center gap-2 cursor-pointer"
              ></div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {activeSection === "notes" &&
                (subSection?.subSectionBlocks?.length > 0 ? (
                  subSection?.subSectionBlocks.map(
                    (block) =>
                      block.note && (
                        <ModuleCard
                          key={block._id}
                          setSelectedQuestions={setSelectedQuestions}
                          id={block._id}
                          allSelected={allSelected}
                          title={block.name ? block.name : ""}
                          color={block?.color}
                          duration={""}
                          showDetails={showDetails}
                          link={`/user/videoCourses/${courseId}/modules/dashboard/notes/${block?.note}?m=${moduleId}&s=${sectionId}&ss=${subSectionId}&ssb=${block._id}&ssbt=${block.name}&vid=${block?.video}`}
                          showCheckbox={showCheckbox}
                          iconSrc={block.image ? block.image : ""}
                        />
                      )
                  )
                ) : (
                  <div className="text-black col-span-full">
                    Could not find any notes
                  </div>
                ))}
              {activeSection === "videos" &&
                (subSection?.subSectionBlocks?.length > 0 ? (
                  subSection?.subSectionBlocks.map((block) => {
                    block.video && index++;
                    return (
                      block.video && (
                        <ModuleCard
                          key={block._id}
                          setSelectedQuestions={setSelectedQuestions}
                          id={block._id}
                          allSelected={allSelected}
                          duration={`${
                            videosDurations[index] !== 1
                              ? videosDurations[index] + " mins"
                              : videosDurations[index] + " min"
                          }`}
                          title={block.name ? block.name : ""}
                          showDetails={showDetails}
                          color={block?.color}
                          link={`/user/videoCourses/${courseId}/modules/dashboard/videos/${block?.video}?m=${moduleId}&s=${sectionId}&ss=${subSectionId}&ssb=${block._id}&ssbt=${block.name}&n=${block?.note}`}
                          showCheckbox={showCheckbox}
                          iconSrc={block?.image ? block?.image : ""}
                        />
                      )
                    );
                  })
                ) : (
                  <div className="text-black col-span-full">
                    Could not find any videos
                  </div>
                ))}
              {activeSection === "quiz" &&
                (subSection?.subSectionBlocks?.length > 0 ? (
                  subSection?.subSectionBlocks?.map(
                    (block) =>
                      block.questions.length > 0 && (
                        <ModuleCard
                          allSelected={allSelected}
                          setSelectedQuestions={setSelectedQuestions}
                          key={block._id}
                          questions={block?.questions ? block?.questions : []}
                          id={block._id}
                          title={block?.name ? block?.name : ""}
                          color={block?.color}
                          duration={""}
                          length={block.questions.length}
                          showDetails={showDetails}
                          link={`#`}
                          showCheckbox={showCheckbox}
                          iconSrc={block.image}
                        />
                      )
                  )
                ) : (
                  <div className="text-black col-span-full">
                    Could not find any quizzes
                  </div>
                ))}
            </div>
          </div>
        </div>
        {activeSection === "quiz" && (
          <div className="flex justify-between mb-5">
            <p>{selectedQuestions?.length} Questions added</p>
            <button
              onClick={() => {
                setIsModalOpen(true);
              }}
              className="w-72 bg-[#4FB1C1] text-white h-14 px-16 py-3 rounded-md"
            >
              {" "}
              Start Exam
            </button>
          </div>
        )}
      </div>
      <style jsx>{`
        .active-img {
          filter: invert(1); /* Inverts the color of the image */
        }
      `}</style>
    </>
  );
}

"use client";
import QuizSelection from "@/frontend/components/quizSelection/quizSelection";
import QuizStartModal from "@/frontend/components/quizStartModal/QuizStartModal";
import axios from "axios";
import QuizCard from "@/frontend/components/quizCard/QuizCard";
import { useEffect, useState } from "react";
import { Paper, CustomQuestion, Question } from "@/backend/types";
import { isArray } from "lodash";

type Props = {
  id: string;
};

export default function Modules({ id }: Props) {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [customQuestions, setCustomQuestions] = useState<
    CustomQuestion[] | null
  >(null);
  const [isLibrarySelected, setIsLibrarySelected] = useState<boolean>(true);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const getQuizCourses = async () => {
    try {
      const { data } = await axios.get(`/api/quizes/${id}`);
      setPapers(data.quiz.library.papers);
      setCustomQuestions(data.quiz.customQuestions);
    } catch (error) {
      console.log("getQuizes error:", error);
    }
  };

  useEffect(() => {
    getQuizCourses();
  }, [id]);

  const addBtnStyle = {
    background: "#01B067",
    padding: "16px 35px",
    borderRadius: "unset",
  };

  return (
    <>
      <QuizStartModal
        limit={null}
        moduleId={null}
        sectionId={null}
        subSectionId={null}
        selectedTopics={null}
        selectedTime={null}
        selectedQuestions={null}
        courseId={null}
        quizId={id}
        selectedPaper={selectedPaper}
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
      />
      <div className="flex flex-col mt-8">
        <div className="flex justify-center">
          <h2 className="text-3xl">Quiz</h2>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between gap-16 w-full">
            <div
              onClick={() => {
                setIsLibrarySelected(false);
                setIsModalOpen(false);
              }}
              className="bg-[#4FB1C1] flex cursor-pointer justify-center items-center rounded-xl h-16 px-4 mt-8 w-2/4"
            >
              <p className="text-2xl bg-[#FFFFFF] rounded-3xl px-16 text-[#EF6A77]">
                Create Your Own
              </p>
            </div>
            <div
              onClick={() => setIsLibrarySelected(true)}
              className="bg-[#EF6A77] flex cursor-pointer justify-center items-center rounded-xl h-16 px-4 mt-8 w-2/4"
            >
              <p className="text-2xl bg-[#FFFFFF] rounded-3xl px-16 text-[#4FB1C1]">
                Library
              </p>
            </div>
          </div>
          {isLibrarySelected ? (
            <div className="mt-10">
              <div className="flex gap-10">
                {papers?.map((paper, i) => (
                  <QuizCard
                    setSelectedPaper={setSelectedPaper}
                    setIsModalOpen={setIsModalOpen}
                    key={i}
                    paper={paper}
                  />
                ))}
              </div>
            </div>
          ) : (
            <QuizSelection customQuestions={customQuestions} />
          )}
          {/* {!isLibrarySelected && (
            <div className="flex justify-between mb-5">
              <p>{selectedTopics?.length} Questions added</p>
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
          )} */}
        </div>
      </div>
    </>
  );
}

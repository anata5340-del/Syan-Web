import { Paper } from "@/backend/types";
import { Dispatch, SetStateAction, useState } from "react";
import { ChangeEvent } from "react";
import { useRouter } from "next/router";

type Props = {
  quizId: string | null;
  isModalOpen: boolean;
  total: string;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  selectedPaper: Paper | null;
  selectedTopics: string[] | null;
  selectedQuestions: string[] | null;
  moduleId: string | null;
  sectionId: string | null;
  subSectionId: string | null;
  courseId: string | null;
  selectedTime: number | null;
  limit: number | null;
};

const QuizStartModal = ({
  quizId,
  isModalOpen,
  limit,
  total,
  setIsModalOpen,
  selectedPaper,
  selectedQuestions,
  selectedTopics,
  moduleId,
  sectionId,
  subSectionId,
  courseId,
  selectedTime,
}: Props) => {
  const [time, setTime] = useState<number>(30);
  const router = useRouter();
  const handleStart = () => {
    if (selectedTopics) {
      router.push(
        `/user/quiz/${quizId}/library/customQuestions?t=${
          time * 60
        }&topics=${selectedTopics?.join(",")}&limit=${limit}`
      );
    } else if (!selectedQuestions) {
      router.push(
        `/user/quiz/${quizId}/library/${selectedPaper?._id}?t=${time * 60}`
      );
    } else {
      router.push(
        `/user/videoCourses/${courseId}/modules/dashboard/quiz?questions=${selectedQuestions.join(
          ","
        )}&t=${
          time * 60
        }&moduleId=${moduleId}&sectionId=${sectionId}&subSectionId=${subSectionId}`
      );
    }
  };
  return (
    <div
      className={`${
        isModalOpen ? "animate-fadeIn" : "hidden"
      } absolute left-1/2 top-1/2 transform -translate-x-1/2 z-10 -translate-y-1/2 max-w-md mx-auto bg-[#edf7ff] px-10 py-6 rounded-lg shadow-md`}
    >
      <h1 className="text-2xl font-bold mb-4">
        {selectedPaper?.name ? selectedPaper?.name : "Custom"}
      </h1>

      <p className="text-lg mb-4">
        Total:{" "}
        {selectedPaper?.questions?.length
          ? selectedPaper?.questions?.length
          : limit}
      </p>

      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex items-center mb-2">
          <svg
            className="w-5 h-5 text-green-500 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm">
            All progress on your current exam will be lost
          </span>
        </div>
      ))}
      {!selectedTime && (
        <div className="flex items-center mt-6 mb-4">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="mr-2">Select Time:</span>
          <input
            type="number"
            value={time}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTime(Number(e.target.value))
            }
            className="border border-[#3E3E3E] rounded-lg h-7 w-12 flex justify-center items-center text-center mr-2"
          />
          {time > 1 ? "mins" : "min"}
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={handleStart}
          className="bg-[#f9d293] text-black px-4 py-2 rounded"
        >
          Start Quiz
        </button>
        <button
          onClick={() => setIsModalOpen(false)}
          className="border-[1px] border-black text-black px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default QuizStartModal;

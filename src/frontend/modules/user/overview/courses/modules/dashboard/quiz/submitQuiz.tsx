"use client";
import { useEffect } from "react";
import { Progress } from "antd";
import axios from "axios";
import { Question } from "@/backend/types";
import { useRouter } from "next/router";
import { isNumber } from "lodash";

type Props = {
  questions?: (Question & { selectedOption: number })[];
  setIsReview: (value: boolean) => void;
  isReview: boolean;
  quizName: string; // New prop
};

export default function SubmitQuiz({
  questions,
  setIsReview,
  quizName,
  isReview,
}: Props) {
  const router = useRouter();
  const url = router.asPath;

  const correct = questions?.filter((question) => {
    if (isNumber(question.selectedOption))
      return question.options[question.selectedOption].isCorrect;
    else return false;
  }).length;

  const incorrect = questions?.filter((question) => {
    if (isNumber(question.selectedOption))
      return !question.options[question.selectedOption].isCorrect;
    else return false;
  }).length;
  const progress = Math.round(
    (correct ? (correct / questions?.length) * 100 : 0) +
      (incorrect ? (incorrect / questions?.length) * 100 : 0) // Total completed questions
  );
  // Send progress to the server
  useEffect(() => {
    if (!isReview) return;
    const sendProgress = async () => {
      console.log(quizName, url, progress);
      try {
        const url = router.asPath; // Current URL of the page
        await axios.post("/api/users/quiz-status", {
          quizName,
          progress,
          url,
        });
        console.log("Quiz progress updated successfully");
      } catch (error) {
        console.error("Error updating quiz progress:", error);
      }
    };

    sendProgress();
  }, [isReview, quizName, progress, router.asPath]);

  return (
    <>
      <div className="flex flex-col mx-auto my-4 mb-8 gap-4 max-w-7xl">
        <div className="flex mb-4">
          <div>
            <button onClick={() => setIsReview(false)}>
              <img src="/assets/img/icon44.png" alt="back-btn" />
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center text-white">
          <div className="bg-[#F1FFFD] rounded-[27px] flex flex-col justify-center items-center gap-5 pt-10 pb-20 px-10 w-2/4">
            <div className="text-4xl text-[#333333] font-light">
              You're all done.
            </div>
            <div className="text-4xl text-[#9E9E9E] font-light">
              You scored {correct}/{questions?.length}.
            </div>
            <div className="flex justify-between gap-5">
              <button
                onClick={() => setIsReview(false)}
                className="bg-[#277C72] rounded-[7px] px-4 py-2 text-sm flex items-center justify-center w-40"
              >
                Review Answers
              </button>
              <button
                onClick={() => router.back()}
                className="bg-[transparent] border border-[#3E3E3E] rounded-[7px] text-[#3E3E3E] px-4 py-2 text-sm flex items-center justify-center w-40"
              >
                Library
              </button>
              <button
                onClick={() => router.reload()}
                className="bg-[transparent] border border-[#3E3E3E] rounded-[7px] text-[#3E3E3E] px-4 py-2 text-sm flex items-center justify-center w-40"
              >
                Retake Exam
              </button>
            </div>
            <div className="flex flex-col bg-[#fff] rounded-[14px] w-3/4 p-4 justify-center items-center gap-5">
              <div className="text-[#333333] text-2xl">Overall performance</div>
              <Progress
                strokeColor={"#277C72"}
                trailColor="#EF6A77"
                type="circle"
                percent={correct && (correct / questions?.length) * 100}
                format={(percent) => (
                  <>
                    <div className=""></div>
                  </>
                )}
              />
              <div className="flex flex-col gap-5 text-[#333333]">
                <div className="flex gap-2">
                  <div className="text-[#277C72] font-medium">
                    {(
                      correct && (correct / questions?.length) * 100
                    )?.toFixed()}{" "}
                    %
                  </div>
                  <div>Correct</div>
                </div>
                <div className="flex gap-2">
                  <div className="text-[#EF6A77] font-medium">
                    {(
                      incorrect && (incorrect / questions?.length) * 100
                    )?.toFixed()}{" "}
                    %
                  </div>
                  <div>Incorrect</div>
                </div>
                <div className="flex gap-2">
                  <div>
                    {questions && isNumber(correct) && isNumber(incorrect)
                      ? questions?.length - (correct + incorrect)
                      : 0}
                  </div>
                  <div>Unanswered</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

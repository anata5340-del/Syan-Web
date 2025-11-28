import { Question } from "@/backend/types";
import { color } from "chart.js/helpers";
import { se } from "date-fns/locale/se";
import { Span } from "next/dist/trace";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface ModuleCardProps {
  title: string;
  duration: string;
  showDetails: boolean;
  showCheckbox: boolean;
  iconSrc: string;
  link: string;
  allSelected: boolean;
  id: string;
  length?: number;
  color?: string;
  questions?: Question[];
  setSelectedQuestions: Dispatch<SetStateAction<string[]>>;
}

export default function ModuleCard({
  title,
  duration,
  showDetails,
  showCheckbox,
  questions,
  iconSrc,
  link,
  color,
  length,
  allSelected,
  id,
  setSelectedQuestions,
}: ModuleCardProps) {
  const router = useRouter();

  const [isSelected, setIsSelected] = useState(allSelected);
  useEffect(() => {
    setIsSelected(allSelected);
  }, [allSelected]);
  const handleNavigate = () => {
    router.push(link);
  };
  return (
    <div
      onClick={
        showCheckbox
          ? () => {
              console.log(questions);

              setIsSelected((prev) => !prev);

              setSelectedQuestions((prev) => {
                const updatedQuestions = [...prev];

                questions?.forEach((question) => {
                  if (!isSelected) {
                    // Add the question only if it is not already present
                    updatedQuestions.push(question);
                  } else {
                    // Remove the question if it is already present
                    const index = updatedQuestions.indexOf(question);
                    updatedQuestions.splice(index, 1);
                  }
                });

                return updatedQuestions;
              });
            }
          : handleNavigate
      }
      className={`flex justify-between cursor-pointer bg-white rounded-2xl pt-3 pl-5 boxShadow w-full h-32`}
      style={{
        backgroundColor: color,
      }}
    >
      <div className="flex flex-col justify-between pb-2">
        <p className="text-[#3E3E3E]">{title}</p>
        {length && (
          <span className="text-[#3E3E3E] text-sm">{`${length} ${
            length > 1 ? "questions" : "question"
          }`}</span>
        )}
        {showDetails && <p className="text-[#3E3E3E]">{duration}</p>}
      </div>
      <div className="flex flex-col justify-between items-end gap-y-2 pr-3 pb-3 self-end">
        <div>
          {showDetails && !showCheckbox && (
            <img
              src="/assets/img/icon43.png"
              alt="play-btn"
              className="mt-2 rounded-full"
            />
          )}
          {showCheckbox && (
            <div className="relative w-5 h-5 cursor-pointer mb-2">
              {/* Custom styled checkbox */}
              <span
                className={`w-5 h-5 flex items-center justify-center rounded-full border hover:border-[#02DC81] ${
                  isSelected
                    ? "bg-[#02DC81] border-2 border-[#02DC81] after:content-['✔'] after:text-white after:font-bold after:text-[14px]"
                    : "bg-white border-2 border-gray-400"
                }`}
              ></span>
            </div>
          )}
        </div>
        <img
          style={{ height: "70px", width: "auto" }}
          src={iconSrc}
          alt={title}
          className="self-end"
        />
      </div>
    </div>
  );
}

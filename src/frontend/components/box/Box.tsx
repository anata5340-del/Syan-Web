import Link from "next/link";
import ProgressBar from "../progress/Progress";

type BoxProps = {
  title?: string;
  startedAt?: string;
  url?: string;
  completionPercentage?: number;
  type: "video" | "note" | "question";
  className?: string;
};

export default function Box({
  title,
  startedAt,
  completionPercentage,
  type,
  url,
  className,
}: BoxProps) {
  return (
    <Link href={url ? url : "#"} className={className}>
      <div
        className={`flex gap-5 border-2 ${
          type === "question"
            ? "border-[#FFD0AD]"
            : type === "video"
            ? "border-[#FFE3E6]"
            : "border-[#EECEFF]"
        }  rounded-3xl  `}
      >
        <div
          className={`${
            type === "question"
              ? "bg-[#FFD0AD]"
              : type === "video"
              ? "bg-[#FFE3E6]"
              : "bg-[#EECEFF]"
          } rounded-l-3xl py-2 px-2`}
        >
          <img
            src={`/assets/img/icon${
              type === "question" ? "31" : type === "video" ? "32" : "33"
            }.png`}
            className="max-w-[65.49px]"
          />
        </div>

        <div className="w-4/6 flex flex-col gap-1 pt-2">
          <p className="text-base font-medium">{title}</p>
          <div className="flex text-sm text-[#2E2E2E]">
            Started at:
            {` ${
              startedAt
                ? new Date(startedAt).toLocaleDateString()
                : "No progress"
            }`}
          </div>
          <div className="pb-2">
            <ProgressBar
              completionPercentage={
                completionPercentage ? completionPercentage : 0
              }
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

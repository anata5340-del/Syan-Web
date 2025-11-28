interface ProgressBarProps {
  completionPercentage: number;
}

export default function ProgressBar({
  completionPercentage,
}: ProgressBarProps) {
  return (
    <div className="relative w-full h-5 border border-[#01B067] rounded-full overflow-hidden">
      {/* Progress Bar */}
      <div
        className="absolute top-0 left-0 h-full bg-[#01B067]"
        style={{ width: `${completionPercentage}%` }}
      ></div>

      {/* Text Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs text-black">{`Completed ${completionPercentage}%`}</span>
      </div>
    </div>
  );
}

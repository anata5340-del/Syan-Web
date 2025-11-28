import { quizQuestionType } from "../../useModules";

type TabsProps = {
  type: string;
  toggleQuizType: () => void;
};

export const Tabs = ({ type, toggleQuizType }: TabsProps) => {
  return (
    <div className="flex gap-10">
      <div
        className={`bg-colorcyan cursor-pointer flex justify-center items-center rounded-xl w-2/4 h-16 px-4 mt-8 ${
          type === quizQuestionType.customLibrary && "bg-colororange"
        }`}
        onClick={
          type === quizQuestionType.customLibrary ? () => {} : toggleQuizType
        }
      >
        <p className="text-2xl">Create your own</p>
      </div>
      <div
        className={`bg-colorcyan cursor-pointer flex justify-center items-center rounded-xl w-2/4 h-16 px-4 mt-8 ${
          type === quizQuestionType.library && "bg-colororange"
        }`}
        onClick={type === quizQuestionType.library ? () => {} : toggleQuizType}
      >
        <p className="text-2xl">Library</p>
      </div>
    </div>
  );
};

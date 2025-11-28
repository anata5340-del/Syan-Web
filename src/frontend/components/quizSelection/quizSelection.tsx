import { useState, useEffect } from "react";
import Checkbox from "./checkbox";
import QuizSection from "./quizSection";
import { CustomQuestion, TopicQuestion } from "@/backend/types";
import QuizStartModal from "../quizStartModal/QuizStartModal";
import { useRouter } from "next/router";
import axios from "axios";
import { QuestionStatus } from "@/backend/types/questionStatus";

type Props = {
  customQuestions: CustomQuestion[] | null; // Array of topics, each containing subtopics and their questions
};

type FilteredResult = {
  unused: CustomQuestion[];
  correct: CustomQuestion[];
  incorrect: CustomQuestion[];
};

type QuestionMode = "all" | "unused" | "marked" | "incorrect";

export default function QuizSelection({ customQuestions }: Props) {
  const router = useRouter();
  const { id } = router.query;

  // States
  const [questionMode, setQuestionMode] = useState<QuestionMode>("all");
  const [questionStatuses, setQuestionStatuses] = useState<QuestionStatus[]>(
    []
  );
  const [filteredQuestions, setFilteredQuestions] = useState<FilteredResult>({
    unused: [],
    correct: [],
    incorrect: [],
  });

  const [totalQuestionsAdded, setTotalQuestionsAdded] = useState(0);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Fetch question statuses from API
  // const getQuestionStatuses = async () => {
  //   const { data } = await axios.get("/api/users/question-status");
  //   setQuestionStatuses(data.questionStatuses);
  // };

  // Filter questions based on their statuses
  const filterQuestions = (
    topics: CustomQuestion[],
    statuses: QuestionStatus[]
  ): FilteredResult => {
    const statusMap: Record<string, boolean> = statuses.reduce(
      (acc, status) => {
        acc[status.questionId] = status.correct;
        return acc;
      },
      {} as Record<string, boolean>
    );

    return {
      unused: topics.map((topic) => ({
        ...topic,
        subTopics: topic.subTopics.map((subTopic) => ({
          ...subTopic,
          questions: subTopic.questions.filter(
            (questionId) => !(questionId in statusMap) // Questions not in statusMap are unused
          ),
        })),
      })),
      correct: topics.map((topic) => ({
        ...topic,
        subTopics: topic.subTopics.map((subTopic) => ({
          ...subTopic,
          questions: subTopic.questions.filter(
            (questionId) => statusMap[questionId] === true
          ),
        })),
      })),
      incorrect: topics.map((topic) => ({
        ...topic,
        subTopics: topic.subTopics.map((subTopic) => ({
          ...subTopic,
          questions: subTopic.questions.filter(
            (questionId) => statusMap[questionId] === false
          ),
        })),
      })),
    };
  };

  // // Calculate the total number of questions added
  // useEffect(() => {
  //   setTotalQuestionsAdded(
  //     selectedTopics.reduce((acc, topic) => acc + topic?.questions?.length, 0)
  //   );
  // }, [selectedTopics]);

  // Fetch statuses and filter questions when `customQuestions` changes
  useEffect(() => {
    // Fetch question statuses only once when the component mounts
    const fetchQuestionStatuses = async () => {
      const { data } = await axios.get("/api/users/question-status");
      setQuestionStatuses(data.questionStatuses);
    };

    fetchQuestionStatuses();
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    // Filter questions whenever questionStatuses or customQuestions change
    if (customQuestions && questionStatuses.length > 0) {
      const filteredResult = filterQuestions(customQuestions, questionStatuses);
      setFilteredQuestions(filteredResult);
    }
  }, [customQuestions, questionStatuses]); // Trigger filtering only when dependencies change

  // Handle switching between question modes
  const handleQuestionModeChange = (mode: QuestionMode) => {
    setQuestionMode(mode);
  };

  // Render Quiz Sections
  const renderQuizSections = () => {
    if (!customQuestions) return null;

    const questionsToRender =
      questionMode === "all"
        ? customQuestions
        : questionMode === "unused"
        ? filteredQuestions.unused
        : questionMode === "marked"
        ? filteredQuestions.correct
        : filteredQuestions.incorrect;

    return questionsToRender.map((customQuestion, index) => (
      <QuizSection
        key={customQuestion.topic._id}
        setSelectedTopics={setSelectedTopics}
        setTotalQuestionsAdded={setTotalQuestionsAdded}
        title={customQuestion.topic.name}
        topics={customQuestion.subTopics}
      />
    ));
  };

  // Component UI
  if (customQuestions) {
    return (
      <div className="flex flex-col py-4 gap-2">
        <QuizStartModal
          moduleId={null}
          sectionId={null}
          subSectionId={null}
          limit={totalQuestionsAdded}
          selectedTime={null}
          selectedQuestions={null}
          selectedTopics={selectedTopics}
          courseId={null}
          quizId={id ? (Array.isArray(id) ? id[0] : id) : ""}
          selectedPaper={null}
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
        />

        <h2 className="text-lg font-medium">Question Mode</h2>
        <div className="bg-[#D2E5F3] rounded-2xl flex justify-between py-4 px-10 gap-10">
          <Checkbox
            label="Unused"
            count={filteredQuestions.unused.reduce(
              (acc, topic) =>
                acc +
                topic.subTopics.reduce(
                  (subAcc, subTopic) => subAcc + subTopic.questions.length,
                  0
                ),
              0
            )}
            checked={questionMode === "unused"}
            onChange={() => handleQuestionModeChange("unused")}
          />
          <Checkbox
            label="Incorrect"
            count={filteredQuestions.incorrect.reduce(
              (acc, topic) =>
                acc +
                topic.subTopics.reduce(
                  (subAcc, subTopic) => subAcc + subTopic.questions.length,
                  0
                ),
              0
            )}
            checked={questionMode === "incorrect"}
            onChange={() => handleQuestionModeChange("incorrect")}
          />
          <Checkbox
            label="Marked"
            count={filteredQuestions.correct.reduce(
              (acc, topic) =>
                acc +
                topic.subTopics.reduce(
                  (subAcc, subTopic) => subAcc + subTopic.questions.length,
                  0
                ),
              0
            )}
            checked={questionMode === "marked"}
            onChange={() => handleQuestionModeChange("marked")}
          />
          <Checkbox
            label="All"
            count={customQuestions.reduce(
              (acc, topic) =>
                acc +
                topic.subTopics.reduce(
                  (subAcc, subTopic) => subAcc + subTopic.questions.length,
                  0
                ),
              0
            )}
            checked={questionMode === "all"}
            onChange={() => handleQuestionModeChange("all")}
          />
        </div>

        <div className="bg-[#F6F6F6] border border-[#000] rounded-xl flex justify-center py-5">
          <div className="grid grid-cols-2 w-3/4 gap-6">
            {renderQuizSections()}
          </div>
        </div>

        <div className="flex justify-between mb-5">
          <p>{totalQuestionsAdded} Questions added</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-72 bg-[#4FB1C1] text-white h-14 px-16 py-3 rounded-md"
          >
            Start Exam
          </button>
        </div>
      </div>
    );
  } else {
    return <div>No custom questions for this quiz</div>;
  }
}

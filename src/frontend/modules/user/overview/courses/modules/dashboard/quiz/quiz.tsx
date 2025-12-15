"use client";
import { Progress } from "antd";
import axios from "axios";
import { Question as QuestionType } from "@/backend/types";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SubmitQuiz from "./submitQuiz";
import { userStore } from "@/store/user/user";
import FeedbackModal from "@/frontend/components/feedbackModal/FeedbackModal";
import { useQuizContext } from "@/frontend/contexts/QuizContext";
import LabValuesModal from "@/frontend/components/quiz/LabValuesModal";
import Calculator from "@/frontend/components/quiz/Calculator";

type Question = QuestionType & {
  _id: string;
  submitted: boolean;
  selectedOption: number;
};

interface OverviewItem {
  title: string;
  id: number;
  isChecked?: boolean;
}

type Submitted = {
  id: string;
  selectedOption: number;
};

interface Props {
  limit: number | null;
  quizId: string | null;
  paperId: string | null;
  time: number;
  questionIds: string | null;
  topicIds: string | null;
  videoId: string | null;
  moduleId: string | null;
  sectionId: string | null;
  subSectionId: string | null;
}

export default function Quiz({
  quizId,
  paperId,
  time,
  videoId,
  questionIds,
  topicIds,
  sectionId,
  subSectionId,
  moduleId,
  limit,
}: Props) {
  const router = useRouter();
  const url = router.asPath;
  const { setIsQuizActive } = useQuizContext();
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const { user, favourites, setFavourites } = userStore();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [addedToFavorites, setAddedToFavorites] = useState<boolean>(() => {
    if (favourites) {
      return favourites.favouriteQuizes?.some((quiz) => quiz.url === url);
    }
    return false;
  });

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [libraryName, setLibraryName] = useState<string>("");
  const [subjectName, setSubjectName] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<Submitted[]>([]);
  const [totalTime, setTotalTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isReview, setIsReview] = useState(false);
  const [questionStatistics, setQuestionStatistics] = useState<
    Record<string, any>
  >({});

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] =
    useState<boolean>(false);
  const [isLabValuesModalOpen, setIsLabValuesModalOpen] =
    useState<boolean>(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);

  const getQuestions = async (quizId: string, paperId: string) => {
    try {
      const { data } = await axios.get(
        `/api/quizes/${quizId}/library/${paperId}/`
      );
      setQuestions(
        data.quiz.questions.map((question, index) => {
          const newQuestion = {
            ...question,
            _id: `${question._id}-${index}`, // Unique rendered ID
            originalId: question._id, // Preserve the original ID
          };
          if (index === 0) setSelectedQuestion(newQuestion);
          return newQuestion;
        })
      );
      setLibraryName(data.quiz.name);
      setSubjectName(data.quiz.topic);
      setTimeLeft(time);
      setTotalTime(time);
    } catch (error) {
      console.error("getQuestions error:", error);
    }
  };

  const getQuestionsbyIds = async (questionIds: string, videoId: string) => {
    try {
      const { data } = await axios.get(
        `/api/videoCourses/${videoId}/modules/${moduleId}/section/${sectionId}/subSection/${subSectionId}/questions?questionIds=${questionIds}`
      );
      console.log("ids:", questionIds);
      console.log("q:", data.questions);
      setQuestions(
        data.questions.map((question, index) => {
          const newQuestion = {
            ...question,
            _id: `${question._id}-${index}`, // Unique rendered ID
            originalId: question._id, // Preserve the original ID
          };
          if (index === 0) setSelectedQuestion(newQuestion);
          return newQuestion;
        })
      );
      setSubjectName(data.sectionName);
      setTimeLeft(time);
      setTotalTime(time);
    } catch (err) {
      console.error(err);
    }
  };
  const getQuestionsbyTopicIds = async (topicIds: string) => {
    try {
      const { data } = await axios.get(
        `/api/quizes/${quizId}/customLibrary?topicIds=${topicIds}&limit=${limit}`
      );
      setQuestions(
        data.questions.map((question, index) => {
          const newQuestion = {
            ...question,
            _id: `${question._id}-${index}`, // Unique rendered ID
            originalId: question._id, // Preserve the original ID
          };
          if (index === 0) setSelectedQuestion(newQuestion);
          return newQuestion;
        })
      );
      setTotalTime(time);
      setTimeLeft(time);
      setSubjectName("Custom");
    } catch (error) {
      console.error("getQuestions error", error);
    }
  };

  const quizName = libraryName ? libraryName : "Custom";

  const addToFavorites = async () => {
    try {
      const { data } = await axios.post(`/api/favourites/`, {
        favouriteQuizes: [
          {
            quizName: quizName, // Add relevant quiz name
            url: url, // Add current URL
          },
        ],
      });
      setAddedToFavorites(true); // Update state
      setFavourites(data.favourites); // Update favourites
      console.log("favvs", data.favourites);
    } catch (error) {
      console.error("addToFavorites error", error);
    }
  };

  const removeFromFavorites = async () => {
    try {
      const response = await fetch(`/api/favourites/`, {
        method: "DELETE",
        body: JSON.stringify({
          favouriteQuizes: [
            {
              url: url, // Remove based on URL
            },
          ],
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setAddedToFavorites(false); // Update state
      setFavourites(data.favourites); // Update favourites
      console.log("favvs", data.favourites);
    } catch (error) {
      console.error("removeFromFavorites error", error);
    }
  };

  useEffect(() => {
    if (quizId && paperId) {
      getQuestions(quizId, paperId);
    } else if (questionIds) {
      getQuestionsbyIds(questionIds ? questionIds : "", videoId ? videoId : "");
    } else if (topicIds) {
      getQuestionsbyTopicIds(topicIds ? topicIds : "");
    }
    if (favourites) {
      setAddedToFavorites(
        favourites.favouriteQuizes?.some((quiz) => quiz.url === url)
      );
    }
  }, []);

  // Set quiz active when questions are loaded
  useEffect(() => {
    if (questions.length > 0 && !isCompleted) {
      setIsQuizActive(true);
    }
  }, [questions, isCompleted, setIsQuizActive]);

  // Set quiz inactive when quiz is completed
  useEffect(() => {
    if (isCompleted) {
      setIsQuizActive(false);
    }
  }, [isCompleted, setIsQuizActive]);

  // Cleanup: Set quiz inactive on component unmount
  useEffect(() => {
    return () => {
      setIsQuizActive(false);
    };
  }, [setIsQuizActive]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          setIsCompleted(true);
          setSelectedQuestion(questions[0]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (isCompleted) {
      clearInterval(timeLeft);
    }
    if (submitted.length === questions.length && questions.length > 0) {
      setIsCompleted(true);
      setSelectedQuestion(questions[0]);
      setIsReview(true);
    } else {
      setIsCompleted(false);
      setIsReview(false);
    }
  }, [submitted, questions]);

  const getSelectedQuestionIndex = (): number => {
    const foundQuestion = questions.find(
      (question) => question._id === selectedQuestion?._id
    );
    if (foundQuestion) {
      return questions.indexOf(foundQuestion);
    } else {
      return 0;
    }
  };

  const handleNextQuestion = () => {
    if (getSelectedQuestionIndex() === questions.length - 1) {
      return;
    }
    setSelectedQuestion(questions[getSelectedQuestionIndex() + 1]);
    setSelectedOption(null);
  };

  const handlePrevQuestion = () => {
    if (getSelectedQuestionIndex() === 0) {
      return;
    }
    setSelectedQuestion(questions[getSelectedQuestionIndex() - 1]);
    setSelectedOption(null);
  };

  console.log("left", timeLeft);
  console.log("total", totalTime);

  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
  };

  const handleSubmitQuestion = async (selectedOption: number) => {
    if (selectedOption !== null) {
      setSubmitted([
        ...submitted,
        {
          id: selectedQuestion?._id ? selectedQuestion?._id : "",
          selectedOption,
        },
      ]);
      setQuestions(
        questions.map((q) => {
          if (q._id === selectedQuestion?._id) {
            return { ...q, submitted: true, selectedOption };
          } else {
            return q;
          }
        })
      );
      try {
        console.log("📤 Submitting question:", {
          questionId: selectedQuestion?.originalId,
          questionName: selectedQuestion?.name,
          selectedOption,
          correct: selectedQuestion?.options[selectedOption].isCorrect,
        });

        await axios.post(`/api/users/question-status`, {
          questionId: selectedQuestion?.originalId,
          questionName: selectedQuestion?.name,
          correct: selectedQuestion?.options[selectedOption].isCorrect,
          selectedOption: selectedOption,
        });

        console.log("✅ Question submitted successfully");

        // Fetch statistics after submitting
        if (selectedQuestion?.originalId) {
          console.log("📊 Fetching statistics after submission");
          await fetchQuestionStatistics(selectedQuestion.originalId);
        }

        // Navigate to next question after stats are fetched
        handleNextQuestion();
      } catch (err) {
        console.error("❌ Error submitting question:", err);
        // Still navigate even if there's an error
        handleNextQuestion();
      }
    } else {
      alert("Please select an option.");
    }
  };

  const fetchQuestionStatistics = async (questionId: string) => {
    try {
      console.log("🔍 Fetching statistics for questionId:", questionId);
      const { data } = await axios.get(
        `/api/questions/${questionId}/statistics`
      );
      console.log("✅ Statistics received:", data);
      setQuestionStatistics((prev) => {
        const updated = {
          ...prev,
          [questionId]: data,
        };
        console.log("📊 Updated questionStatistics state:", updated);
        return updated;
      });
    } catch (error) {
      console.error("❌ Error fetching question statistics:", error);
    }
  };

  useEffect(() => {
    // Fetch statistics for current question when completed, in review, or submitted
    const shouldFetch =
      (isCompleted || isReview || selectedQuestion?.submitted) &&
      selectedQuestion?.originalId &&
      !questionStatistics[selectedQuestion.originalId];

    console.log("🔄 useEffect triggered:", {
      isCompleted,
      isReview,
      isSubmitted: selectedQuestion?.submitted,
      originalId: selectedQuestion?.originalId,
      hasStats: selectedQuestion?.originalId
        ? !!questionStatistics[selectedQuestion.originalId]
        : false,
      shouldFetch,
    });

    if (shouldFetch) {
      console.log("📥 Fetching statistics for question");
      fetchQuestionStatistics(selectedQuestion.originalId);
    }
  }, [selectedQuestion, isCompleted, isReview]);

  // Fallback fetch: ensure stats are fetched at least once when a question changes
  useEffect(() => {
    if (
      selectedQuestion?.originalId &&
      !questionStatistics[selectedQuestion.originalId]
    ) {
      console.log("📥 Fallback fetch for question statistics");
      fetchQuestionStatistics(selectedQuestion.originalId);
    }
  }, [selectedQuestion]);
  const optionLabels = ["A", "B", "C", "D"];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (isReview) {
    return (
      <SubmitQuiz
        quizName={quizName}
        questions={questions}
        isReview={isReview}
        setIsReview={setIsReview}
      />
    );
  } else
    return (
      <div>
        <div className="flex justify-between my-4">
          <div className="flex flex-col w-1/5">
            <div className="flex justify-around mb-4">
              <div className="flex">
                <button onClick={() => router.back()}>
                  <img src="/assets/img/icon44.png" alt="back-btn" />
                </button>
              </div>
              {libraryName && (
                <div className="bg-[#277C72] rounded-md text-white text-base px-8 py-0 flex items-center -ml-2">
                  <p className="whitespace-nowrap">{libraryName}</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLabValuesModalOpen(true)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isLabValuesModalOpen
                  ? "bg-[#277C72] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Labs
            </button>
            <button
              onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isCalculatorOpen
                  ? "bg-[#277C72] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Calculator
            </button>
            <button
              onClick={addedToFavorites ? removeFromFavorites : addToFavorites}
            >
              {addedToFavorites ? (
                <img
                  src="/assets/img/heart_filled.png"
                  alt="Fav"
                  className="w-10"
                />
              ) : (
                <img src="/assets/img/heart.png" alt="Fav" className="w-10" />
              )}
            </button>
          </div>
        </div>
        <div className="flex gap-10">
          <div className="w-[28%] border border-b-0 border-[#3E3E3E] rounded-[25px] flex justify-center pb-12 pt-3 mb-[-40px]">
            {!isCompleted ? (
              <div
                onClick={() => {
                  setIsCompleted(true);
                  setSelectedQuestion(questions[0]);
                  setIsReview(true);
                }}
                className="bg-[#F9954B] cursor-pointer text-white w-32 rounded-lg flex justify-center"
              >
                Exam End
              </div>
            ) : (
              <div
                onClick={() => setIsReview(true)}
                style={{ cursor: "pointer" }}
                className="bg-[#277C72] cursor-pointer text-white w-32 rounded-lg flex justify-center"
              >
                Review
              </div>
            )}
          </div>
          <div className="w-[72%] border border-b-0 border-[#3E3E3E] rounded-[25px] flex justify-between items-center px-8 pb-12 pt-3 mb-[-40px] z-[-1]">
            <div className="flex gap-2 items-center">
              <p className="font-medium">Subject:</p>
              <p>{subjectName}</p>
            </div>

            <div className="flex gap-2 items-center">
              <p className="font-medium">Topic:</p>
              <p>{selectedQuestion?.topic}</p>
            </div>
          </div>
        </div>
        <div className="relative flex gap-20 bg-[#F8F8F8] p-5 border border-[#3E3E3E] rounded-3xl mb-8">
          <div className="flex flex-col w-[28%] gap-5">
            <div className="flex flex-col gap-5">
              <div className="flex justify-center mt-3">
                {!isCompleted && (
                  <Progress
                    strokeColor={"#EF6A77"}
                    type="circle"
                    percent={(timeLeft / totalTime) * 100}
                    format={() => (
                      <>
                        <div>
                          <div className="font-medium">
                            {formatTime(timeLeft)}
                          </div>
                          <div className="text-sm text-[#3E3E3E]">
                            Time Left
                          </div>
                        </div>
                      </>
                    )}
                  />
                )}
              </div>
              <div
                className={`${
                  isCompleted ? "max-h-[670px]" : "max-h-96"
                } overflow-auto pr-2`}
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#EF6A77 #F1F1F1",
                }}
              >
                <h3 className="text-xl font-normal">Contents:</h3>
                <div className="space-y-2 mt-2">
                  {questions.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center cursor-pointer justify-between py-2 px-4 rounded-3xl ${
                        item._id === selectedQuestion?._id
                          ? "bg-[#EF6A77]"
                          : "bg-[#FDC9CE]"
                      }`}
                      onClick={() => {
                        setSelectedQuestion(item);
                        setSelectedOption(null);
                      }}
                    >
                      <span
                        className={`${
                          item._id === selectedQuestion?._id
                            ? "text-white"
                            : "text-[#3E3E3E]"
                        }`}
                      >
                        {`Question No. ${index + 1}`}
                        {item.submitted ? "(submitted)" : ""}
                      </span>
                      <div
                        className={`min-h-5 min-w-5 max-h-5 max-w-5 flex justify-center items-center overflow-hidden  border-2 ${
                          item.submitted
                            ? "bg-[#02DC81] border-[#38e65e]"
                            : "border-[#3E3E3E] bg-white"
                        } rounded-full`}
                      >
                        {item.submitted && isCompleted ? (
                          item.options[item.selectedOption].isCorrect ? (
                            <div className="bg-[#02DC81] min-w-5 text-center text-white">
                              ✔
                            </div>
                          ) : (
                            <div className="bg-[#FE0019] min-w-5 text-center text-white">
                              x
                            </div>
                          )
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between w-[60%]">
            <div className="flex flex-col gap-10 w-full">
              <div className="flex justify-between items-center gap-5 bg-[#FFFFFF] rounded-[21px] px-5 border-[0.5px] border-[#3E3E3E] py-1">
                <div className="flex justify-center items-center gap-2">
                  <button
                    className="flex cursor-pointer items-center gap-2"
                    onClick={handlePrevQuestion}
                    disabled={getSelectedQuestionIndex() === 0}
                  >
                    <img src="/assets/img/icon60.png" className="w-2.5" />
                    Previous
                  </button>
                </div>
                <div className="bg-[#FFD9DC] rounded-[50%] flex items-center justify-center w-10 h-10 text-sm">
                  {getSelectedQuestionIndex() + 1}/{questions.length}
                </div>
                <div className="cursor-pointer" onClick={handleNextQuestion}>
                  Skip
                </div>
                <div className="flex justify-center items-center gap-2">
                  <button
                    className="flex items-center gap-2"
                    onClick={handleNextQuestion}
                    disabled={
                      getSelectedQuestionIndex() === questions.length - 1
                    }
                  >
                    Next
                    <img src="/assets/img/icon61.png" className="w-2.5" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex justify-between items-baseline">
                  <h2 className="text-black font-medium text-4xl">
                    {selectedQuestion?.name ? selectedQuestion?.name : ""}
                  </h2>
                  <div>ID: {selectedQuestion?.displayId}</div>
                </div>
                <p className="w-[90%] text-black font-normal text-sm">
                  {selectedQuestion?.statement}
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  {selectedQuestion?.options.map((option, index) => {
                    const isSubmitted = selectedQuestion.submitted;
                    const stats = selectedQuestion?.originalId
                      ? questionStatistics[selectedQuestion.originalId]
                      : null;
                    const optionStat = stats?.options?.find(
                      (opt: any) => opt.index === index
                    );
                    const percentage = optionStat?.percentage || 0;

                    // Debug logging for first option only
                    if (index === 0) {
                      console.log("🎯 Rendering options:", {
                        questionId: selectedQuestion?._id,
                        originalId: selectedQuestion?.originalId,
                        isCompleted,
                        isReview,
                        isSubmitted,
                        hasStats: !!stats,
                        stats,
                        percentage,
                      });
                    }

                    return (
                      <div
                        key={index}
                        className={`border-[0.7px] border-[#3E3E3E] rounded-[15px] w-[70%] py-1 cursor-pointer ${
                          isCompleted
                            ? option.isCorrect
                              ? "bg-[#01C874]"
                              : selectedQuestion.selectedOption === index
                              ? "bg-red-600"
                              : ""
                            : isSubmitted
                            ? selectedQuestion.selectedOption === index
                              ? "bg-[#FFD9DC]"
                              : ""
                            : selectedOption === index
                            ? "bg-[#FFD9DC]"
                            : ""
                        }`}
                        onClick={() => {
                          if (!isSubmitted) {
                            handleOptionClick(index);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between gap-5 px-2">
                          <div className="flex items-center gap-5">
                            <div className="bg-[#EF6A77] min-w-8 min-h-8 rounded-[50%] text-white flex justify-center items-center">
                              {optionLabels[index]}
                            </div>
                            <div>{option.name}</div>
                          </div>
                          {/* Show percentages for completed/review OR submitted questions with stats */}
                          {(isCompleted || isReview || isSubmitted) && (
                            <div className="text-sm font-medium">
                              ({percentage}% Choose This Option)
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  disabled={selectedQuestion?.submitted || isCompleted}
                  onClick={() => {
                    if (selectedOption !== null) {
                      handleSubmitQuestion(selectedOption);
                    }
                  }}
                  className="bg-[#277C72] text-white rounded-[18px] w-28 flex justify-center items-center py-1"
                >
                  Submit
                </button>
              </div>
              {isCompleted && (
                <div className="flex flex-col gap-y-5">
                  <div className="flex justify-between gap-10">
                    <div className="flex-col w-full">
                      <div className="flex w-full justify-between pb-2 gap-3">
                        <span>Difficulty:</span>
                        <span>Hard</span>
                      </div>
                      <div className="h-0.5 border-0 bg-clip-padding bg-gradient-to-r from-[#4FB1C1] via-[#EF6A77] to-[#01B067]"></div>
                    </div>
                    <div className="flex-col w-full">
                      <div className="flex w-full gap-3 justify-between pb-2">
                        <span>Topic:</span>
                        <span>{selectedQuestion?.topic}</span>
                      </div>
                      <div className="h-0.5 border-0 bg-clip-padding bg-gradient-to-r from-[#4FB1C1] via-[#EF6A77] to-[#01B067]"></div>
                    </div>
                  </div>
                  <div className="h-0.5 border-0 bg-transparent"></div>

                  <div className="bg-[#F8F8F8] flex flex-col gap-y-5">
                    <span className="bg-[#FDC9CE] w-36 flex justify-center px-5 py-2 rounded-md">
                      Explanation
                    </span>
                    <p>{selectedQuestion?.explanation}</p>
                  </div>
                  <div className="h-0.5 border-0 bg-clip-padding bg-gradient-to-r from-[#4FB1C1] via-[#EF6A77] to-[#01B067]"></div>
                  <div className="pt-2">
                    <h2 className="font-bold">Reference</h2>
                    <a className="underline" href={selectedQuestion?.reference}>
                      {selectedQuestion?.reference}
                    </a>
                    <p>
                      Have comments about this Question?{" "}
                      <span
                        className="text-[#f8b3ba] underline cursor-pointer"
                        onClick={() => setIsFeedbackModalOpen(true)}
                      >
                        Leave us Feedback
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <FeedbackModal
          isModalVisible={isFeedbackModalOpen}
          setIsModalVisible={setIsFeedbackModalOpen}
          type="question"
          userId={user?.displayId}
          id={selectedQuestion?.displayId}
        />
        <LabValuesModal
          isModalVisible={isLabValuesModalOpen}
          setIsModalVisible={setIsLabValuesModalOpen}
        />
        <Calculator
          isOpen={isCalculatorOpen}
          onClose={() => setIsCalculatorOpen(false)}
        />
      </div>
    );
}

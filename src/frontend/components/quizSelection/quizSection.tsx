import { TopicQuestion } from "@/backend/types";
import { useState, Dispatch, SetStateAction } from "react";

interface QuizSectionProps {
  title: string;
  topics: TopicQuestion[] | undefined;
  setTotalQuestionsAdded: Dispatch<SetStateAction<number>>;
  setSelectedTopics: Dispatch<SetStateAction<string[]>>; // Now expects an array of IDs
}

export default function QuizSection({
  title,
  topics,
  setSelectedTopics,
  setTotalQuestionsAdded,
}: QuizSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [topicChecked, setTopicChecked] = useState(
    topics ? new Array(topics.length).fill(false) : []
  );

  const handleTitleToggle = () => {
    const allChecked = topicChecked.every((checked) => checked); // Are all subtopics currently checked?

    if (allChecked) {
      // If all are checked, uncheck all
      setTopicChecked(new Array(topicChecked.length).fill(false));
      setSelectedTopics((prev) =>
        prev.filter((id) => !topics?.some((topic) => topic._id === id))
      );
      setTotalQuestionsAdded(
        (prev) =>
          prev -
          topics!.reduce((sum, topic, index) => {
            if (topicChecked[index]) return sum + topic.questions.length;
            return sum;
          }, 0)
      );
    } else {
      // If not all are checked, check all
      const updatedSelectedTopics: string[] = [];
      let newQuestionsCount = 0;

      const newCheckedState = topics!.map((topic, index) => {
        // Skip topics already in `selectedTopics`
        if (!topicChecked[index]) {
          updatedSelectedTopics.push(topic._id);
          newQuestionsCount += topic.questions.length;
          return true; // Mark as checked
        }
        return topicChecked[index]; // Keep current state if already selected
      });

      setTopicChecked(newCheckedState); // Update checked state
      setSelectedTopics((prev) => [...prev, ...updatedSelectedTopics]); // Add only new topics
      setTotalQuestionsAdded((prev) => prev + newQuestionsCount); // Add only new questions
    }
  };

  const handleTopicToggle = (index: number) => {
    const newCheckedState = [...topicChecked];
    newCheckedState[index] = !newCheckedState[index];
    setTopicChecked(newCheckedState);

    const topicQuestionsCount = topics![index].questions.length;

    if (newCheckedState[index]) {
      // Topic is checked: Add topic ID and increment total questions
      setSelectedTopics((prev) => [...prev, topics![index]._id]);
      setTotalQuestionsAdded((prev) => prev + topicQuestionsCount);
    } else {
      // Topic is unchecked: Remove topic ID and decrement total questions
      setSelectedTopics((prev) =>
        prev.filter((id) => id !== topics![index]._id)
      );
      setTotalQuestionsAdded((prev) => prev - topicQuestionsCount);
    }
  };

  if (!topics) return <div>Error</div>;

  return (
    <div>
      <div className="flex justify-between items-center px-20">
        <div className="flex gap-2 items-center">
          {isOpen ? (
            <img
              onClick={() => setIsOpen(!isOpen)}
              src="/assets/img/icon59.png"
              alt="image"
              className="w-3"
            />
          ) : (
            <img
              onClick={() => setIsOpen(!isOpen)}
              src="/assets/img/icon58.png"
              alt="image"
              className="w-2"
            />
          )}
          <div className="flex items-center">
            {/* Hidden default checkbox */}
            <input
              type="checkbox"
              checked={
                topicChecked.filter((t) => t === true).length === topics.length
              }
              onClick={() => setIsOpen(true)} // Optional: Handle open state for dropdown
              onChange={handleTitleToggle} // Handle the title toggle
              className="hidden"
            />

            {/* Custom checkbox */}
            <div
              onClick={() => {
                setIsOpen(true);
                handleTitleToggle();
              }} // Optional: Handle click on the custom checkbox
              className={`w-6 h-6 border-2 border-blue-500 rounded-md flex justify-center items-center cursor-pointer bg-transparent ${
                topicChecked.filter((t) => t === true).length ===
                  topics.length && "ring-1"
              }`}
            >
              {/* Show blue checkmark when checked */}
              {topicChecked.filter((t) => t === true).length ===
                topics.length && (
                <svg
                  className="stroke-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </div>

          <span onClick={() => setIsOpen(!isOpen)}>{title}</span>
          <div className="border border-[#056FBB] rounded-xl px-2 text-[#056FBB]">
            {topics.reduce((sum, topic) => sum + topic?.questions?.length, 0)}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="pl-32 flex flex-col gap-3 pt-3">
          {topics.map((topic, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div className="flex items-center">
                {/* Hidden default checkbox */}
                <input
                  type="checkbox"
                  className="hidden"
                  checked={topicChecked[index]}
                  onChange={() => handleTopicToggle(index)}
                />

                {/* Custom checkbox */}
                <div
                  onClick={() => handleTopicToggle(index)}
                  className={`w-5 h-5 border-2 border-blue-500 rounded-md flex justify-center items-center cursor-pointer bg-transparent${
                    topicChecked[index] && "ring-1"
                  }`}
                >
                  {/* Checkmark */}
                  {topicChecked[index] && (
                    <svg
                      className="stroke-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="5"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>

              <span>{topic.name}</span>
              <div className="border border-[#056FBB] rounded-xl px-2 text-[#056FBB]">
                {topic?.questions?.length}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

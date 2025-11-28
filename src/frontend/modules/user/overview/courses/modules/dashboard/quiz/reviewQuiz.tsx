"use client";
import { useState, useEffect } from "react";

interface Module {
  title: string;
}

interface OverviewItem {
  title: string;
  id: number;
  isChecked?: boolean;
  explanation?: string;
  reference?: string;
}

interface Question {
  id: number;
  title: string;
  options: string[];
  correctOption: number;
  explanation: string;
  reference: string;
}

export default function ReviewQuiz() {
  const [module, setModule] = useState<Module | null>(null);
  const [overviewItems, setOverviewItems] = useState<OverviewItem[]>([]);
  const [selectedOverview, setSelectedOverview] = useState<OverviewItem | null>(
    null
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    const fetchedModule = {
      title: "Neurology",
    };

    const fetchedOverviewItems: OverviewItem[] = [
      {
        title: "Question 1",
        id: 1002,
        explanation: "Explanation for Question 1",
      },
      {
        title: "Question 2",
        id: 1003,
        explanation: "Explanation for Question 2",
      },
      {
        title: "Question 3",
        id: 1006,
        explanation: "Explanation for Question 3",
      },
    ];

    const fetchedQuestions: Question[] = [
      {
        id: 1002,
        title:
          "A 58-Year-Old Gentleman Is Transferred For Percutaneous Coronary Intervention Following An ST-Elevation Myocardial Infarction (STEMI). He Has A Past Medical History Of Hypertension, Diabetes Mellitus And Hypercholesterolaemia. He Is Found To Have ST-Elevation In Leads II, III, And AVF On A Standard 12-Lead ECG. Which Coronary Vessel Is Most Likely To Be Affected?",
        options: [
          "Left Main",
          "Left Anterior Descending (LAD)",
          "Circumflex Artery (Cx)",
          "Right Coronary Artery (RCA)",
        ],
        correctOption: 3,
        explanation:
          "Pericarditis typically presents with acute chest pain which is often sharp, worse on inspiration and relieved by sitting forward. There are many causes of pericarditis, one of the most common being viral secondary to coxsackie B infection. The classical feature of acute pericarditis on an ECG is widespread ST-changes. These are typically described as ‘saddle-shaped’. Treatment of acute pericarditis is dependent on the underlying cause. Viral and idiopathic aetiologies are generally managed with non-steroidal anti-inflammatories (e.g. ibuprofen).",
        reference: "https://app.pulsenotes.com/exam/questions/351?pqp=0.0",
      },
      {
        id: 1003,
        title:
          "A 35-Year-Old Woman Presents With A Severe Headache, Visual Disturbance, And Vomiting. She Has A Past Medical History Of Migraine And Hypertension. A CT Scan Reveals A Subarachnoid Hemorrhage. What Is The Most Likely Cause?",
        options: [
          "Berry Aneurysm",
          "Arteriovenous Malformation",
          "Hypertensive Encephalopathy",
          "Migraine",
        ],
        correctOption: 0,
        explanation:
          "A subarachnoid hemorrhage is most commonly caused by a ruptured berry aneurysm. These are typically found in the Circle of Willis and can be associated with genetic conditions such as polycystic kidney disease.",
        reference: "https://example.com/reference/1003",
      },
      {
        id: 1006,
        title:
          "A 40-Year-Old Man Presents With Progressive Weakness And Fatigue. Physical Examination Reveals Pallor And Mild Jaundice. Laboratory Tests Show A Hemoglobin Level Of 8 g/dL, Reticulocyte Count Of 6%, And Indirect Bilirubin Of 2.5 mg/dL. What Is The Most Likely Diagnosis?",
        options: [
          "Iron Deficiency Anemia",
          "Hemolytic Anemia",
          "Aplastic Anemia",
          "Thalassemia",
        ],
        correctOption: 1,
        explanation:
          "The laboratory findings of anemia with a high reticulocyte count and elevated indirect bilirubin suggest hemolytic anemia. This condition can result from various causes, including autoimmune disorders, infections, and certain medications.",
        reference: "https://example.com/reference/1006",
      },
    ];

    fetchedOverviewItems[0].isChecked = true;

    setModule(fetchedModule);
    setOverviewItems(fetchedOverviewItems);
    setQuestions(fetchedQuestions);
    setSelectedOverview(fetchedOverviewItems[0]);
  }, []);

  const handleOverviewClick = (item: OverviewItem) => {
    const updatedOverviewItems = overviewItems.map((i) => {
      if (i === item) {
        return { ...i, isChecked: true };
      } else {
        return { ...i, isChecked: false };
      }
    });
    setOverviewItems(updatedOverviewItems);
    setSelectedOverview(item);
    setCurrentQuestionIndex(overviewItems.findIndex((i) => i.id === item.id));
    setSelectedOption(null);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setSelectedOverview(overviewItems[nextIndex]);

      const updatedOverviewItems = overviewItems.map((item, index) => ({
        ...item,
        isChecked: index === nextIndex,
      }));
      setOverviewItems(updatedOverviewItems);
      setSelectedOption(null);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      setSelectedOverview(overviewItems[prevIndex]);

      const updatedOverviewItems = overviewItems.map((item, index) => ({
        ...item,
        isChecked: index === prevIndex,
      }));
      setOverviewItems(updatedOverviewItems);
      setSelectedOption(null);
    }
  };

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="">
      <div className="flex justify-between mt-4">
        <div className="flex flex-col w-1/5">
          <div className="flex justify-between mb-4">
            <div className="flex">
              <button onClick={() => <></>}>
                <img src="/assets/img/icon44.png" alt="back-btn" />
              </button>
            </div>
            <div className="bg-[#277C72] rounded-md text-white text-base px-14 py-0 flex items-center">
              <p>{module?.title}</p>
            </div>
          </div>
        </div>
        <div>
          <img src="/assets/img/icon46.png" alt="Fav" className="w-10" />
        </div>
      </div>
      <div className="flex gap-10 justify-end">
        <div className="w-[72%] border border-b-0 border-[#3E3E3E] rounded-[25px] flex justify-around items-center px-5 pb-12 pt-3 mb-[-40px] z-[-1]">
          <div className="flex gap-2 items-center">
            <p className="font-medium">Subject:</p>
            <p className="text-sm">Anatomy</p>
          </div>

          <div className="flex gap-2 items-center">
            <p className="font-medium">Topic:</p>
            <p className="text-sm">Cell Physiology</p>
          </div>
        </div>
      </div>
      <div className="flex gap-20 bg-[#F8F8F8] p-5 border border-[#3E3E3E] rounded-3xl">
        <div className="flex flex-col w-[28%] gap-5">
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-xl font-normal">Contents:</h3>
              <div className="space-y-2 mt-2">
                {overviewItems.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between py-2 px-4 rounded-3xl ${
                      item.isChecked ? "bg-[#EF6A77]" : "bg-[#FDC9CE]"
                    }`}
                    onClick={() => handleOverviewClick(item)}
                  >
                    <span
                      className={`${
                        item.isChecked ? "text-white" : "text-[#3E3E3E]"
                      }`}
                    >
                      {item.title}
                    </span>
                    <div className="flex gap-2 items-center">
                      <span className="text-[#056FBB] text-[9px] underline">
                        Explanation
                      </span>
                      <input
                        className="w-5 h-5"
                        type="radio"
                        checked={item.isChecked}
                        readOnly
                        style={{
                          background: item.isChecked ? "#02DC81" : "revert",
                          border: item.isChecked ? "2px solid white" : "revert",
                          borderRadius: item.isChecked ? "50%" : "revert",
                          appearance: item.isChecked ? "none" : "revert",
                        }}
                      />
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
                  className="flex items-center gap-2"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <img src="/assets/img/icon60.png" className="w-2.5" />
                  Previous
                </button>
              </div>
              <div className="bg-[#FFD9DC] rounded-[50%] flex items-center justify-center w-10 h-10 text-sm">
                {currentQuestionIndex + 1}/{overviewItems.length}
              </div>
              <div>Skip</div>
              <div className="flex justify-center items-center gap-2">
                <button
                  className="flex items-center gap-2"
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Next
                  <img src="/assets/img/icon61.png" className="w-2.5" />
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="w-[90%] flex flex-col gap-5">
                <h2 className="text-black font-medium text-4xl">
                  {selectedOverview?.title ? selectedOverview?.title : ""}
                </h2>
                <p className="text-black font-normal text-sm">
                  {questions[currentQuestionIndex]?.title}
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  {questions[currentQuestionIndex]?.options.map(
                    (option, index) => (
                      <div
                        key={index}
                        className={`border-[0.7px] border-[#3E3E3E] rounded-[15px] w-[70%] py-1 cursor-pointer ${
                          index ===
                          questions[currentQuestionIndex]?.correctOption
                            ? "bg-[#02DC81]"
                            : index === selectedOption
                            ? "bg-[#EF6A77]"
                            : ""
                        }`}
                        onClick={() => setSelectedOption(index)}
                        style={{ pointerEvents: "none" }}
                      >
                        <div className="flex items-center gap-5 px-2">
                          <div
                            className={`w-8 h-8 rounded-[50%] text-white flex justify-center items-center ${
                              index ===
                              questions[currentQuestionIndex]?.correctOption
                                ? "bg-[#02DC81]"
                                : "bg-[#EF6A77]"
                            }`}
                          >
                            {optionLabels[index]}
                          </div>
                          <div>{option}</div>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="flex justify-between gap-4">
                  <div className="flex flex-col gap-2 w-2/4">
                    <div className="flex gap-2 justify-between">
                      <p>Difficulty level:</p>
                      <p>Hard</p>
                    </div>
                    <hr className="linear-Line h-[2px]" />
                  </div>
                  <div className="flex flex-col gap-2 w-2/4">
                    <div className="flex gap-2 justify-between">
                      <p>Topic:</p>
                      <p>Anatomy</p>
                    </div>
                    <hr className="linear-Line h-[2px]" />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="bg-[#FDC9CE] flex justify-center items-center w-32 rounded-[11px]">
                    Explanation:
                  </div>
                  <div>{questions[currentQuestionIndex]?.explanation}</div>
                  <hr className="linear-Line h-[3px]" />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center w-32 rounded-[11px]">
                    Reference:
                  </div>
                  <div>
                    <a
                      href={questions[currentQuestionIndex]?.reference}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {questions[currentQuestionIndex]?.reference}
                    </a>
                  </div>
                  <div className="text-sm">
                    Have comments about this Quiz? 
                    <span className="text-[#EF6A77] underline">
                      Leave us feedback
                    </span>
                  </div>
                </div>
              </div>
              <div>ID: {selectedOverview?.id}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

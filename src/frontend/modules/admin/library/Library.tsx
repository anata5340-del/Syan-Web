"use client";
import { SetStateAction, useState } from "react";
import Quiz from "./question/question";
import Notes from "./notes/notes";
import Videos from "./videos/videos";

export default function Library() {
  const addBtnStyle = {
    background: "#01B067",
    padding: "16px 35px",
    borderRadius: "unset",
  };

  type ActiveSection = "notes" | "questions" | "videos";

  const [activeSection, setActiveSection] = useState<ActiveSection>("notes"); // Default active section is "notes"

  const handleSectionClick = (section: SetStateAction<ActiveSection>) => {
    setActiveSection(section);
  };

  return (
    <>
      <div className="flex flex-col mt-8 gap-10">
        <div className="flex flex-col text-white gap-5">
          <div className="bg-colordarkblue flex justify-between items-center rounded-t-xl h-24 px-10 gap-5 text-lg">
            <div
              className={`border cursor-pointer border-white rounded-md gap-2 py-1 px-14 flex items-center ${
                activeSection === "notes" ? "bg-white text-colorblack" : ""
              }`}
              onClick={() => handleSectionClick("notes")}
            >
              <img
                src="/assets/img/icon21.png"
                className={activeSection === "notes" ? "active-img" : ""}
                alt="Notes"
              />
              <p className="text-base">Read Notes</p>
            </div>
            <div
              className={`border cursor-pointer border-white rounded-md gap-2 py-1 px-20 flex items-center ${
                activeSection === "questions" ? "bg-white text-colorblack" : ""
              }`}
              onClick={() => handleSectionClick("questions")}
            >
              <img
                src="/assets/img/icon23.png"
                className={activeSection === "questions" ? "active-img" : ""}
                alt="Quiz"
              />
              <p className="text-base">Questions</p>
            </div>
            <div
              className={`border cursor-pointer border-white rounded-md gap-2 py-1 px-20 flex items-center ${
                activeSection === "videos" ? "bg-white text-colorblack" : ""
              }`}
              onClick={() => handleSectionClick("videos")}
            >
              <img
                src="/assets/img/icon22.png"
                className={activeSection === "videos" ? "active-img" : ""}
                alt="Videos"
              />
              <p className="text-base">Videos</p>
            </div>
          </div>
          <div>
            {activeSection === "notes" && <Notes />}
            {activeSection === "questions" && <Quiz />}
            {activeSection === "videos" && <Videos />}
          </div>
        </div>
      </div>
      <style jsx>{`
        .active-img {
          filter: invert(1); /* Inverts the color of the image */
        }
      `}</style>
    </>
  );
}

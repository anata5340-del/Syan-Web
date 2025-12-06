"use client";

import { Note } from "@/backend/types";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { userStore } from "@/store/user/user";
import React from "react";
import QuizStartModal from "@/frontend/components/quizStartModal/QuizStartModal";
import FeedbackModal from "@/frontend/components/feedbackModal/FeedbackModal";

interface Props {
  noteId: string;
  videoId: string | undefined;
  courseId: string | undefined;
  moduleId: string | undefined;
  sectionId: string | undefined;
  subSectionId: string | undefined;
  subSectionBlockId: string | undefined;
  subSectionBlockName: string | undefined;
}

export default function Notes({
  noteId,
  courseId,
  moduleId,
  sectionId,
  subSectionId,
  subSectionBlockId,
  subSectionBlockName,
  videoId,
}: Props) {
  const router = useRouter();
  const { user, favourites, getFavourites, setFavourites } = userStore();
  const [selectedContent, setSelectedContent] = useState(0);
  const [note, setNote] = useState<Note | null>(null);
  const [addedToFavourites, setAddedToFavourites] = useState(() => {
    if (favourites && note?._id) {
      return favourites.favouriteNotes.some((n) => n.note?._id === note._id);
    } else {
      return false;
    }
  });
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [manuallyUnchecked, setManuallyUnchecked] = useState<number[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] =
    useState<boolean>(false);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const url = router.asPath;

  const getNote = async () => {
    try {
      const { data } = await axios.get(
        `/api/videoCourses/${courseId}/modules/${moduleId}/section/${sectionId}/subSection/${subSectionId}/subSectionBlock/${subSectionBlockId}/note`
      );
      console.log("data =>>>>>>>>>>>>>>>>>", data);
      setNote(data.data);
    } catch (error) {
      console.error("getNote Error", error);
    }
  };

  // Fetch the note-status
  const fetchNoteStatus = async () => {
    try {
      const { data } = await axios.get(
        `/api/users/note-status?noteId=${noteId}`
      );
      // Find the correct noteStatus object where noteId matches the current noteId
      const noteStatus = data.noteStatus.find(
        (status: { noteId: string }) => status.noteId === note?._id
      );
      if (noteStatus) {
        // Create a map of `contentId` to its `completed` status from the matched noteStatus
        const noteStatusMap = new Map(
          noteStatus.content.map(
            (content: { contentId: string; completed: boolean }) => [
              content.contentId,
              content.completed,
            ]
          )
        );
        // Populate `checkedItems` with indexes of completed content
        const completedContentIndexes =
          note?.content
            ?.map((content, index) => {
              const isCompleted = noteStatusMap.get(content._id); // Match contentId from API with _id in note.content
              return isCompleted ? index : null;
            })
            .filter((index) => index !== null) || [];

        setCheckedItems(completedContentIndexes as number[]);
      } else {
        console.warn("No matching noteStatus found for noteId:", noteId);
      }
    } catch (error) {
      console.error("fetchNoteStatus Error:", error);
    }
  };

  const addToFavourites = async () => {
    try {
      const { data } = await axios.post(`/api/favourites/`, {
        favouriteNotes: [
          {
            _id: note._id, // Note ID
            url: url, // Construct the URL dynamically
          },
        ],
      });
      // console.log("data", data);
      setAddedToFavourites(true);
      setFavourites(data.favourites);
    } catch (error) {
      console.error("addToFavourites error ", error);
    }
  };
  const deleteFromFavourites = async () => {
    try {
      const payload = {
        favouriteNotes: [
          {
            _id: note._id, // Note ID to remove
          },
        ],
      };

      const response = await fetch(`/api/favourites/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Favourites removed:", data);
      setAddedToFavourites(false); // Update UI state
      setFavourites(data.favourites); // Update favourites state
    } catch (error) {
      console.error("Error removing from favourites:", error);
    }
  };

  const handleScrollToContent = (index: number) => {
    if (contentRefs.current[index]) {
      contentRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle automatic checking when a content block is in view
  const handleScrollAutoCheck = (index: number) => {
    if (manuallyUnchecked.includes(index)) return; // Skip if user manually unchecked
    if (!checkedItems.includes(index)) {
      setCheckedItems((prev) => [...prev, index]);
      setTimeout(() => {
        updateNoteStatus(index, true);
      }, index * 1000);
      // Mark as completed
    }
  };

  const updateNoteStatus = async (index: number, completed: boolean) => {
    if (!note) return;
    try {
      const contentId = note?.content[index]?._id;
      const noteId = note?._id;
      const noteName = note?.name;

      if (!contentId || !noteId || !noteName) {
        throw new Error("Content ID, Note ID, or Note Name is missing");
      }

      await axios.post("/api/users/note-status", {
        noteId,
        noteName,
        contentId,
        completed,
        url,
      });
    } catch (error) {
      console.error("Error updating note status", error);
    }
  };

  const handleCheckboxChange = (index: number) => {
    const isChecked = checkedItems.includes(index);
    setManuallyUnchecked((prev) =>
      isChecked ? [...prev, index] : prev.filter((item) => item !== index)
    );

    const updatedCheckedItems = isChecked
      ? checkedItems.filter((item) => item !== index)
      : [...checkedItems, index];
    setCheckedItems(updatedCheckedItems);
    updateNoteStatus(index, !isChecked);
  };

  // Setup Intersection Observer for scroll tracking
  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting) {
            handleScrollAutoCheck(index);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -10% 0px", // Adjust this to customize when the observer triggers
        threshold: 0.1, // Trigger as soon as 10% of the content is visible
      } // Trigger when 70% of the block is visible
    );

    contentRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.setAttribute("data-index", index.toString()); // Ensure the index is set
        observer.current?.observe(ref);
      }
    });

    return () => {
      observer.current?.disconnect();
    };
  }, [manuallyUnchecked, checkedItems, note]);

  useEffect(() => {
    getsubSection(
      courseId,
      moduleId,
      sectionId,
      subSectionId,
      subSectionBlockId
    );
    getNote();
  }, []);
  useEffect(() => {
    fetchNoteStatus();
  }, [note]);

  useEffect(() => {
    if (favourites && note?._id) {
      setAddedToFavourites(
        favourites.favouriteNotes.some((n) => n.note?._id === note._id)
      );
    } else {
      setAddedToFavourites(false);
    }
  }, [favourites, note]);

  const getsubSection = async (
    courseId: string,
    moduleId: string,
    sectionId: string,
    subSectionId: string,
    subSectionBlockId: string // Pass the subSectionBlockId to find
  ) => {
    try {
      const { data } = await axios.get(
        `/api/videoCourses/${courseId}/modules/${moduleId}/section/${sectionId}/subSection/${subSectionId}`
      );

      // Assuming `data.subSection.subSectionBlocks` is the array you provided
      const subSectionBlocks = data.subSection.subSectionBlocks;

      // Find the block with the matching subSectionBlockId
      const selectedBlock = subSectionBlocks.find(
        (block) => block._id === subSectionBlockId
      );

      // Extract the questions array or set to an empty array if not found
      const selectedQuestions = selectedBlock ? selectedBlock.questions : [];

      console.log("Selected Questions:", selectedQuestions);
      setSelectedQuestions(selectedQuestions);
      return selectedQuestions;
    } catch (error) {
      console.error("Error getting subSection:", error);
      return [];
    }
  };

  return (
    <div>
      <QuizStartModal
        moduleId={moduleId}
        limit={selectedQuestions.length}
        sectionId={sectionId}
        subSectionId={subSectionId}
        selectedTopics={null}
        selectedTime={null}
        courseId={courseId}
        selectedQuestions={selectedQuestions}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedPaper={null}
        quizId={null}
      />
      <div className="flex justify-between mt-4">
        <div className="flex flex-col w-1/4">
          <div className="flex justify-between mb-4">
            <div className="flex">
              <button onClick={() => router.back()}>
                <img src="/assets/img/icon44.png" alt="back-btn" />
              </button>
            </div>
            <div className="bg-[#FF4B5D] rounded-md text-white text-base w-2/3 flex justify-center items-center">
              <p>{subSectionBlockName}</p>
            </div>
          </div>
        </div>
        <div>
          <button
            onClick={addedToFavourites ? deleteFromFavourites : addToFavourites}
          >
            {addedToFavourites ? (
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
      <div className="flex gap-20">
        {/* Sidebar */}
        <div className="flex flex-col w-[28%] gap-5 sticky top-4 h-screen overflow-auto">
          <div className="flex flex-col gap-5">
            <h2>Further Study:</h2>
            <div className="flex justify-between gap-1">
              <div
                onClick={() =>
                  router.push(
                    `/user/videoCourses/${courseId}/modules/dashboard/videos/${videoId}?m=${moduleId}&s=${sectionId}&ss=${subSectionId}&ssb=${subSectionBlockId}&ssbt=${subSectionBlockName}&n=${noteId}`
                  )
                }
                className="w-1/2 text-sm border border-[#3E3E3E] rounded-lg p-5 py-2 flex gap-2 items-center cursor-pointer"
              >
                <img src="/assets/img/icon47.png" alt="View Video" />
                View Video
              </div>
              <div
                onClick={() => setIsModalOpen(true)}
                className="w-1/2 text-sm border cursor-pointer border-[#3E3E3E] rounded-lg p-5 py-2 flex gap-2 items-center"
              >
                <img src="/assets/img/icon48.png" alt="Practice Quiz" />
                Practice Quiz
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="p-4 bg-[#FFF1F3] rounded-2xl">
              <div className="flex justify-between items-start">
                <div className="w-4/6">
                  <p className="text-sm text-[#000]">Author</p>
                  <h2 className="text-xl font-bold text-[#000] mb-0">
                    {note?.author}
                  </h2>
                  <p className="text-sm text-[#000]">
                    A dedicated team of UK doctors who want to make learning
                    medicine beautifully simple.
                  </p>
                </div>
                <div className="w-2/6 flex items-start justify-start">
                  <img
                    src="/assets/img/icon45.png"
                    alt="SYAN Logo"
                    className=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2 mt-2">
            <h3 className="text-xl font-normal">Contents:</h3>
            {note?.content?.map((content, index) => (
              <div
                key={index}
                className={`flex items-center justify-between py-2 px-4 rounded-3xl cursor-pointer ${
                  checkedItems.includes(index) ? "bg-[#EF6A77]" : "bg-[#FDC9CE]"
                }`}
                onClick={() => handleScrollToContent(index)}
              >
                <span
                  className={`${
                    checkedItems.includes(index)
                      ? "text-white"
                      : "text-[#3E3E3E]"
                  }`}
                >
                  {content.name}
                </span>
                <div
                  className="relative w-5 h-5 cursor-pointer "
                  onClick={() => {
                    handleCheckboxChange(index);
                  }}
                >
                  {/* Custom styled checkbox */}
                  <span
                    className={`w-5 h-5 flex items-center justify-center rounded-full border hover:border-[#02DC81] ${
                      checkedItems.includes(index)
                        ? "bg-[#02DC81] border-2 border-[#02DC81] after:content-['✔'] after:text-white after:font-bold after:text-[14px]"
                        : "bg-white border-2 border-gray-400"
                    }`}
                  ></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex w-[60%] flex-col gap-5">
          <div className="flex justify-between items-baseline">
            <h2 className="text-black font-medium text-4xl">{note?.title}</h2>
            <div>ID: {note?.displayId}</div>
          </div>
          <p className="text-black font-normal text-sm -mt-4 ml-1">Notes</p>
          {note?.content?.length > 0 &&
            note?.content?.map((content, index) => (
              <div
                key={index}
                ref={(el) => (contentRefs.current[index] = el)}
                // className="mb-8"
              >
                <div className="bg-[#FF4B5D] rounded-md text-white text-lg font-normal px-6 py-1 flex items-center justify-center w-auto">
                  <p>{content.name}</p>
                </div>
                <MarkdownEditor content={content.content} />
              </div>
            ))}
          <div className="flex gap-x-3 pb-20">
            <span>Have comments about this note?</span>
            <span
              className="text-[#f8b3ba] underline cursor-pointer"
              onClick={() => setIsFeedbackModalOpen(true)}
            >
              Leave us Feedback
            </span>
          </div>
        </div>
      </div>
      <FeedbackModal
        isModalVisible={isFeedbackModalOpen}
        setIsModalVisible={setIsFeedbackModalOpen}
        type="note"
        userId={user?.displayId}
        id={note?.displayId}
      />
    </div>
  );
}

import { useMemo } from "react";
import { marked } from "marked";

// Define the types for the component
interface MarkdownEditorProps {
  content: string;
}

// Detect if content is HTML or Markdown (for backward compatibility)
const isHtml = (content: string): boolean => {
  if (!content) return false;
  // Check for HTML tags
  const htmlTagPattern = /<[a-z][\s\S]*>/i;
  return htmlTagPattern.test(content);
};

export function MarkdownEditor({ content }: MarkdownEditorProps) {
  // Convert content to HTML for display
  // If content is already HTML, use it directly
  // If content is Markdown (backward compatibility), convert it to HTML
  const htmlContent = useMemo(() => {
    if (!content) return "";

    if (isHtml(content)) {
      // Already HTML, use directly
      return content;
    }

    // It's Markdown, convert to HTML for backward compatibility
    try {
      return marked.parse(content) as string;
    } catch (error) {
      console.error("Error converting markdown to HTML:", error);
      return content;
    }
  }, [content]);

  return (
    <div style={{ padding: "1rem" }}>
      {/* Add a <style> tag to apply custom styles */}
      <style>
        {`
          /* Center the images */
          img {
            display: block;
            margin-left: auto;
            margin-right: auto;
            max-width: 100%;
            height: auto;
          }
  
          /* Style the h1 element */
          h1 {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 1rem;
          }
  
          /* Style the h2 element */
          h2 {
            font-size: 1.75rem;
            font-weight: 600;
            margin-bottom: 0.8rem;
          }
  
          /* Style the h3 element */
          h3 {
            font-size: 1.5rem;
            font-weight: 500;
            margin-bottom: 0.6rem;
          }
  
          /* Style the h4 element */
          h4 {
            font-size: 1.25rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
          }
  
          /* Style the h5 element */
          h5 {
            font-size: 1.125rem;
            font-weight: 400;
            margin-bottom: 0.4rem;
          }
  
          /* Style the h6 element */
          h6 {
            font-size: 1rem;
            font-weight: 400;
            margin-bottom: 0.3rem;
          }

          /* Table styles */
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
          }

          table th,
          table td {
            border: 1px solid #ddd;
            padding: 8px 12px;
            text-align: left;
          }

          table th {
            background-color: #f2f2f2;
            font-weight: 600;
          }

          table tr:nth-child(even) {
            background-color: #f9f9f9;
          }

          /* List styles */
          ul, ol {
            margin: 1rem 0;
            padding-left: 2rem;
          }

          ul li, ol li {
            margin: 0.5rem 0;
          }

          /* Link styles */
          a {
            color: #1890ff;
            text-decoration: underline;
          }

          a:hover {
            color: #40a9ff;
          }

          /* Paragraph styles */
          p {
            margin: 1rem 0;
            line-height: 1.6;
          }

          /* Code styles */
          code {
            background-color: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
          }

          pre {
            background-color: #f4f4f4;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
            margin: 1rem 0;
          }

          pre code {
            background-color: transparent;
            padding: 0;
          }

          /* Blockquote styles */
          blockquote {
            border-left: 4px solid #ddd;
            margin: 1rem 0;
            padding-left: 1rem;
            color: #666;
            font-style: italic;
          }

          /* Preserve all colors and formatting from TinyMCE */
          /* Note: Removed 'color: inherit' to allow inline color styles to work */
          
          /* Ensure inline styles are preserved */
          .note-content-wrapper * {
            /* Don't override inline styles */
          }
          
          /* Preserve text colors from inline styles */
          .note-content-wrapper [style*="color"] {
            /* Let inline color styles work */
          }
        `}
      </style>

      {/* Render the HTML content directly */}
      {htmlContent ? (
        <div
          className="note-content-wrapper"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      ) : (
        <p>No content to display.</p>
      )}
    </div>
  );
}

"use client";
import { NoteStatus } from "@/backend/types/noteStatus";
import { QuestionStatus } from "@/backend/types/questionStatus";
import { VideoStatus } from "@/backend/types/videoStatus";
import Box from "@/frontend/components/box/Box";
import RightSidebar from "@/frontend/components/rightSidebar/RightSidebar";
import { userStore } from "@/store/user/user";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Favourite() {
  const { favourites } = userStore();
  const [questionStatuses, setQuestionStatuses] = useState<QuestionStatus[]>(
    []
  );
  const [noteStatuses, setNoteStatuses] = useState<NoteStatus[]>([]);
  const [videoStatuses, setVideoStatuses] = useState<VideoStatus[]>([]);

  // Fetch data from APIs
  const getQuestionStatuses = async () => {
    const { data } = await axios.get("/api/users/question-status");
    setQuestionStatuses(data.questionStatuses);
  };

  const getNoteStatuses = async () => {
    const { data } = await axios.get("/api/users/note-status");
    setNoteStatuses(data.noteStatus);
  };

  const getVideoStatuses = async () => {
    const { data } = await axios.get("/api/users/video-status");
    setVideoStatuses(data.videoStatuses);
  };

  useEffect(() => {
    getQuestionStatuses();
    getNoteStatuses();
    getVideoStatuses();
  }, []);

  // Helper to find additional data for each favourite item
  const findAdditionalQuestionData = (id: string, statuses: any[]) => {
    return statuses.find((status) => status.questionId === id) || {};
  };
  const findAdditionalNoteData = (id: string, statuses: any[]) => {
    return statuses.find((status) => status.noteId === id) || {};
  };
  const findAdditionalVideoData = (id: string, statuses: any[]) => {
    return statuses.find((status) => status.videoId === id) || {};
  };

  const calculateProgress = (note: NoteStatus | VideoStatus) => {
    const totalItems = note?.content?.length;
    const completedItems = note?.content?.filter(
      (item) => item.completed
    ).length;

    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  console.log(favourites);

  return (
    <div className="flex my-10 px-6">
      <div className="flex flex-col w-full">
        <div className="flex mt-5 justify-center pb-5">
          <h2 className="text-3xl font-medium">Favourites</h2>
        </div>
        <div className="flex flex-col gap-y-6 px-7 pb-5">
          {/* Questions Section */}
          <div className="flex flex-col gap-y-4">
            <h2>Quizes</h2>
            <div className="flex gap-x-7 gap-y-6 w-full flex-wrap">
              {(favourites?.favouriteQuizes?.length ?? 0) > 0 ? (
                favourites.favouriteQuizes.slice(0, 2).map((quiz) => {
                  const additionalData = findAdditionalQuestionData(
                    quiz?._id,
                    questionStatuses
                  );
                  return (
                    <Box
                      type="question"
                      key={quiz._id}
                      url={quiz.url}
                      title={quiz.quizName}
                      startedAt={additionalData.createdAt}
                      completionPercentage={additionalData.correct ? 100 : 0}
                      className="w-2/5"
                    />
                  );
                })
              ) : (
                <p>No Questions</p>
              )}
              {(favourites?.favouriteQuizes?.length ?? 0) > 0 && (
                <Link
                  className="flex items-end"
                  href={"/user/favourites/questions"}
                >
                  View All
                </Link>
              )}
            </div>
          </div>

          {/* Videos Section */}
          <div className="flex flex-col gap-y-4">
            <h2>Videos</h2>
            <div className="flex gap-x-7 gap-y-6 w-full flex-wrap">
              {(favourites?.favouriteVideos?.length ?? 0) > 0 ? (
                favourites.favouriteVideos.slice(0, 2).map((video) => {
                  const additionalData = findAdditionalVideoData(
                    video.video._id,
                    videoStatuses
                  );
                  return (
                    <Box
                      type="video"
                      key={video._id}
                      url={video.url}
                      title={video.video.name}
                      startedAt={additionalData.createdAt}
                      completionPercentage={calculateProgress(additionalData)}
                      className="w-2/5"
                    />
                  );
                })
              ) : (
                <p>No Videos</p>
              )}
              {(favourites?.favouriteVideos?.length ?? 0) > 0 && (
                <Link
                  className="flex items-end "
                  href={"/user/favourites/videos"}
                >
                  View All
                </Link>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div className="flex flex-col gap-y-4">
            <h2>Notes</h2>
            <div className="flex gap-x-7 gap-y-6 w-full flex-wrap">
              {(favourites?.favouriteNotes?.length ?? 0) > 0 ? (
                favourites.favouriteNotes.slice(0, 2).map((note) => {
                  const additionalData = findAdditionalNoteData(
                    note.note._id,
                    noteStatuses
                  );
                  return (
                    <Box
                      type="note"
                      key={note.note?._id}
                      title={note.note?.name}
                      url={note.url}
                      startedAt={additionalData.createdAt}
                      completionPercentage={calculateProgress(additionalData)}
                      className="w-2/5"
                    />
                  );
                })
              ) : (
                <p>No Notes</p>
              )}
              {(favourites?.favouriteNotes?.length ?? 0) > 0 && (
                <Link
                  className="flex items-end "
                  href={"/user/favourites/notes"}
                >
                  View All
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <RightSidebar />
    </div>
  );
}

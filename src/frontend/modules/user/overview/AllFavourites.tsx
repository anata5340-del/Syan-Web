import { userStore } from "@/store/user/user";
import Box from "@/frontend/components/box/Box";
import Link from "next/link";
import RightSidebar from "@/frontend/components/rightSidebar/RightSidebar";
import { VideoStatus } from "@/backend/types/videoStatus";
import { NoteStatus } from "@/backend/types/noteStatus";
import { useEffect, useState } from "react";
import axios from "axios";

type Props = {
  type: "Questions" | "Videos" | "Notes";
};

const AllFavourites = ({ type }: Props) => {
  const { favourites, getFavourites, user } = userStore();
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

  return (
    <div className="flex my-10">
      <div className="flex flex-col w-full">
        <div className="flex mt-5 justify-center pb-5">
          <h2 className="text-3xl font-medium">Favourites</h2>
        </div>
        <div className="flex flex-col gap-y-6 px-7 pb-4">
          {type === "Questions" && (
            <div className="flex flex-col gap-y-4">
              <h2>Quizes</h2>
              <div className="grid grid-cols-2 w-full gap-10">
                {(favourites?.favouriteQuizes?.length ?? 0) > 0 ? (
                  favourites.favouriteQuizes.map((quiz) => {
                    const additionalData = findAdditionalQuestionData(
                      quiz._id,
                      questionStatuses
                    );
                    return (
                      <Box
                        type="question"
                        url={quiz.url}
                        key={quiz._id}
                        title={quiz.quizName}
                        startedAt={additionalData.createdAt || ""}
                        completionPercentage={additionalData.correct ? 100 : 0}
                        className="w-full"
                      />
                    );
                  })
                ) : (
                  <p>No Questions</p>
                )}
              </div>
            </div>
          )}
          {type === "Videos" && (
            <div className="flex flex-col gap-y-4">
              <h2>Videos</h2>
              <div className="grid grid-cols-2 w-full gap-10">
                {(favourites?.favouriteVideos?.length ?? 0) > 0 ? (
                  favourites.favouriteVideos.map((video) => {
                    const additionalData = findAdditionalVideoData(
                      video.video._id,
                      videoStatuses
                    );
                    return (
                      <Box
                        type="video"
                        key={video._id}
                        title={video.video.name}
                        url={video.url}
                        startedAt={additionalData.createdAt || ""}
                        completionPercentage={calculateProgress(additionalData)}
                        className="w-full"
                      />
                    );
                  })
                ) : (
                  <p>No Videos</p>
                )}
              </div>
            </div>
          )}
          {type === "Notes" && (
            <div className="flex flex-col gap-y-4">
              <h2>Notes</h2>
              <div className="grid grid-cols-2 w-full gap-10">
                {(favourites?.favouriteNotes?.length ?? 0) > 0 ? (
                  favourites.favouriteNotes.map((note) => {
                    const additionalData = findAdditionalNoteData(
                      note.note._id,
                      noteStatuses
                    );
                    return (
                      <Box
                        type="note"
                        key={note._id}
                        title={note.note.name}
                        url={note.url}
                        startedAt={additionalData.createdAt || ""}
                        completionPercentage={calculateProgress(additionalData)}
                        className="w-full"
                      />
                    );
                  })
                ) : (
                  <p>No Notes</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <RightSidebar />
    </div>
  );
};

export default AllFavourites;

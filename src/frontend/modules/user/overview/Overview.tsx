import { Package, UserPackage } from "@/backend/types";
import { NoteStatus } from "@/backend/types/noteStatus";
import { QuizStatus } from "@/backend/types/quizStatus"; // Replaced QuestionStatus
import { VideoStatus } from "@/backend/types/videoStatus";
import Box from "@/frontend/components/box/Box";
import RightSidebar from "@/frontend/components/rightSidebar/RightSidebar";
import { userStore } from "@/store/user/user";
import axios from "axios";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Course = {
  type: string;
  _id: string;
};

type PackageInfo = {
  _id: string;
  name: string;
  price: number;
  active: boolean;
  courses: Course[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type PackageData = {
  startDate: string;
  endDate: string;
  active: boolean;
  price: number;
  _id: string;
  packageInfo: PackageInfo;
};

export default function Overview() {
  const [quizStatuses, setQuizStatuses] = useState<QuizStatus[]>([]); // Replaced questionStatuses
  const [noteStatuses, setNoteStatuses] = useState<NoteStatus[]>([]);
  const [videoStatuses, setVideoStatuses] = useState<VideoStatus[]>([]);

  const [link, setLink] = useState<string>("");

  const { user } = userStore();
  const [packages, setPackages] = useState<PackageData[]>([]);
  console.log(user);
  const getPackages = async () => {
    try {
      if (!user) return;
      const res = await axios.get(`/api/users/${user._id}/packages`);
      const data = res.data.pkgs;
      setPackages(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get("/api/settings");
      const { data } = response;
      if (data) {
        setLink(data.promotionLink);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error.message);
    }
  };

  const getQuizStatuses = async () => {
    const { data } = await axios.get("/api/users/quiz-status"); // Updated endpoint
    setQuizStatuses(data.quizStatuses);
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
    getPackages();
    getQuizStatuses(); // Updated to fetch quiz statuses
    getNoteStatuses();
    getVideoStatuses();
    fetchSettings();
  }, [user]);

  const latestNotes = useMemo(() => {
    if (!noteStatuses) return;
    return [...noteStatuses]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 2);
  }, [noteStatuses]);

  const latestVideos = useMemo(() => {
    return [...videoStatuses]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 2);
  }, [videoStatuses]);

  const latestQuizzes = useMemo(() => {
    if (!quizStatuses) return;
    return [...quizStatuses]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 2);
  }, [quizStatuses]);

  const calculateQuizProgress = (item: QuizStatus) => {
    return item.progress ?? 0; // Updated to use progress directly for quizzes
  };

  const calculateProgress = (note: NoteStatus | VideoStatus) => {
    const totalItems = note.content.length;
    const completedItems = note.content.filter((item) => item.completed).length;

    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  return (
    <>
      <div className="flex gap-10 my-10">
        <div className="flex flex-col w-5/6">
          <div className="flex items-center justify-between w-full px-6 py-3 bg-[#CEEAFF] rounded-2xl">
            <div>
              <h2 className="text-[#076BB4] text-3xl font-semibold">
                Go Premium
              </h2>
              <p className="text-xl">
                Explore 100+ expert curated courses prepared for you.
              </p>
              <Link
                href={link ?? "#"}
                rel="noopener noreferrer"
                target="_blank"
                className="block mt-2 bg-white rounded-2xl text-[#076BB4] font-semibold drop-shadow-md w-32 text-center py-2"
              >
                Get Access
              </Link>
            </div>
            <div>
              <img src="/assets/img/icon30.png" />
            </div>
          </div>
          <p className="mt-4">Active Subscription</p>
          <div className="flex mt-4 gap-x-4">
            <div className="bg-[#F0F0F0] w-4/6 px-5 py-5 flex flex-col gap-y-2 rounded-3xl">
              <Link href="/user/settings/subscription">
                <div className="flex justify-between">
                  <p>{packages[0]?.packageInfo.name}</p>
                  <p
                    className={`${
                      packages[0]?.active ? "text-[#01B067]" : "text-[#a13628]"
                    }`}
                  >
                    {packages[0]?.active ? "Active" : "Inactive"}
                  </p>
                </div>
                <p>Expires at: {packages[0]?.endDate}</p>
              </Link>
            </div>
            <Link
              href="/user/settings/subscription"
              className="flex justify-center items-center bg-[#277C72] rounded-3xl w-2/6  "
            >
              <p className="text-center text-white font-medium text-xl">
                Other Courses
              </p>
            </Link>
          </div>

          <div className="pt-3">
            <p className="font-medium text-[#01B067]">History</p>
            <p className="font-medium py-3">Quizzes</p>
            <div className="flex w-full gap-10">
              {latestQuizzes?.length > 0 ? (
                latestQuizzes?.map((quiz) => (
                  <Box
                    key={quiz.quizId}
                    title={quiz.quizName}
                    url={quiz.url}
                    startedAt={quiz.createdAt}
                    type="question"
                    className="w-2/5"
                    completionPercentage={calculateQuizProgress(quiz)}
                  />
                ))
              ) : (
                <div>No history!</div>
              )}
              {latestQuizzes?.length > 0 && (
                <Link href={"/user/quiz-history"} className="flex items-end ">
                  <p className="text-right">View all</p>
                </Link>
              )}
            </div>
          </div>

          <div className="pt-3">
            <div className="flex justify-between py-3">
              <p className="font-medium">Videos</p>
            </div>
            <div className="flex w-full gap-10">
              {latestVideos.length > 0 ? (
                latestVideos.map((video) => (
                  <Box
                    key={video.videoId}
                    title={video.videoName}
                    url={video.url}
                    startedAt={video.createdAt}
                    type="video"
                    className="w-2/5"
                    completionPercentage={calculateProgress(video)}
                  />
                ))
              ) : (
                <div>No history!</div>
              )}
              {latestVideos.length > 0 && (
                <Link href={"/user/video-history"} className="flex items-end ">
                  <p className="text-right">View all</p>
                </Link>
              )}
            </div>
          </div>

          <div className="pt-3">
            <div className="flex justify-between py-3">
              <p className="font-medium">Notes</p>
            </div>
            <div className="flex w-full gap-10">
              {latestNotes.length > 0 ? (
                latestNotes.map((note) => (
                  <Box
                    key={note.noteId}
                    url={note.url}
                    title={note.noteName}
                    startedAt={note.createdAt}
                    type="note"
                    className="w-2/5"
                    completionPercentage={calculateProgress(note)}
                  />
                ))
              ) : (
                <div>No history!</div>
              )}
              {latestNotes.length > 0 && (
                <Link href={"/user/note-history"} className="flex items-end ">
                  <p className="text-right">View all</p>
                </Link>
              )}
            </div>
          </div>
        </div>
        <RightSidebar />
      </div>
    </>
  );
}

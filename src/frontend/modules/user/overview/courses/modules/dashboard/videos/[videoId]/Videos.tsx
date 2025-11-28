"use client";
import { Video } from "@/backend/types";
import axios from "axios";
import ReactPlayer from "react-player";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { userStore } from "@/store/user/user";
import QuizStartModal from "@/frontend/components/quizStartModal/QuizStartModal";
import FeedbackModal from "@/frontend/components/feedbackModal/FeedbackModal";

interface Props {
  videoId: string;
  courseId: string | undefined;
  moduleId: string | undefined;
  sectionId: string | undefined;
  subSectionId: string | undefined;
  subSectionBlockId: string | undefined;
  subSectionBlockName: string | undefined;
  noteId: string | undefined;
}
interface Module {
  title: string;
}

interface OverviewItem {
  title: string;
  id: number;
  author: string;
  time: number;
  isChecked?: boolean;
}

export default function Videos({
  videoId,
  noteId,
  courseId,
  moduleId,
  sectionId,
  subSectionId,
  subSectionBlockId,
  subSectionBlockName,
}: Props) {
  const router = useRouter();
  // const [module, setModule] = useState<Module | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const { user, favourites, getFavourites, setFavourites } = userStore();
  const [selectedContent, setSelectedContent] = useState(undefined);
  const [addedToFavourites, setAddedToFavourites] = useState<boolean>(() => {
    if (favourites && video) {
      return favourites.favouriteVideos.some(
        (v) => v._id === video._id // Compare with originalId
      );
    }
    return false;
  });
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] =
    useState<boolean>(false);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayPosition, setOverlayPosition] = useState({
    top: "50%",
    left: "50%",
  });
  const [isPlaying, setIsPlaying] = useState(false); // Track playing state

  useEffect(() => {
    let interval;

    if (isPlaying) {
      interval = setInterval(() => {
        // Show the overlay randomly
        setShowOverlay(true);

        // Randomize overlay position
        const randomTop = Math.random() * 80 + 10; // Between 10% and 90%
        const randomLeft = Math.random() * 80 + 10; // Between 10% and 90%
        setOverlayPosition({ top: `${randomTop}%`, left: `${randomLeft}%` });

        // Hide the overlay after 2 seconds
        setTimeout(() => setShowOverlay(false), 2000);
      }, 8000); // Show overlay every 8 seconds
    }

    return () => clearInterval(interval); // Cleanup on component unmount or pause
  }, [isPlaying]);

  const getVideo = async () => {
    try {
      const { data } = await axios.get(
        `/api/videoCourses/${courseId}/modules/${moduleId}/section/${sectionId}/subSection/${subSectionId}/subSectionBlock/${subSectionBlockId}/video`
      );
      setVideo(data.video);
    } catch (error) {
      console.error("getVideo error ", error);
    }
  };
  useEffect(() => {
    getsubSection(
      courseId,
      moduleId,
      sectionId,
      subSectionId,
      subSectionBlockId
    );
    getVideo();
  }, [courseId, moduleId, sectionId, subSectionId, subSectionBlockId]);

  useEffect(() => {
    fetchVideoStatus();
    if (favourites && video?._id) {
      setAddedToFavourites(
        favourites.favouriteVideos.some((v) => v.video?._id === video._id)
      );
    } else {
      setAddedToFavourites(false);
    }
  }, [video]);

  const url = router.asPath;

  const fetchVideoStatus = async () => {
    try {
      const { data } = await axios.get(
        `/api/users/video-status?videoId=${videoId}`
      );

      const videoStatus = data.videoStatuses.find(
        (status: { videoId: string }) => status.videoId === video?._id
      );
      // Create a map of `contentId` to its `completed` status from the API response
      if (videoStatus) {
        // Create a map of `contentId` to its `completed` status from the matched videoStatus
        const videoStatusMap = new Map(
          videoStatus.content.map(
            (content: { contentId: string; completed: boolean }) => [
              content.contentId,
              content.completed,
            ]
          )
        );

        // Populate `checkedItems` with indexes of completed content
        const completedContentIndexes =
          video?.content
            ?.map((content, index) => {
              const isCompleted = videoStatusMap.get(content._id); // Match contentId from API with _id in video.content
              return isCompleted ? index : null;
            })
            .filter((index) => index !== null) || [];

        setCheckedItems(completedContentIndexes as number[]);
      } else {
        console.warn("No matching videoStatus found for videoId:", video?._id);
      }
    } catch (error) {
      console.error("fetchVideoStatus Error:", error);
    }
  };

  const updateVideoStatus = async (index: number, completed: boolean) => {
    try {
      // Send API request to update video content status
      const contentId = video?.content[index]?._id; // Replace with the correct field for content ID
      const videoId = video?._id;
      const videoName = video?.name;

      setCheckedItems((prev) => [...prev, index]);

      if (!contentId || !videoId) {
        throw new Error("Content ID or Video ID is missing");
      }

      await axios.post("/api/users/video-status", {
        videoId,
        videoName,
        contentId,
        url,
        completed: true, // New status
      });
    } catch (error) {
      console.error("Error updating video content status", error);
    }
  };

  const handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    video?.content.forEach((item, index) => {
      const brokenTime = item.endTime.split(":").map(Number); // Convert time to [hours, minutes, seconds]
      const [hours = 0, minutes = 0, seconds = 0] = brokenTime;
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      if (
        !checkedItems.includes(index) && // If not already checked
        playedSeconds >= totalSeconds // Check if endTime is reached
      ) {
        updateVideoStatus(index, true); // Update the backend
      }
    });
  };

  const handleCheckboxChange = async (index: number) => {
    const isChecked = checkedItems.includes(index);
    const updatedCheckedItems = isChecked
      ? checkedItems.filter((item) => item !== index)
      : [...checkedItems, index];

    // Optimistically update the UI
    setCheckedItems(updatedCheckedItems);

    try {
      // Send API request to update video content status
      const contentId = video?.content[index]?._id; // Replace with the correct field for content ID
      const videoId = video?._id;
      const videoName = video?.name;

      if (!contentId || !videoId) {
        throw new Error("Content ID or Video ID is missing");
      }

      await axios.post("/api/users/video-status", {
        videoId,
        videoName,
        contentId,
        url,
        completed: !isChecked, // New status
      });
    } catch (error) {
      console.error("Error updating video content status", error);

      // Revert the state update in case of an error
      setCheckedItems((prev) =>
        isChecked ? [...prev, index] : prev.filter((item) => item !== index)
      );
    }
  };

  const addToFavourites = async () => {
    try {
      const { data } = await axios.post(`/api/favourites/`, {
        favouriteVideos: [
          {
            _id: video._id, // Note ID
            url: url, // Construct the URL dynamically
          },
        ],
      });
      setAddedToFavourites(true);
      setFavourites(data.favourites);
    } catch (error) {
      console.error("addToFavourites error ", error);
    }
  };
  const deleteFromFavourites = async () => {
    try {
      const payload = {
        favouriteVideos: [
          {
            _id: video._id, // Note ID to remove
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
      setAddedToFavourites(false); // Update UI state
      setFavourites(data.favourites); // Update favourites state
    } catch (error) {
      console.error("Error removing from favourites:", error);
    }
  };

  const changeTime = (time: string) => {
    const brokenTime = time.split(":").map(Number); // Convert time to [hours, minutes, seconds]
    const [hours = 0, minutes = 0, seconds = 0] = brokenTime;
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (videoRef.current) {
      videoRef.current.seekTo(totalSeconds);
    }
  };

  // Helper Function: Convert Time to Minutes
  const convertTimeToMinutes = (time) => {
    if (!time) return 0; // Handle null/undefined input
    const brokenTime = time.split(":").map(Number); // Convert time to [hours, minutes, seconds]
    const [hours = 0, minutes = 0, seconds = 0] = brokenTime;
    const totalSeconds = hours * 3600 + minutes * 60 + seconds; // Total seconds
    return Math.ceil(totalSeconds / 60); // Convert to minutes and round up
  };

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
        <div className="flex flex-col w-[28%] gap-5">
          <div className="flex flex-col gap-5">
            <h2>Further Study:</h2>
            <div className="flex justify-between gap-1">
              <div
                onClick={() =>
                  router.push(
                    `/user/videoCourses/${courseId}/modules/dashboard/notes/${noteId}?m=${moduleId}&s=${sectionId}&ss=${subSectionId}&ssb=${subSectionBlockId}&ssbt=${subSectionBlockName}&vid=${videoId}`
                  )
                }
                className="w-1/2 text-sm border border-[#3E3E3E] rounded-lg p-5 py-2 flex gap-2 items-center cursor-pointer"
              >
                <img src="/assets/img/icon49.png" alt="Read Notes" />
                Read Notes
              </div>
              <div
                onClick={() => setIsModalOpen(true)}
                className="w-1/2 text-sm border border-[#3E3E3E] rounded-lg p-5 py-2 flex gap-2 items-center cursor-pointer"
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
                  <h2 className="text-xl font-bold text-[#000]">
                    {video?.author}
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
            <div className="space-y-2 mt-2">
              <h3 className="text-xl font-normal">Contents:</h3>
              {video?.content &&
                video?.content.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between py-2 px-4 rounded-3xl cursor-pointer ${
                      checkedItems.includes(index)
                        ? "bg-[#EF6A77]"
                        : "bg-[#FDC9CE]"
                    }`}
                    onClick={() => {
                      // if (selectedContent >= index) {
                      // Uncheck this block and
                      changeTime(item.startTime);
                      // }
                    }}
                  >
                    <span
                      className={`${
                        checkedItems.includes(index)
                          ? "text-white"
                          : "text-[#3E3E3E]"
                      }`}
                    >
                      {item.name}
                    </span>
                    <div
                      className="relative w-5 h-5 cursor-pointer"
                      onClick={() => {
                        handleCheckboxChange(index);
                      }}
                    >
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
        </div>

        <div className="flex flex-col gap-5 w-[60%]">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-baseline">
              <h2 className="text-black font-medium text-4xl">
                {video?.title}
              </h2>
              <div>ID: {video?.displayId}</div>
            </div>

            <p className="text-black font-normal text-sm -mt-2 ml-1">
              {`${
                video
                  ? convertTimeToMinutes(
                      video.content[video.content?.length - 1].endTime
                    )
                  : ""
              } mins`}
            </p>
          </div>
          <div className="flex justify-between">
            <div className="font-semibold bg-[#FDC9CE] rounded-lg px-3">
              By: {video?.author}
            </div>
            <a
              href={video?.pdfSource || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer flex items-center gap-1 bg-[#FDC9CE] rounded-lg px-3 "
            >
              <svg
                fill="none"
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 6.5V6H2V6.5H2.5ZM6.5 6.5V6H6V6.5H6.5ZM6.5 10.5H6V11H6.5V10.5ZM13.5 3.5H14V3.29289L13.8536 3.14645L13.5 3.5ZM10.5 0.5L10.8536 0.146447L10.7071 0H10.5V0.5ZM2.5 7H3.5V6H2.5V7ZM3 11V8.5H2V11H3ZM3 8.5V6.5H2V8.5H3ZM3.5 8H2.5V9H3.5V8ZM4 7.5C4 7.77614 3.77614 8 3.5 8V9C4.32843 9 5 8.32843 5 7.5H4ZM3.5 7C3.77614 7 4 7.22386 4 7.5H5C5 6.67157 4.32843 6 3.5 6V7ZM6 6.5V10.5H7V6.5H6ZM6.5 11H7.5V10H6.5V11ZM9 9.5V7.5H8V9.5H9ZM7.5 6H6.5V7H7.5V6ZM9 7.5C9 6.67157 8.32843 6 7.5 6V7C7.77614 7 8 7.22386 8 7.5H9ZM7.5 11C8.32843 11 9 10.3284 9 9.5H8C8 9.77614 7.77614 10 7.5 10V11ZM10 6V11H11V6H10ZM10.5 7H13V6H10.5V7ZM10.5 9H12V8H10.5V9ZM2 5V1.5H1V5H2ZM13 3.5V5H14V3.5H13ZM2.5 1H10.5V0H2.5V1ZM10.1464 0.853553L13.1464 3.85355L13.8536 3.14645L10.8536 0.146447L10.1464 0.853553ZM2 1.5C2 1.22386 2.22386 1 2.5 1V0C1.67157 0 1 0.671573 1 1.5H2ZM1 12V13.5H2V12H1ZM2.5 15H12.5V14H2.5V15ZM14 13.5V12H13V13.5H14ZM12.5 15C13.3284 15 14 14.3284 14 13.5H13C13 13.7761 12.7761 14 12.5 14V15ZM1 13.5C1 14.3284 1.67157 15 2.5 15V14C2.22386 14 2 13.7761 2 13.5H1Z"
                  fill="#000000"
                />
              </svg>
              View PDF
            </a>
          </div>
          {/* <video
            autoPlay
            controls
            src={!video?.videoSource ? "" : video.videoSource}
            width={"100%"}
            height={500}
          /> */}
          <div
            onContextMenu={(e) => e.preventDefault()} // Disable right-click on the container
            className={`relative w-full h-500 overflow-clip `}
          >
            <ReactPlayer
              ref={videoRef}
              url={!video?.videoSource ? "" : video.videoSource}
              controls // Show play, pause, volume, etc.
              playing // Video will not autoplay
              onProgress={handleProgress}
              loop={false}
              light={<img src={video?.thumbnail} alt="Thumbnail" />}
              width={"100%"}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              config={{
                file: {
                  attributes: {
                    controlsList: "nodownload", // Disable download option
                    disablePictureInPicture: true, // Disable picture-in-picture
                  },
                },
              }}
            />
            {/* Contact Overlay */}
            {showOverlay && (
              <div
                style={{
                  position: "absolute",
                  top: overlayPosition.top,
                  left: overlayPosition.left,
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  zIndex: 10,
                  pointerEvents: "none", // Allow clicks through the overlay
                }}
              >
                <p>Email: {user?.email}</p>
                <p>Contact: {user?.phone}</p>
              </div>
            )}
          </div>

          <p>Description: </p>
          <div className="px-8 py-4 bg-[#EBEBEB] rounded-lg">
            {video?.description}
          </div>
          <div className="flex gap-x-3 pb-20">
            <span>Have comments about this video?</span>
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
        type="video"
        userId={user?.displayId}
        id={video?.displayId}
      />
    </div>
  );
}

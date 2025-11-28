import axios from "axios";
import { set } from "lodash";
import { useEffect, useState } from "react";

type useAddVideosProps = {
  selectedVideo: null | { _id: string };
  refetch: () => void;
  parentIds: {
    videoCourseId: string;
    moduleId: string;
    sectionId: string;
    subSectionId: string;
    subSectionBlockId: string;
  };
};

export const useAddVideos = ({
  selectedVideo,
  refetch,
  parentIds,
}: useAddVideosProps) => {
  const {
    videoCourseId,
    moduleId,
    sectionId,
    subSectionId,
    subSectionBlockId,
  } = parentIds;
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(
    selectedVideo ? selectedVideo?._id : null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleOk = async () => {
    const data = { videoId: selectedVideoId };
    try {
      await axios.put(
        `/api/videoCourses/${videoCourseId}/modules/${moduleId}/section/${sectionId}/subSection/${subSectionId}/subSectionBlock/${subSectionBlockId}/video`,
        data
      );
      refetch();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedVideoId(null);
    setVideos((prev) => prev.map((video) => ({ ...video, isChecked: false })));
  };

  const getVideos = async () => {
    try {
      const {
        data: { videos: notesList },
      } = await axios.get("/api/videos");
      const filteredVideos = notesList.map((video: { _id: string }) => {
        const videoId = selectedVideo ? selectedVideo?._id : null;
        const isVideoSelected = video._id === videoId;
        return {
          ...video,
          isChecked: isVideoSelected,
        };
      });
      setVideos(filteredVideos);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isModalOpen) getVideos();
  }, [isModalOpen]);

  useEffect(
    () => setSelectedVideoId(selectedVideo ? selectedVideo?._id : null),
    [selectedVideo]
  );

  const handleVideoSelect = (videoId: string) => {
    const updatedVideos = videos?.map((video: { _id: string }) => {
      const isVideoSelected = video._id === videoId;
      return {
        ...video,
        isChecked: isVideoSelected,
      };
    });
    setVideos(updatedVideos);
    setSelectedVideoId(videoId);
  };

  return {
    videos,
    handleVideoSelect,
    isModalOpen,
    toggleModal,
    handleCancel,
    handleOk,
  };
};

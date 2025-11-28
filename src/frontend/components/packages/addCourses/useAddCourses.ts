import axios from "axios";
import { useEffect, useState } from "react";

const getUpdatedData = (data: any, courseIds: any[]) =>
  data.map((item) => ({
    ...item,
    isChecked: courseIds.includes(item._id),
  }));

export const useAddCourses = (courses: []) => {
  const [videos, setVideos] = useState([]);
  const [quizes, setQuizes] = useState([]);

  const getVideos = () => {
    axios.get("/api/videoCourses").then(({ data }) => {
      const { videoCourses: videoList } = data;
      setVideos(videoList);
    });
  };

  // quiz course
  const getQuizes = () => {
    axios.get("/api/quizes").then(({ data }) => {
      const { quizes: quizList } = data;
      setQuizes(quizList);
    });
  };

  useEffect(() => {
    getVideos();
    getQuizes();
  }, []);

  const courseIds = courses.map((course) => course._id);

  const videosWithCheck = getUpdatedData(videos, courseIds);
  const quizesWithCheck = getUpdatedData(quizes, courseIds);

  return {
    videos: videosWithCheck,
    quizes: quizesWithCheck,
  };
};

import { useState } from "react";

export const useAddVideoCourse = () => {
  const [isVideoCourseMOdalOpen, setIsVideoCourseModalOpen] = useState(false);
  const toggleVideoCourseModal = () =>
    setIsVideoCourseModalOpen(!isVideoCourseMOdalOpen);
  return { isVideoCourseMOdalOpen, toggleVideoCourseModal };
};

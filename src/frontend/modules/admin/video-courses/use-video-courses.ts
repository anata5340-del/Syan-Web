import axios from "axios";
import { set } from "lodash";
import { useEffect, useState } from "react";

export const useVideoCourses = () => {
  const [videoCourses, setVideoCourses] = useState([]);
  const [editVideoCourse, setEditVideoCourse] = useState(null);
  const [isVideoCourseModalOpen, setIsVideoCourseModalOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const toggleVideoCourseModal = () => {
    if (isVideoCourseModalOpen) {
      setEditVideoCourse(null);
    }
    setIsVideoCourseModalOpen(!isVideoCourseModalOpen);
  };

  const getVideoCourses = () => {
    axios.get("/api/videoCourses").then(({ data }) => {
      setVideoCourses(data.videoCourses);
    });
  };

  const handleDelete = (id: string) => {
    axios.delete(`/api/videoCourses/${id}`).then(getVideoCourses);
  };

  const handleEdit = (id: string) => {
    setMode("edit");
    const data = videoCourses.find((videoCourse) => videoCourse._id === id);
    setEditVideoCourse(data);
    toggleVideoCourseModal();
  };

  const handleView = (id: string) => {
    setMode("view");
    const data = videoCourses.find((videoCourse) => videoCourse._id === id);
    setEditVideoCourse(data);
    toggleVideoCourseModal();
  };

  useEffect(() => {
    getVideoCourses();
  }, []);

  return {
    mode,
    videoCourses,
    editData: editVideoCourse,
    setMode,
    handleDelete,
    handleEdit,
    handleView,
    refetch: getVideoCourses,
    toggleVideoCourseModal,
    isVideoCourseModalOpen,
  };
};

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export const useAddModule = ({ refetchModule, videoCourseId }) => {
  const [editModuleData, setEditModuleData] = useState(null);
  const [moduleMode, setModuleMode] = useState("add");
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);
  const toggleAddModuleModal = () => {
    if (isAddModuleModalOpen) {
      setModuleMode("add");
      setEditModuleData(null);
    }
    setIsAddModuleModalOpen(!isAddModuleModalOpen);
  };
  const handleEdit = (data: unknown) => {
    setModuleMode("edit");
    setEditModuleData(data);
    toggleAddModuleModal();
  };

  const handleModuleDelete = async (moduleId: string) => {
    try {
      await axios.delete(
        `/api/videoCourses/${videoCourseId}/modules/${moduleId}`
      );
      refetchModule();
      toast.success("Video Course Module Deleted Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Video Course Module Deletion Failed");
    }
  };

  return {
    isAddModuleModalOpen,
    toggleAddModuleModal,
    moduleMode,
    setModuleMode,
    editModuleData,
    handleModuleEdit: handleEdit,
    handleModuleDelete,
  };
};

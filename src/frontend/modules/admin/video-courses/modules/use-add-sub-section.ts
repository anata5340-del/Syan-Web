import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";

type UseAddSubSectionProps = {
  videoCourseId: string;
  moduleId: string;
  sectionId: string;
  refetchModule: () => void;
};

export const useAddSubSection = ({
  refetchModule,
  videoCourseId,
  moduleId,
  sectionId,
  setSelectedSection,
}: UseAddSubSectionProps) => {
  const [isAddSubSectionModalOpen, setIsAddSubSectionModalOpen] =
    useState(false);
  const [subSectionMode, setSubSectionMode] = useState("add");
  const [subSectionData, setSubSectionData] = useState<any>(null);

  const toggleAddSubSectionModal = (section?: string) => {
    {
      if (isAddSubSectionModalOpen) {
        setSubSectionMode("add");
        setSubSectionData(null);
        // setSelectedSection(null);
      }

      if (section) {
        setSelectedSection(section);
      }
      setIsAddSubSectionModalOpen(!isAddSubSectionModalOpen);
    }
  };

  const handleSubSectionEdit = (data: any) => {
    setSubSectionData(data);
    setSubSectionMode("edit");
    toggleAddSubSectionModal();
  };

  const handleSubSectionDelete = async (subSectionId: string) => {
    try {
      await axios.delete(
        `/api/videoCourses/${videoCourseId}/modules/${moduleId}/section/${sectionId}/subSection/${subSectionId}`
      );
      toast.success("Video Course Sub Section deleted successfully");
      refetchModule();
      setSelectedSection(null);
    } catch (error) {
      console.error(error);
      toast.error("Video Course Sub Section deletion failed");
    }
  };

  return {
    isAddSubSectionModalOpen,
    toggleAddSubSectionModal,
    handleSubSectionEdit,
    handleSubSectionDelete,
    subSectionMode,
    subSectionData,
  };
};

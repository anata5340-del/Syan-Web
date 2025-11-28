import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";

type UseAddSectionProps = {
  refetchModule: () => void;
  videoCourseId: string;
};

export const useAddSection = ({
  refetchModule,
  videoCourseId,
  moduleId,
}: UseAddSectionProps) => {
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [sectionMode, setSectionMode] = useState("add");
  const [sectionData, setSectionData] = useState<any>(null);
  const [selectedSection, setSelectedSection] = useState(null);

  const toggleAddSectionModal = () => {
    {
      if (isAddSectionModalOpen) {
        setSectionMode("add");
        setSectionData(null);
      }
      setIsAddSectionModalOpen(!isAddSectionModalOpen);
    }
  };

  const handleSectionEdit = (data: any) => {
    setSectionData(data);
    setSectionMode("edit");
    toggleAddSectionModal();
  };

  const handleSectionDelete = async (sectionId: string) => {
    try {
      await axios.delete(
        `/api/videoCourses/${videoCourseId}/modules/${moduleId}/section/${sectionId}`
      );
      toast.success("Video Course Section deleted successfully");
      refetchModule();
    } catch (error) {
      console.error(error);
      toast.error("Video Course Section deletion failed");
    }
  };

  const handleSectionClick = (section: string) => {
    setSelectedSection(section);
  };

  return {
    isAddSectionModalOpen,
    toggleAddSectionModal,
    handleSectionEdit,
    handleSectionDelete,
    sectionMode,
    sectionData,
    handleSectionClick,
    selectedSection,
    setSelectedSection,
  };
};

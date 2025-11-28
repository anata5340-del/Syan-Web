import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";

type UseAddSubSectionProps = {
  videoCourseId: string | string[] | undefined;
  moduleId: string | string[] | undefined;
  sectionId: string | string[] | undefined;
  subSectionId: string | string[] | undefined;
  refetchSubSection: () => void;
};

export const useAddSubSectionBlock = ({
  refetchSubSection,
  videoCourseId,
  moduleId,
  sectionId,
  subSectionId,
}: UseAddSubSectionProps) => {
  const [subSectionData, setSubSectionData] = useState(null);

  const [isAddSubSectionBlockModalOpen, setIsAddSubSectionBlockModalOpen] =
    useState(false);
  const [subSectionBlockMode, setSubSectionBlockMode] = useState("add");
  const [subSectionBlockData, setSubSectionBlockData] = useState<any>(null);

  const toggleAddSubSectionBlockModal = (section?: string) => {
    setIsAddSubSectionBlockModalOpen(!isAddSubSectionBlockModalOpen);
  };

  const handleBlockEdit = (data: any) => {
    setSubSectionBlockData(data);
    setSubSectionBlockMode("edit");
    toggleAddSubSectionBlockModal();
  };

  const handleBlockDelete = async (subSectionBlockId: string) => {
    try {
      await axios.delete(
        `/api/videoCourses/${videoCourseId}/modules/${moduleId}/section/${sectionId}/subSection/${subSectionId}/subSectionBlock/${subSectionBlockId}`
      );
      toast.success("Block deleted successfully");
      refetchSubSection();
    } catch (error) {
      console.error(error);
      toast.error("Block deletion failed");
    }
  };

  //   const getSubSection = () => {
  //     axios
  //       .get(
  //         `/api/videoCourses/${videoCourseId}/modules/${moduleId}/section/${sectionId}/subSection/${subSectionId}`
  //       )
  //       .then(({ data }) => {
  //         const { subSection } = data;
  //         setSubSectionData(subSection);
  //       });
  //   };

  return {
    isAddSubSectionBlockModalOpen,
    toggleAddSubSectionBlockModal,
    subSectionBlockMode,
    subSectionBlockData,
    subSectionData,
    handleBlockEdit,
    handleBlockDelete,
    refetchSubSection: refetchSubSection,
  };
};

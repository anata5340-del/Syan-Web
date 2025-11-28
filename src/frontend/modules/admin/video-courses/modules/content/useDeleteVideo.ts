import axios from "axios";
import toast from "react-hot-toast";

export const useDeleteVideo = ({ refetch, parentIds }) => {
  const {
    videoCourseId,
    moduleId,
    sectionId,
    subSectionId,
    subSectionBlockId,
  } = parentIds;
  const handleDelete = async () => {
    try {
      await axios.delete(
        `/api/videoCourses/${videoCourseId}/modules/${moduleId}/section/${sectionId}/subSection/${subSectionId}/subSectionBlock/${subSectionBlockId}/video`
      );
      refetch();
      toast.success("Successfully Deleted Attached Video");
    } catch (error) {
      console.error(error);
    }
  };

  return {
    handleDeleteVideo: handleDelete,
  };
};

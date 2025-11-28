import axios from "axios";
import toast from "react-hot-toast";

export const useDeleteQuestion = ({ refetch, parentIds }) => {
  const {
    videoCourseId,
    moduleId,
    sectionId,
    subSectionId,
    subSectionBlockId,
  } = parentIds;
  const handleDelete = async (questionId: string) => {
    try {
      await axios.delete(
        `/api/videoCourses/${videoCourseId}/modules/${moduleId}/section/${sectionId}/subSection/${subSectionId}/subSectionBlock/${subSectionBlockId}/questions`,
        {
          data: { questionId },
        }
      );
      refetch();
      toast.success("Successfully Deleted Attached Note");
    } catch (error) {
      console.error(error);
    }
  };

  return {
    handleDeleteQuestion: handleDelete,
  };
};

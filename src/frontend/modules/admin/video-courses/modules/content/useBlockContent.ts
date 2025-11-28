import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useBlockContent = () => {
  const router = useRouter();
  const {
    videoCourseId,
    moduleId,
    sectionId,
    subSectionId,
    subSectionBlockId,
  } = router.query;
  const [subSectionBlockData, setSubSectionBlockData] = useState(null);

  const getSubSectionBlockData = async () => {
    try {
      const response = await axios.get(
        `/api/videoCourses/${videoCourseId}/modules/${moduleId}/section/${sectionId}/subSection/${subSectionId}/subSectionBlock/${subSectionBlockId}`
      );
      const { subSectionBlock } = response.data;
      setSubSectionBlockData(subSectionBlock);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (
      videoCourseId &&
      moduleId &&
      sectionId &&
      subSectionId &&
      subSectionBlockId
    ) {
      getSubSectionBlockData();
    }
  }, [videoCourseId, moduleId, sectionId, subSectionId]);

  return {
    refetch: getSubSectionBlockData,
    subSectionBlockData,
    parentIds: {
      videoCourseId,
      moduleId,
      sectionId,
      subSectionId,
      subSectionBlockId,
    },
  };
};

import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useContent = () => {
  const router = useRouter();
  const { videoCourseId, moduleId, sectionId, subSectionId } = router.query;
  const [subSectionData, setSubSectionData] = useState(null);

  const getSubSectionData = async () => {
    try {
      const response = await axios.get(
        `/api/videoCourses/${videoCourseId}/modules/${moduleId}/section/${sectionId}/subSection/${subSectionId}`
      );
      const { subSection } = response.data;
      setSubSectionData(subSection);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (videoCourseId && moduleId && sectionId && subSectionId) {
      getSubSectionData();
    }
  }, [videoCourseId, moduleId, sectionId, subSectionId]);

  return {
    refetch: getSubSectionData,
    subSectionData,
    parentIds: {
      videoCourseId,
      moduleId,
      sectionId,
      subSectionId,
    },
  };
};

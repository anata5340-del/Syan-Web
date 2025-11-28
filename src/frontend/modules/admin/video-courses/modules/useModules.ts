import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
export const useModules = () => {
  const router = useRouter();
  const [moduleData, setModuleData] = useState(null);
  const { videoCourseId } = router.query;

  const getVideoCourseModule = () => {
    axios.get(`/api/videoCourses/${videoCourseId}/modules`).then(({ data }) => {
      const {
        videoCourses: { module },
      } = data;
      setModuleData(module);
    });
  };

  useEffect(() => {
    if (videoCourseId) getVideoCourseModule();
  }, [videoCourseId]);

  return {
    videoCourseId,
    moduleData,
    refetchModule: getVideoCourseModule,
  };
};

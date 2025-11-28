import Videos from "@/frontend/modules/user/overview/courses/modules/dashboard/videos/[videoId]/Videos";
import { isArray } from "lodash";
import { useRouter } from "next/router";

export default function Pages() {
  const router = useRouter();
  const {
    videoId,
    id: courseId,
    m: moduleId,
    s: sectionId,
    ss: subSectionId,
    ssb: subSectionBlockId,
    ssbt: subSectionBlockName,
    n: noteId,
  } = router.query;
  if (!videoId) {
    return <div>Could not find the video you were looking for</div>;
  }
  return (
    <>
      <Videos
        videoId={isArray(videoId) ? videoId[0] : videoId}
        noteId={isArray(noteId) ? noteId[0] : noteId}
        courseId={isArray(courseId) ? courseId[0] : courseId}
        moduleId={isArray(moduleId) ? moduleId[0] : moduleId}
        sectionId={isArray(sectionId) ? sectionId[0] : sectionId}
        subSectionId={isArray(subSectionId) ? subSectionId[0] : subSectionId}
        subSectionBlockId={
          isArray(subSectionBlockId) ? subSectionBlockId[0] : subSectionBlockId
        }
        subSectionBlockName={
          isArray(subSectionBlockName)
            ? subSectionBlockName[0]
            : subSectionBlockName
        }
      />
    </>
  );
}

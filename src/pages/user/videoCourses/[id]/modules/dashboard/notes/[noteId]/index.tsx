import Notes from "@/frontend/modules/user/overview/courses/modules/dashboard/notes/Notes";
import { isArray } from "lodash";
import { useRouter } from "next/router";

export default function Pages() {
  const router = useRouter();
  const {
    noteId,
    id: courseId,
    m: moduleId,
    s: sectionId,
    ss: subSectionId,
    ssb: subSectionBlockId,
    ssbt: subSectionBlockName,
    vid: videoId,
  } = router.query;
  if (!noteId) {
    return <div>Could not find the video you were looking for</div>;
  }
  return (
    <>
      <Notes
        noteId={isArray(noteId) ? noteId[0] : noteId}
        videoId={isArray(videoId) ? videoId[0] : videoId}
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

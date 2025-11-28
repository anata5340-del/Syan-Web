import Dashboard from "@/frontend/modules/user/overview/courses/modules/dashboard/Dashboard";
import { useRouter } from "next/router";
import { isArray } from "lodash";

export default function Pages() {
  const router = useRouter();
  const {
    id: courseId,
    m: moduleId,
    s: sectionId,
    ss: subSectionId,
    selected,
  } = router.query;
  if (!courseId || !moduleId || !sectionId || !subSectionId) {
    return <div>error 404: We could not find what you were looking for</div>;
  }
  return (
    <>
      <Dashboard
        courseId={isArray(courseId) ? courseId[0] : courseId}
        moduleId={isArray(moduleId) ? moduleId[0] : moduleId}
        sectionId={isArray(sectionId) ? sectionId[0] : sectionId}
        subSectionId={isArray(subSectionId) ? subSectionId[0] : subSectionId}
        selected={isArray(selected) ? selected[0] : selected}
      />
    </>
  );
}

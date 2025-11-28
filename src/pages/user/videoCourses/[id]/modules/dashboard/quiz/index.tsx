import Quiz from "@/frontend/modules/user/overview/courses/modules/dashboard/quiz/quiz";
import { isArray } from "lodash";
import { useRouter } from "next/router";

export default function Pages() {
  const router = useRouter();
  const {
    questions,
    id,
    moduleId,
    sectionId,
    subSectionId,
    t: time,
  } = router.query;
  if (!questions || !id || !subSectionId) {
    return <div>we could not find what you were looking for</div>;
  }
  return (
    <>
      <Quiz
        limit={null}
        moduleId={moduleId ? (isArray(moduleId) ? moduleId[0] : moduleId) : ""}
        sectionId={
          sectionId ? (isArray(sectionId) ? sectionId[0] : sectionId) : ""
        }
        subSectionId={isArray(subSectionId) ? subSectionId[0] : subSectionId}
        videoId={isArray(id) ? id[0] : id}
        topicIds={null}
        questionIds={isArray(questions) ? questions[0] : questions}
        paperId={null}
        quizId={null}
        time={Number(time)}
      />
    </>
  );
}

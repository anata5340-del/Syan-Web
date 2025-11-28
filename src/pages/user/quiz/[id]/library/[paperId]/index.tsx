import Quiz from "@/frontend/modules/user/overview/courses/modules/dashboard/quiz/quiz";
import { useRouter } from "next/router";
import { isArray } from "lodash";

export default function Pages() {
  const router = useRouter();
  const { id: quizId, paperId, t: time } = router.query;
  if (!quizId || !paperId) {
    return <div>404: Could not find the paper you were looking for</div>;
  }
  return (
    <>
      <Quiz
        limit={null}
        moduleId={null}
        sectionId={null}
        subSectionId={null}
        topicIds={null}
        videoId={null}
        questionIds={null}
        quizId={isArray(quizId) ? quizId[0] : quizId}
        paperId={isArray(paperId) ? paperId[0] : paperId}
        time={Number(time)}
      />
    </>
  );
}

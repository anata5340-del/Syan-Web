import Quiz from "@/frontend/modules/user/overview/courses/modules/dashboard/quiz/quiz";
import { isArray } from "lodash";
import { useRouter } from "next/router";
import { Suspense } from "react";

const CustomQuestions = () => {
  const router = useRouter();
  const { topics, t: time, id: quizId, limit } = router.query;
  if (!topics || !quizId) {
    return <div>we could not find what you were looking for</div>;
  }
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Quiz
          limit={Number(limit)}
          moduleId={null}
          sectionId={null}
          subSectionId={null}
          videoId={null}
          questionIds={null}
          topicIds={isArray(topics) ? topics[0] : topics}
          paperId={null}
          quizId={isArray(quizId) ? quizId[0] : quizId}
          time={Number(time)}
        />
      </Suspense>
    </>
  );
};

export default CustomQuestions;

import Modules from "@/frontend/modules/user/quiz/modules/Modules";
import { useRouter } from "next/router";

export default function Pages() {
  const router = useRouter();
  const { id } = router.query;
  if (!id) {
    return <div>404: Could not find quiz papers</div>;
  }

  return (
    <>
      <Modules id={id?.toString()} />
    </>
  );
}

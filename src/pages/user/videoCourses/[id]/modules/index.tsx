import Modules from "@/frontend/modules/user/overview/courses/modules/Modules";
import { useRouter } from "next/router";
import { isArray } from "lodash";

export default function Pages() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return <div>Error 404: Could not find the course you were looking for</div>;
  }
  return (
    <>
      <Modules id={isArray(id) ? id[0] : id} />
    </>
  );
}

import Favourite from "@/frontend/modules/user/overview/Favourite";
import { Suspense } from "react";
// import { userStore } from "@/store/user/user";

export default function Pages() {
  // const { getFavourites } = userStore();
  // getFavourites();
  return (
    <>
      <Suspense fallback={<div> Loading...</div>}>
        <Favourite />
      </Suspense>
    </>
  );
}

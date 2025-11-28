import Favourite from "@/frontend/modules/user/overview/Favourite";
import { Suspense } from "react";
import AllFavourites from "@/frontend/modules/user/overview/AllFavourites";

export default function Pages() {
  return (
    <>
      <Suspense fallback={<div> Loading...</div>}>
        <AllFavourites type="Videos" />
      </Suspense>
    </>
  );
}

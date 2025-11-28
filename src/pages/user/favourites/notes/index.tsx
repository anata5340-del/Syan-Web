import { Suspense } from "react";
import AllFavourites from "@/frontend/modules/user/overview/AllFavourites";

export default function Pages() {
  return (
    <>
      <Suspense fallback={<div> Loading...</div>}>
        <AllFavourites type="Notes" />
      </Suspense>
    </>
  );
}

import React from "react";
import BaseLayout from "./../components/BaseLayout";
import SearchBar from "./../components/SearchBar";
import Guide from "./../components/Guide";
import Description from "./../components/Description";

export default function Homepage() {
  return (
    <>
      <BaseLayout>
      <div class="flex items-center justify-center">
        <div class="flex flex-col max-w-screen-lg items-center gap-4 m-4">
          <SearchBar />
          <Guide />
          <Description />
        </div>
      </div>
      </BaseLayout>
    </>
  );
}

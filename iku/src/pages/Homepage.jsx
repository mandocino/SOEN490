import React from "react";
import BaseLayout from "./../components/BaseLayout";
import SearchBar from "./../components/SearchBar";
import Guide from "./../components/Guide";
import Description from "./../components/Description";

export default function Homepage() {
  return (
    <>
      <BaseLayout class="flex items-center justify-center h-full">
        <div class="flex flex-col grow max-w-screen-lg h-full items-center justify-center gap-8 m-8">
          <SearchBar />
          <Guide />
          <Description />
        </div>
      </BaseLayout>
    </>
  );
}

import React from "react";
import HomeHeader from "./../components/HomeHeader";
import Footer from "./../components/Footer";

export default function Homepage(props) {
  return (
    <>
      <div class="flex flex-col gap-0 min-h-screen">
        <div class="flex-none">
          <HomeHeader />
        </div>
        <div class={"grow bg-emerald-50 dark:bg-teal-900 "+props.class}>
          {props.children}
        </div>
        <div class="flex-none">
          <Footer />
        </div>
      </div>
    </>
  );
}

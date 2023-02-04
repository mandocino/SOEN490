import React from "react";
import HomeHeader from "./../components/HomeHeader";
import Footer from "./../components/Footer";

export default function Homepage(props) {
  return (
    <>
      <div className="flex flex-col gap-0 min-h-screen">
        <div className="flex-none">
          <HomeHeader />
        </div>
        <div className={"grow bg-emerald-50 dark:bg-teal-900 "+props.class}>
          {props.children}
        </div>
        <div className="flex-none">
          <Footer />
        </div>
      </div>
    </>
  );
}

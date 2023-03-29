import React from "react";
import HomeHeader from "./../components/HomeHeader";
import Footer from "./../components/Footer";

export default function Homepage(props) {
  return (
    <>
      <div className="flex flex-col gap-0 min-h-screen">
        <div className="flex-none z-10">
          <HomeHeader ignore={props.ignore} />
        </div>
        <div className={"grow bg-emerald-50 dark:bg-emerald-darkest "+props.className}>
          {props.children}
        </div>
        <div className="flex-none">
          <Footer />
        </div>
      </div>
    </>
  );
}

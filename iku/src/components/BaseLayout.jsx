import React from "react";
import HomeHeader from "./../components/HomeHeader";
import Footer from "./../components/Footer";
//import MyAccount from "./../components/MyAccount";

export default function Homepage(props) {
  return (
    <>
      <div class="flex flex-col gap-0 min-h-screen">
        <div class="flex-none">
          <HomeHeader />
        </div>
        <div class="flex-auto bg-emerald-50 dark:bg-teal-900">
          {props.children}
        </div>
        <div class="flex-none">
          <Footer />
        </div>
      </div>
    </>
  );
}

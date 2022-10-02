import React from "react";
import HomeHeader from "./../components/HomeHeader";
import SearchBar from "./../components/SearchBar";
import Guide from "./../components/Guide";
import Description from "./../components/Description";
import Footer from "./../components/Footer";

export default function Homepage() {
  return (
    <>
      <HomeHeader />
      <SearchBar />
      <Guide />
      <Description />
      <Footer />
    </>
  );
}

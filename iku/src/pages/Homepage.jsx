import React from "react";
import HomeHeader from "./../components/HomeHeader";
import SearchBar from "./../components/SearchBar";
import Guide from "./../components/Guide";
import Description from "./../components/Description";
import Footer from "./../components/Footer";
//import MyAccount from "./../components/MyAccount";
import styles from "./../styles/cssHomepage.module.css";

export default function Homepage() {
  return (
    <>
      <div class={styles.body}>
        <HomeHeader />
        <SearchBar />
        <Guide />
        <Description />
        <Footer />
      </div>
    </>
  );
}

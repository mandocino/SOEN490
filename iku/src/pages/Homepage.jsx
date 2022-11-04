import React from "react";
import HomeHeader from "./../components/HomeHeader.jsx";
import SearchBar from "./../components/SearchBar.jsx";
import Guide from "./../components/Guide.jsx";
import Description from "./../components/Description.jsx";
import Footer from "./../components/Footer.jsx";
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

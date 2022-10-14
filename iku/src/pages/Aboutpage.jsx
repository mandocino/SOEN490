import React from "react";
import HomeHeader from "../components/HomeHeader";
import Footer from "../components/Footer";
import About from "../components/AboutUs";
import styles from "./../styles/cssDashboard.module.css";

export default function Dashboardpage() {
  return (
    <>
      <div class={styles.body}>
        <HomeHeader />
        <About />
        <Footer />
      </div>
    </>
  );
}

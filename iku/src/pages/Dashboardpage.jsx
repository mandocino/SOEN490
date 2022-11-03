import React from "react";
import HomeHeader from "../components/HomeHeader";
import Footer from "../components/Footer";
import Dashboard from "../components/Dashboard";
import styles from "./../styles/cssDashboard.module.css";

export default function Dashboardpage() {
  return (
    <>
      <div class={styles.body}>
        <HomeHeader />
        <Dashboard />
        <Footer />
      </div>
    </>
  );
}

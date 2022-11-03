import React from "react";
import HomeHeader from "./../components/HomeHeader";
import Footer from "./../components/Footer";
import MyAccount from "./../components/MyAccount";
import styles from "./../styles/cssAccount.module.css";

export default function AccountPage() {
  return (
    <>
      <div class={styles.body}>
        <HomeHeader />
        <MyAccount />
        <Footer />
      </div>
    </>
  );
}

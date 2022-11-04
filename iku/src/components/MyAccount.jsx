import React from "react";
import tempUserImg from "./../assets/default_user.jpg";
import styles from "./../styles/cssAccount.module.css";

export default function MyAccount() {
  return (
    <>
      <div>
        <div>
          <section class="hero">
            <div class={styles.container}>
              <div>
                <p class={styles.pageTitle}>My Account</p>
              </div>
              <div>
                <div class={styles.accountBox}>
                  <img
                    class="is-rounded"
                    src={tempUserImg}
                    height="100px"
                    width="100px"
                  ></img>
                  <p class={styles.pageText}>Username</p>
                  <p class={styles.pageText}>Email</p>
                  <p class={styles.pageText}>Location</p>
                  <button class={styles.acctBtns}>
                    Change Profile Picture
                  </button>
                  <br></br>
                  <br></br>
                  <button class={styles.acctBtns}>
                    Edit Account Information
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

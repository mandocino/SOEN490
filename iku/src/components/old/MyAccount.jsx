import React from "react";
import tempUserImg from "./../assets/default_user.jpg";
import styles from "./../styles/cssAccount.module.css";

export default function MyAccount() {
  return (
    <>
      <div>
        <div>
          <section className="hero">
            <div className={styles.container}>
              <div>
                <p className={styles.pageTitle}>My Account</p>
              </div>
              <div>
                <div className={styles.accountBox}>
                  <img
                    className="is-rounded"
                    src={tempUserImg}
                    height="100px"
                    width="100px"
                  ></img>
                  <p className={styles.pageText}>Username</p>
                  <p className={styles.pageText}>Email</p>
                  <p className={styles.pageText}>Location</p>
                  <button className={styles.acctBtns}>
                    Change Profile Picture
                  </button>
                  <br></br>
                  <br></br>
                  <button className={styles.acctBtns}>
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

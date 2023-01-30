import React from "react";
import BusImg from "./../assets/stm_bus.jpg";
import styles from "./../styles/cssHomepage.module.css";

export default function Guide() {
  return (
    <>
      <div>
        <div>
          <section className="hero is-small">
            <div className="hero-body">
              <div className={styles.guideDiv}>
                <div className="columns has-text-weight-semibold">
                  <div className="column is-two-fourths">
                    <p className={styles.guideText}>
                      It's pretty straight forward.
                    </p>
                    <br></br>
                    <p className={styles.guideTextNumbered}>
                      1. Enter the address that you would live to be your origin
                    </p>
                    <br></br>

                    <p className={styles.guideTextNumbered}>
                      2. Enter the address(es) of the place(s) you frequent
                    </p>
                    <br></br>

                    <p className={styles.guideTextNumbered}>
                      3. Use the generated scores to compare the score with
                      other addresses you would like to check
                    </p>
                    <br></br>

                    <p className={styles.guideText}>Simple right?</p>
                  </div>
                  <div className="column is-two-fourths">
                    <img
                      className={styles.guideImg}
                      src={BusImg}
                      width="800"
                      height="600"
                      alt="Bus"
                    ></img>{" "}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

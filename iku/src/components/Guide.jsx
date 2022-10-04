import React from "react";
import "bulma/css/bulma.css";
import BusImg from "./../assets/stm_bus.jpg";
import styles from "./../styles/cssHomepage.module.css";

export default function Guide() {
  return (
    <>
      <div>
        <div>
          <section class="hero is-small">
            <div class="hero-body">
              <div class={styles.guideDiv}>
                <div class="columns has-text-weight-semibold">
                  <div class="column is-two-fourths">
                    <p class={styles.guideText}>
                      It's pretty straight forward.
                    </p>
                    <br></br>
                    <p class={styles.guideTextNumbered}>
                      1. Enter the address that you would live to be your origin
                    </p>
                    <br></br>

                    <p class={styles.guideTextNumbered}>
                      2. Enter the address(es) of the place(s) you frequent
                    </p>
                    <br></br>

                    <p class={styles.guideTextNumbered}>
                      3. Use the generated scores to compare the score with
                      other addresses you would like to check
                    </p>
                    <br></br>

                    <p class={styles.guideText}>Simple right?</p>
                  </div>
                  <div class="column is-two-fourths">
                    <img
                      class={styles.guideImg}
                      src={BusImg}
                      width="800"
                      height="600"
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

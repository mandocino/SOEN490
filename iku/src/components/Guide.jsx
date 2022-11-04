import React from "react";
import BusImg from "./../assets/stm_bus.jpg";
import styles from "./../styles/cssHomepage.module.css";

export default function Guide() {
  return (
    <>
      <div class="bg-emerald-500 rounded-3xl text-white flex justify-between p-4">
        <div class="">
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
        <div class="flex items-center justify-center">
          <img
            class="max-w-xl rounded-lg"
            src={BusImg}
            alt="Bus"
          ></img>{" "}
        </div>
      </div>
    </>
  );
}

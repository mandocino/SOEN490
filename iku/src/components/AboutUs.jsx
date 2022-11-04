import React from "react";
import styles from "./../styles/cssAbout.module.css";

export default function AboutUs() {
  return (
    <>
      <div>
        <div>
          <section class="hero">
            <div class={styles.container}>
              <div class={styles.pageBox}>
                <p class={styles.pageTitle}>Project IKU</p>
                <p class={styles.pageTitle}>CAPSTONE SOEN490</p>
                <br />
                <p class={styles.pageText}>Shuaib Rauph (srauph) - 40134457</p>
                <p class={styles.pageText}>Mahmoud Idlbi (Mah514) - 40016792</p>
                <p class={styles.pageText}>
                  Auvigoo Ahmed (auvigoo20) - 40128901
                </p>
                <p class={styles.pageText}>
                  Aseel Meeran (AseelAce) Babu Hussain - 40137262
                </p>
                <p class={styles.pageText}>Ali Hanni (alimus22) - 40157164</p>
                <p class={styles.pageText}>
                  Marie-Eve Hazari (MarieHaz) - 40156408
                </p>
                <p class={styles.pageText}>
                  Tommy Soucy (TommySoucy) - 40085762
                </p>
                <p class={styles.pageText}>
                  Frederick Munro (FrederickMunro) - 40063651
                </p>
                <p class={styles.pageText}>
                  Armando Mancino (mandocino) - 40078466
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

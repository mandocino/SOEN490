import React from "react";
import styles from "./../styles/cssAbout.module.css";

export default function AboutUs() {
  return (
    <>
      <div>
        <div>
          <section className="hero">
            <div className={styles.container}>
              <div className={styles.pageBox}>
                <p className={styles.pageTitle}>Project IKU</p>
                <p className={styles.pageTitle}>CAPSTONE SOEN490</p>
                <br />
                <p className={styles.pageText}>Shuaib Rauph (srauph) - 40134457</p>
                <p className={styles.pageText}>Mahmoud Idlbi (Mah514) - 40016792</p>
                <p className={styles.pageText}>
                  Auvigoo Ahmed (auvigoo20) - 40128901
                </p>
                <p className={styles.pageText}>
                  Aseel Meeran (AseelAce) Babu Hussain - 40137262
                </p>
                <p className={styles.pageText}>Ali Hanni (alimus22) - 40157164</p>
                <p className={styles.pageText}>
                  Marie-Eve Hazari (MarieHaz) - 40156408
                </p>
                <p className={styles.pageText}>
                  Tommy Soucy (TommySoucy) - 40085762
                </p>
                <p className={styles.pageText}>
                  Frederick Munro (FrederickMunro) - 40063651
                </p>
                <p className={styles.pageText}>
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

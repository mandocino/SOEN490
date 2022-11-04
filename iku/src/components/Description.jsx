import React from "react";
import styles from "./../styles/cssHomepage.module.css";

export default function Description() {
  return (
    <>
      <div class="shadow-lg shadow-gray-400 dark:shadow-gray-900 bg-emerald-500 rounded-3xl text-white font-semibold flex justify-between p-6">
        IKU is a free web service dedicated to helping people wishing
        to live car-free or simply reduce their dependence on a car by
        choosing where they would like to live based on the provided
        transit service to a target (current or potential) home. To do so, we will
        provide you with transit scores of the target home. Scores
        are provided for Rush-hour, Off-peak, Weekend and Night
        service. Using these 4 scores, you can make a choice that
        would be fitting for your lifestlye.
      </div>
    </>
  );
}

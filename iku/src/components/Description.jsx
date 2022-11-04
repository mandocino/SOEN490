import React from "react";
import styles from "./../styles/cssHomepage.module.css";

export default function Description() {
  return (
    <>
      <div class="bg-emerald-500 rounded-3xl text-white flex justify-between p-4">
        IKU is a free web service dedicated to helping people wishing
        to live car free or simply reduce their dependence on a car by
        choosing where they would like to live based on the provided
        transit service to their potential home. To do so, we will
        provide you with transit scores of your potential home. Scores
        are privded for Rush-hour, Off-peak, Weekend and Night
        service. Using these 4 scores, you can make a choice that
        would be fitting for your lifestlye.
      </div>
    </>
  );
}

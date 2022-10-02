import React from "react";
import "bulma/css/bulma.css";
import BusImg from "./../assets/stm_bus.jpg";

export default function Guide() {
  return (
    <>
      <div>
        <div>
          <section class="hero is-small is-info">
            <div class="hero-body">
              <div class="columns has-text-weight-semibold">
                <div class="column is-two-fourths">
                  <p class="mb-2">It's pretty straight foward.</p>
                  <p class="mb-3">
                    1. Enter the address that you would live to be your origin
                  </p>
                  <p class="mb-3">
                    2. Enter the address(es) of the place(s) you frequent
                  </p>
                  <p>
                    3. Use the generated scores to compare the score with other
                    addresses you would like to check
                  </p>
                  <p class="mt-2">Simple right?</p>
                </div>
                <div class="column is-two-fourths">
                  <img src={BusImg} width="500" height="300"></img>{" "}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

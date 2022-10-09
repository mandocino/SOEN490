import React from "react";
import "bulma/css/bulma.css";
import styles from "./../styles/cssDashboard.module.css";

export default function Dashboard() {
  return (
    <>
      <div>
        <div>
          <section class="hero">
            <p class={styles.pageTitle}>Dashboard</p>
            <div class="hero is-small">
              <div class="hero-body">
                <div class={styles.guideDiv}>
                  <div class="columns has-text-weight-semibold">
                    <div class="column is-two-fourths">
                      <p>Your Home</p>
                      <input type="text"></input>
                      <br />
                      <p>Your Home</p>
                      <input type="text"></input>
                      <br />
                      <p>Your Home</p>
                      <input type="text"></input>
                      <br />
                      <p>Your Home</p>
                      <input type="text"></input>
                      <br />
                    </div>
                    <div class="column is-two-fourths">
                      <p>Your Home</p>
                      <p>Your Home</p>
                      <p>Your Home</p>
                      <p>Your Home</p>
                      <input
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <label for="vehicle1"> I have a bike</label>
                      <br />
                      <input
                        type="checkbox"
                        id="vehicle2"
                        name="vehicle2"
                        value="Car"
                      />
                      <label for="vehicle2"> I have a car</label>
                      <br />
                      <input
                        type="checkbox"
                        id="vehicle3"
                        name="vehicle3"
                        value="Boat"
                      />
                      <label for="vehicle3"> I have a boat</label>
                    </div>
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

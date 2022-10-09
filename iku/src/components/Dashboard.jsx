import React from "react";
import "bulma/css/bulma.css";
import styles from "./../styles/cssDashboard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDumbbell,
  faHouseChimney,
  faHouseUser,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  return (
    <>
      <div>
        <div>
          <section class="hero">
            <p class={styles.pageTitle}>Dashboard</p>
            <div class={styles.dashboardDiv}>
              <div class="hero is-small">
                <div class="hero-body">
                  <div class="columns has-text-weight-semibold">
                    <div class="column is-two-fourths">
                      <p class={styles.dashboardText}>
                        Your Home <FontAwesomeIcon icon={faHouseChimney} />
                      </p>
                      <input
                        class={styles.inputBoxes}
                        type="text"
                        placeholder="1234, Street Name, City, Province, A1B 2C3"
                      ></input>{" "}
                    </div>
                  </div>
                  <div class="columns has-text-weight-semibold">
                    <div class="column is-two-fourths">
                      <br />
                      <p class={styles.dashboardText}>
                        Work <FontAwesomeIcon icon={faBriefcase} />
                      </p>
                      <input
                        class={styles.inputBoxes}
                        type="text"
                        placeholder="1234, Street Name, City, Province, A1B 2C3"
                      ></input>
                      <br />
                      <p class={styles.dashboardText}>
                        Gym <FontAwesomeIcon icon={faDumbbell} />
                      </p>
                      <input
                        class={styles.inputBoxes}
                        type="text"
                        placeholder="1234, Street Name, City, Province, A1B 2C3"
                      ></input>
                      <br />
                      <p class={styles.dashboardText}>
                        Friend's Home <FontAwesomeIcon icon={faHouseUser} />
                      </p>
                      <input
                        class={styles.inputBoxes}
                        type="text"
                        placeholder="1234, Street Name, City, Province, A1B 2C3"
                      ></input>
                      <br />
                    </div>
                    <div class="column is-two-fourths">
                      <br />
                      <p class={styles.optionsText}>
                        Rush-hour Off-Peak Weekend Midnight Overall
                      </p>
                      <br />
                      <input
                        class={styles.radioBtn1}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />{" "}
                      <input
                        class={styles.radioBtn2}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        class={styles.radioBtn3}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        class={styles.radioBtn4}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        class={styles.radioBtn5}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <br />
                      <br />
                      <input
                        class={styles.radioBtn6}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        class={styles.radioBtn7}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        class={styles.radioBtn8}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        class={styles.radioBtn9}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        class={styles.radioBtn10}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <br />
                      <br />
                      <input
                        class={styles.radioBtn11}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        class={styles.radioBtn12}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        class={styles.radioBtn13}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        class={styles.radioBtn14}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        class={styles.radioBtn15}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button class={styles.editBtn}>Edit Addresses</button>{" "}
          </section>
        </div>
      </div>
    </>
  );
}

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
                      ></input>
                      <br />
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
                      <input
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />{" "}
                      <input
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <br />
                      <input
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />{" "}
                      <input
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <br />
                      <input
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />{" "}
                      <input
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
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

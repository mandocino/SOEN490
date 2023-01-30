import React from "react";
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
          <section className="hero">
            <p className={styles.pageTitle}>Dashboard</p>
            <div className={styles.dashboardDiv}>
              <div className="hero is-small">
                <div className="hero-body">
                  <div className="columns has-text-weight-semibold">
                    <div className="column is-two-fourths">
                      <p className={styles.dashboardText}>
                        Your Home <FontAwesomeIcon icon={faHouseChimney} />
                      </p>
                      <input
                        className={styles.inputBoxes}
                        type="text"
                        placeholder="1234, Street Name, City, Province, A1B 2C3"
                      ></input>{" "}
                    </div>
                  </div>
                  <div className="columns has-text-weight-semibold">
                    <div className="column is-two-fourths">
                      <br />
                      <p className={styles.dashboardText}>
                        Work <FontAwesomeIcon icon={faBriefcase} />
                      </p>
                      <input
                        className={styles.inputBoxes}
                        type="text"
                        placeholder="1234, Street Name, City, Province, A1B 2C3"
                      ></input>
                      <br />
                      <p className={styles.dashboardText}>
                        Gym <FontAwesomeIcon icon={faDumbbell} />
                      </p>
                      <input
                        className={styles.inputBoxes}
                        type="text"
                        placeholder="1234, Street Name, City, Province, A1B 2C3"
                      ></input>
                      <br />
                      <p className={styles.dashboardText}>
                        Friend's Home <FontAwesomeIcon icon={faHouseUser} />
                      </p>
                      <input
                        className={styles.inputBoxes}
                        type="text"
                        placeholder="1234, Street Name, City, Province, A1B 2C3"
                      ></input>
                      <br />
                    </div>
                    <div className="column is-two-fourths">
                      <br />
                      <p className={styles.optionsText}>
                        Rush-hour Off-Peak Weekend Midnight Overall
                      </p>
                      <br />
                      <input
                        className={styles.radioBtn1}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />{" "}
                      <input
                        className={styles.radioBtn2}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        className={styles.radioBtn3}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        className={styles.radioBtn4}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        className={styles.radioBtn5}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <br />
                      <br />
                      <input
                        className={styles.radioBtn6}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        className={styles.radioBtn7}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        className={styles.radioBtn8}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        className={styles.radioBtn9}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        className={styles.radioBtn10}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <br />
                      <br />
                      <input
                        className={styles.radioBtn11}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        className={styles.radioBtn12}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        className={styles.radioBtn13}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        className={styles.radioBtn14}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        value="Bike"
                      />
                      <input
                        className={styles.radioBtn15}
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
            <button className={styles.editBtn}>Edit Addresses</button>{" "}
          </section>
        </div>
      </div>
    </>
  );
}

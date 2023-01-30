import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import styles from "./../styles/cssHomepage.module.css";

export default function SearchBar() {
  return (
    <>
      <div>
        <div>
          <section className="hero is-small">
            <div className="hero-body">
              <div className={styles.searchDiv}>
                <p className="has-text-centered is-size-1">
                  {" "}
                  Let's find your transit scores
                </p>
                <div className="field">
                  <br></br>
                  <div className="columns">
                    <div className="column is-three-fifths">
                      <p className="control has-icons-left">
                        <input
                          className={styles.searchBar}
                          type="email"
                          placeholder="                   Enter the address or postal code"
                        ></input>
                        <a href="/search">
                          <span className="icon is-size-2 is-left ml-5">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                          </span>
                        </a>
                      </p>
                    </div>
                    <div className="column">
                      <p className={styles.searchText}>or</p>
                    </div>
                    <div className="column">
                      <button className={styles.locationBtn}>
                        Current Location
                      </button>
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

import React from "react";
import "bulma/css/bulma.css";
//import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Homepage() {
  return (
    <>
      <div>
        <div>
          <section class="hero is-small is-info">
            <div class="hero-body">
              <p class="has-text-centered is-size-1">
                {" "}
                Let's find your transit scores
              </p>
              <div class="field">
                <br></br>
                <div class="columns">
                  <div class="column is-four-fifths">
                    <p class="control has-icons-left">
                      <input
                        class="input is-size-2 has-text-link"
                        type="email"
                        placeholder="Enter the address or postal code"
                      ></input>
                      <a href="/search">
                        <span class="icon is-size-2 is-left">
                          <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </span>
                      </a>
                    </p>
                  </div>
                  <div class="column">
                    <p class="is-size-1 mt-2 has-text-white">or</p>
                  </div>
                  <div class="column">
                    <button class="button is-size-3 is-black mr-4 mt-3">
                      Current Location
                    </button>
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

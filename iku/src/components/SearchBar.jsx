import React from "react";
import {useRef} from 'react';
//import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import styles from "./../styles/cssHomepage.module.css";
import axios from "axios";

export default function SearchBar() {

  // To autofill the textbox after fetching current location
  const inputRef = useRef(null);

  const getCurrentLocation = async () => {
    if(!navigator.geolocation){
      alert("ERROR: Goeolocation is not supported by your browser");
    }
    else{
      navigator.geolocation.getCurrentPosition(async (position) => {
  
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        await axios.get('http://localhost:5000/address', {
            params:{
              lat: latitude,
              lng: longitude
            }
        })
        .then(function(response){
          console.log(response.data.address);
          inputRef.current.value = response.data.address;
        });
  
      }, () => {
        alert("Unable to retrieve your location.");
      });
    }
  }


  return (
    <>
      <div>
        <div>
          <section class="hero is-small">
            <div class="hero-body">
              <div class={styles.searchDiv}>
                <p class="has-text-centered is-size-1">
                  {" "}
                  Let's find your transit scores
                </p>
                <div class="field">
                  <br></br>
                  <div class="columns">
                    <div class="column is-three-fifths">
                      <p class="control has-icons-left">
                        <input
                          ref = {inputRef}
                          class={styles.searchBar}
                          type="email"
                          placeholder="                   Enter the address or postal code"
                        ></input>
                        <a href="/search">
                          <span class="icon is-size-2 is-left ml-5">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                          </span>
                        </a>
                      </p>
                    </div>
                    <div class="column">
                      <p class={styles.searchText}>or</p>
                    </div>
                    <div class="column">
                      <button class={styles.locationBtn} onClick={getCurrentLocation}>
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

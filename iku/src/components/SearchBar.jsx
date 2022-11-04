import React from "react";
import {useState, useRef} from 'react';
//import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import styles from "./../styles/cssHomepage.module.css";
import axios from "axios";

export default function SearchBar() {

  // To autofill the textbox after fetching current location
  const inputRef = useRef(null);

  // Handles input in the search bar
  const [input, setInput] = useState('');

  // Handles places suggestions returned by api
  const [suggestions, setSuggestions] = useState([]);


  const selectSuggestion = suggestion => {
    inputRef.current.value = suggestion;
    setInput(suggestion);
    setSuggestions([]);
  }

  const handleEnterPressed = async event => {
    if(event.key === 'Enter'){
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    await axios.get('http://localhost:5000/coordinates',{
      params: {
        address: input 
      }
    })
    .then((response) => {
      console.log(response.data.coordinates);
    }).catch(error => {
      console.log(error.message);
    }) 
  }

  const getSuggestions = async event => {
    setInput(event.target.value);
    if(event.target.value.length > 0) {
      await axios.get('http://localhost:5000/suggestions',{
        params: {
          input: event.target.value
        }
      })
      .then((response) => {
        setSuggestions(response.data.predictions);
      }).catch(error => {
        console.log(error.message);
        setSuggestions([]);
      }) 
    } else{
      setSuggestions([]);
    }
  };

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
                          type = "email"
                          onChange={getSuggestions}
                          onKeyDown={handleEnterPressed}
                          placeholder="                   Enter the address or postal code"
                        ></input>
                        <div class={styles.suggestionList}>
                          {suggestions.map(suggestion => {
                            return(
                              <div 
                                class={styles.suggestion}
                                onClick={() => selectSuggestion(suggestion)}>
                                {suggestion}
                              </div>
                            );
                          })}
                        </div>
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

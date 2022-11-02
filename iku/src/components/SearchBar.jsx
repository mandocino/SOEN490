import React from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import "bulma/css/bulma.css";
//import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import styles from "./../styles/cssHomepage.module.css";

export default function SearchBar() {

  const [address, setAddress] = React.useState("");
  const [coordinates, setCoordinates] = React.useState({
    lat: null,
    lng: null
  })

  const handleSelect = async value => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setCoordinates(latLng);
    setAddress(value);
    console.log(latLng);
  };

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
                        <PlacesAutocomplete 
                            value={address} 
                            onChange={setAddress} 
                            onSelect={handleSelect}
                          >
                            {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                              <div>
                                <input
                                  class={styles.searchBar}
                                  {... getInputProps({placeholder: 
                                    "                   Enter the address or postal code"})}
                                />
                                <div class={styles.suggestionList}>
                                  {loading ? <div>...loading</div> : null}
                                  {suggestions.map((suggestion) => {
                                    const style = {
                                      backgroundColor: suggestion.active ? "#50C1E9" : "#fff",
                                      color: suggestion.active ? "#fff" : "#38a8d9"
                                    };

                                    return (
                                      <div {...getSuggestionItemProps(suggestion, { style })}>
                                        {suggestion.description}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                        </PlacesAutocomplete>
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
                      <button class={styles.locationBtn}>
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

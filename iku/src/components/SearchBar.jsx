import { React, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mongoose from "mongoose";
import axios from "axios";
import { ReactComponent as Location } from "./../assets/location.svg";
import Tooltip from "@mui/material/Tooltip";

import SimpleSearchBar from './SimpleSearchBar';
import {hostname} from "../App";

export default function SearchBar() {
  // To autofill the textbox after fetching current location
  const inputRef = useRef(null);

  // Handles input in the search bar
  const [input, setInput] = useState("");

  // Handles places suggestions returned by api
  const [suggestions, setSuggestions] = useState([]);

  // Checks if user is on desktop
  const [currentLocationButton, setCurrentLocationButton] = useState(null);

  useEffect(() => {
    if (
      !navigator.userAgent.match(/Android/i) &&
      !navigator.userAgent.match(/iPhone/i)
    ) {
      setCurrentLocationButton(
        <div>
          <Tooltip
            placement="right"
            title="WARNING: Current location may not be accurate on desktop"
          >
            <button
              type="button"
              className="w-14 h-14 flex items-center justify-center transition ease-in-out duration-200 text-white hover:text-emerald-dark bg-emerald-600 hover:bg-white focus:ring-4 focus:outline-none focus:ring-emerald-400 font-semibold rounded-lg p-3"
            >
              <Location onClick={getCurrentLocation} />
            </button>
          </Tooltip>
        </div>
      );
    } else {
      setCurrentLocationButton(
        <div>
          <button
            type="button"
            className="w-14 h-14 flex items-center justify-center transition ease-in-out duration-200 text-white bg-emerald-500 hover:bg-emerald-700 focus:ring-4 focus:outline-none focus:ring-emerald-400 font-semibold rounded-lg p-3"
          >
            <Location onClick={getCurrentLocation} />
          </button>
        </div>
      );
    }
  }, []);

  const navigate = useNavigate();

  const selectSuggestion = (suggestion) => {
    inputRef.current.value = suggestion;
    setInput(suggestion);
    setSuggestions([]);
  };

  const handleEnterPressed = async (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios
      .get("http://"+hostname+":5000/coordinates", {
        params: {
          address: input,
        },
      })
      .then(async (response) => {
        const userId = localStorage.getItem("user_id");
        const location = {
          latitude: response.data.coordinates.lat,
          longitude: response.data.coordinates.lng,
          name: input.split(",")[0],
          notes: input,
          origin: true,
          current_home: false,
        };

        let locationStringArray;
        if (userId == null) {
          locationStringArray = sessionStorage.getItem("location");

          if (locationStringArray == null) {
            sessionStorage.setItem("location", JSON.stringify([location]));
          } else {
            let locationsArray = JSON.parse(locationStringArray);
            locationsArray.push(location);
            sessionStorage.setItem("location", JSON.stringify(locationsArray));
          }

        } else {
          await axios
            .post("http://"+hostname+":5000/newlocation", {
              user_id: mongoose.Types.ObjectId(userId),
              ...location,
            })
            .catch((error) => {
              console.log(error.message);
            });
        }
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const getSuggestions = async (event) => {
    setInput(event.target.value);
    if (event.target.value.length > 0) {
      await axios
        .get("http://"+hostname+":5000/suggestions", {
          params: {
            input: event.target.value,
          },
        })
        .then((response) => {
          setSuggestions(response.data.predictions);
        })
        .catch((error) => {
          console.log(error.message);
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
    }
  };

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("ERROR: Goeolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          await axios
            .get("http://"+hostname+":5000/address", {
              params: {
                lat: latitude,
                lng: longitude,
              },
            })
            .then(function (response) {
              inputRef.current.value = response.data.address;
            })
            .catch((error) => {
              console.log(error.message);
            });
        },
        () => {
          alert("Unable to retrieve your location.");
        }
      );
    }
  };

  return (
    <>
      <div className="shadow-lg shadow-gray-400 dark:shadow-gray-900 rounded-3xl w-full bg-cover bg-center bg-[url('/src/assets/stm_bus.jpg')]">
        <div className="rounded-3xl p-2 xs:p-8 sm:p-16 w-full backdrop-blur backdrop-brightness-50 flex flex-col items-center justify-center">
          <div className="text-emerald-400 dark:text-emerald-400 flex flex-col gap-4 p-4">
            <p className="text-center text-5xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-emerald-500">
              Let's find your transit scores
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <SimpleSearchBar />
              <span className="flex items-center justify-center gap-4">
                <span className="h-14 flex items-center">
                  <p>or</p>
                </span>
                {/* w-14 and h-14 is the size of the adjacent searchbox */}
                {currentLocationButton}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

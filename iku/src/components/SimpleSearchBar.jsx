import { React, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import mongoose from "mongoose";
import axios from "axios";

const SimpleSearchBar = ({ buttonName='Search' }) => {

  const inputRef = useRef(null); // To autofill the textbox after fetching current location

  const [input, setInput] = useState(""); // Handles input in the search bar

  const [suggestions, setSuggestions] = useState([]); // Handles places suggestions returned by api

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
      .get("http://localhost:5000/coordinates", {
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
        if(userId == null) {
          locationStringArray = sessionStorage.getItem("location")

          if(locationStringArray == null) {
            sessionStorage.setItem('location', JSON.stringify([location]));
          } else {
            let locationsArray = JSON.parse(locationStringArray);
            locationsArray.push(location);
            sessionStorage.setItem('location', JSON.stringify(locationsArray));
          }
        } else {
          await axios
            .post("http://localhost:5000/newlocation", {
              user_id: mongoose.Types.ObjectId(userId),
              ...location
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
    window.location.reload();
  };

  const getSuggestions = async (event) => {
    setInput(event.target.value);
    if (event.target.value.length > 0) {
      axios.get("http://localhost:5000/suggestions", {
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

  return (
    <>
      <form className="rounded-lg drop-shadow-lg grow">
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">
          {buttonName}
        </label>
        <div className="relative">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            ref={inputRef}
            onChange={getSuggestions}
            onKeyDown={handleEnterPressed}
            type="search"
            id="default-search"
            className="accent-emerald-700 dark:accent-white transition ease-in-out duration-200 block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border-2 border-emerald-500 focus:border-emerald-700 dark:bg-gray-700 dark:border-emerald-400 dark:placeholder-gray-400 dark:text-white dark:focus:border-white"
            placeholder="Search Location"
            list="suggestions"
            autoComplete="off"
            required
          />
          <datalist id="suggestions">
            {suggestions.map((suggestion) => {
              return (
                <option
                  className="cursor-pointer"
                  onClick={() => selectSuggestion(suggestion)}
                  value={suggestion}
                  key={suggestion}
                />
              );
            })}
          </datalist>
          <button
            onClick={handleSubmit}
            className="transition ease-in-out duration-200 text-white absolute right-2.5 bottom-2.5 bg-emerald-500 hover:bg-emerald-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-semibold rounded-lg text-sm px-4 py-2 dark:bg-emerald-400 dark:hover:bg-emerald-600 dark:focus:ring-green-300"
          >
            {buttonName}
          </button>
        </div>
      </form>
    </>
  )
}

export default SimpleSearchBar
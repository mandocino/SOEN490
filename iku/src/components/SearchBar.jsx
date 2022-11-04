import React from "react";
//import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import styles from "./../styles/cssHomepage.module.css";

export default function SearchBar() {
  return (
    <>
      <div class="text-emerald-500 dark:text-emerald-400 flex flex-col gap-4 max-w-screen-md p-4">
        <p class="text-center text-5xl">
          Let's find your transit scores
        </p>
        <form class="rounded-lg drop-shadow-lg">   
          <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">Search</label>
          <div class="relative">
            <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg aria-hidden="true" class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input type="search" id="default-search" class="accent-white transition ease-in-out duration-200 block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border-2 border-emerald-500 focus:ring-green-300 focus:border-emerald-700 dark:bg-gray-700 dark:border-emerald-400 dark:placeholder-gray-400 dark:text-white dark:focus:border-white" placeholder="Search Location" required/>
            <button type="submit" class="transition ease-in-out duration-200 text-white absolute right-2.5 bottom-2.5 bg-emerald-500 hover:bg-emerald-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-semibold rounded-lg text-sm px-4 py-2 dark:bg-emerald-400 dark:hover:bg-emerald-600 dark:focus:ring-green-300">Search</button>
          </div>
        </form>
      </div>
    </>
  );
}

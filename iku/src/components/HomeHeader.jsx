import React from "react";
import { Link, useLocation } from "react-router-dom";
import LinkButton from "./custom/LinkButton";
import Button from "./custom/Button";
import Logo from "./custom/Logo";

export default function HomeHeader() {
  const location = useLocation();
  return (
    <header>
      <nav class="bg-emerald-500 dark:bg-emerald-700 px-4 lg:px-6 py-2.5 ">
        <div class="flex flex-wrap justify-between items-center mx-auto">
          <Link to="/" class="flex items-center">
            <Logo class="fill-white stroke-white hover:fill-emerald-100 hover:scale-110 duration-200 transition" />
          </Link>
          <div
            class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul class="flex flex-col mt-4 font-medium lg:flex-row space-x-4 lg:mt-0">
              <li class="flex items-center">
                <LinkButton to="/dashboard">Dashboard</LinkButton>
              </li>
              {location.pathname !== "/" ? (
                <li class="w-96">
                  <form>
                    <label
                      htmlFor="default-search"
                      class="mb-2 text-sm font-medium text-white sr-only"
                    >
                      Search
                    </label>
                    <div class="relative">
                      <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <svg
                          aria-hidden="true"
                          class="w-5 h-5 text-emerald-100"
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
                          ></path>
                        </svg>
                      </div>
                      <input
                        type="search"
                        id="default-search"
                        class="transition ease-in-out duration-200 block p-4 pl-10 w-full text-md font-semibold text-white placeholder-white bg-emerald-500 rounded-lg border-2 border-emerald-200 dark:border-emerald-300 accent-white focus:border-white dark:bg-emerald-700 dark:placeholder-emerald-100"
                        placeholder="Search Location"
                        required
                      />
                      <button
                        type="submit"
                        class="transition ease-in-out duration-200 text-emerald-600 dark:text-emerald-800 absolute right-3 bottom-3 bg-emerald-200 hover:bg-white focus:ring-4 focus:outline-none focus:ring-green-300 font-semibold rounded-lg text-sm px-4 py-2 dark:bg-emerald-300 dark:focus:ring-green-300"
                      >
                        Search
                      </button>
                    </div>
                  </form>
                </li>
              ) : null}
              <li class="flex items-center">
                <LinkButton to="/">Help</LinkButton>
              </li>
            </ul>
          </div>
          <div class="flex items-center lg:order-2">
            <ul class="flex flex-col mt-4 font-medium lg:flex-row space-x-4 space-y-1 lg:space-y-0 lg:mt-0">
              {localStorage.getItem("authenticated") !== "true" ? (
                <>
                  <li class="flex items-center justify-end">
                    <LinkButton to="/login">Log In</LinkButton>
                  </li>
                  <li class="flex items-center justify-end">
                    <LinkButton to="/register">Register</LinkButton>
                  </li>
                </>
              ) : (
                <>
                  <li class="flex items-center">
                    <Link
                      to="/accountpage"
                      class="transition ease-in-out hover:scale-110 duration-200 rounded-lg focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-400"
                    >
                      <Button>
                        {localStorage.getItem("first_name")}
                      </Button>
                    </Link>
                  </li>
                  <li class="flex items-center">
                    <Link
                      to="/"
                      class="transition ease-in-out hover:scale-110 duration-200 rounded-lg focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-400"
                      onClick={() => {
                        localStorage.removeItem("authenticated");
                        localStorage.removeItem("first_name");
                        localStorage.removeItem("user_id");
                        window.location.reload();
                      }}
                    >
                      <Button>
                        Sign Out
                      </Button>
                    </Link>
                  </li>
                </>
              )}
            </ul>
            <button
              data-collapse-toggle="mobile-menu-2"
              type="button"
              class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded="false"
            >
              <span class="sr-only">Open main menu</span>
              <svg
                class="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                class="hidden w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

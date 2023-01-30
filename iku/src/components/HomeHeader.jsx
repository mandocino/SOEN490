import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LinkButton from "./custom/LinkButton";
import Button from "./custom/Button";
import Logo from "./custom/Logo";
import mongoose from "mongoose";
import axios from "axios";

import SimpleSearchBar from './SimpleSearchBar';

export default function HomeHeader() {
  
  const location = useLocation();

  return (
    <header>
      <nav className="bg-emerald-500 dark:bg-emerald-700 px-4 lg:px-6 py-2.5 ">
        <div className="flex flex-wrap justify-between items-center mx-auto">
          <Link to="/" className="flex items-center">
            <Logo class="fill-white stroke-white hover:fill-emerald-100 hover:scale-110 duration-200 transition" />
          </Link>
          <div
            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row space-x-4 lg:mt-0">
              <li className="flex items-center">
                <LinkButton to="/dashboard">Dashboard</LinkButton>
              </li>
              {location.pathname !== "/" ? (
                <li class="w-96">
                  <SimpleSearchBar />
                </li>
              ) : null}
              <li className="flex items-center">
                <LinkButton to="/">Help</LinkButton>
              </li>
            </ul>
          </div>
          <div className="flex items-center lg:order-2">
            <ul className="flex flex-col mt-4 font-medium lg:flex-row space-x-4 space-y-1 lg:space-y-0 lg:mt-0">
              {localStorage.getItem("authenticated") !== "true" ? (
                <>
                  <li className="flex items-center justify-end">
                    <LinkButton to="/login">Log In</LinkButton>
                  </li>
                  <li className="flex items-center justify-end">
                    <LinkButton to="/register">Register</LinkButton>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center">
                    <Link
                      to="/accountpage"
                      className="transition ease-in-out hover:scale-110 duration-200 rounded-lg focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-400"
                    >
                      <Button>
                        {localStorage.getItem("first_name")}
                      </Button>
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <Link
                      to="/"
                      className="transition ease-in-out hover:scale-110 duration-200 rounded-lg focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-400"
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
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
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
                className="hidden w-6 h-6"
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

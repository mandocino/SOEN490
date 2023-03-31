import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LinkButton from "./custom/LinkButton";
import Button from "./custom/Button";
import Logo from "./custom/Logo";

import SimpleSearchBar from './SimpleSearchBar';

export default function HomeHeader({ ignore }) {

  const [isMenu, setIsMenu] = useState(false)

  if (ignore === undefined) ignore = [] ;
  const location = useLocation();

  return (
    <header>
      <nav className="bg-emerald-500 dark:bg-emerald-700 px-4 py-2.5 ">
        <div className="flex justify-between items-center">
          <div className="hidden md:flex">
            <Link to="/" className="items-center">
              <Logo className="fill-white stroke-white hover:fill-emerald-100 hover:scale-110 duration-200 transition"/>
            </Link>
          </div>
          <ul className="flex font-medium">
            <li className="flex items-center" style={ignore.includes('dashboard') ? {display: "none"} : {visibility: 'visible'}}>
              <LinkButton to="/dashboard">Dashboard</LinkButton>
            </li>
            {location.pathname === "/dashboard" ? (
              <li className="w-96">
                <SimpleSearchBar buttonName='Add' />
              </li>
            ) : null}
          </ul>
          <div className="flex items-center">
            <ul className="hidden md:flex mt-4 font-medium space-x-2 space-y-1 space-y-0 mt-0">
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
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded="false"
              onClick={() => setIsMenu(!isMenu)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-9 h-9"
                fill="white"
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
            { isMenu &&
              <div className="flex rounded-bl-lg pl-4 md:hidden flex flex-col fixed mt-48 -ml-14 bg-emerald-500 dark:bg-emerald-700 p-2 w-32">
                <Link to="/" className="text-white font-bold text-xl mb-2">Home</Link>
                {localStorage.getItem("authenticated") !== "true" ? (
                  <>
                    <Link to="/login" className="text-white font-bold text-xl mb-2">Log In</Link>
                    <Link to="/register" className="text-white font-bold text-xl mb-2">Register</Link>
                  </>
                ) : (
                  <>
                    <Link to="/accountpage" className="text-white font-bold text-xl mb-2">{localStorage.getItem("first_name")}</Link>
                    <Link to="/" className="text-white font-bold text-xl mb-2" onClick={() => {
                        localStorage.removeItem("authenticated");
                        localStorage.removeItem("first_name");
                        localStorage.removeItem("user_id");
                        window.location.reload();
                      }}
                    >
                      Sign out
                    </Link>
                  </>
                )}
              </div>
            }
          </div>
        </div>
      </nav>
    </header>
  );
}

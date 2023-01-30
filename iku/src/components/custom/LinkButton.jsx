import React from "react";
import Button from "./Button";
import { Link } from "react-router-dom";

export default function LinkButton(props) {
  return (
    <>
      <Link to={props.to} className="transition ease-in-out hover:scale-110 duration-200 rounded-lg focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-400">
        <Button>
          {props.children}
        </Button>
      </Link>
    </>
  );
}

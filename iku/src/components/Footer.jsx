import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div>
      <div
        id="footer"
        className="bg-emerald-500 dark:bg-emerald-700 text-white flex justify-between py-4 text-sm"
      >
        <div className="ml-6">
          <p className="has-text-white has-text-weight-bold is-size-5 m">
            © 2022 IKU
          </p>
        </div>
        <div className="mr-6 flex gap-2">
          <Link className="has-text-white" to="/aboutUs">
            About Us
          </Link>
        </div>
      </div>
    </div>
  );
}

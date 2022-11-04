import React from "react";
import styles from "./../styles/cssHomepage.module.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div>
      <div id="footer" class="bg-emerald-500 dark:bg-emerald-600 text-white flex justify-between py-4 text-sm">
        <div class="ml-6">
          <p class="has-text-white has-text-weight-bold is-size-5 m">
            © 2022 IKU
          </p>
        </div>
        <div class="mr-6 flex gap-2">
          <Link class="has-text-white" to="/aboutUs">
            About Us
          </Link>
        </div>
      </div>
    </div>
  );
}

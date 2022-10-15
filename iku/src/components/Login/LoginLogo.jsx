import React from "react";

import "../../styles/Login.css";

import Logo from "../../assets/iku_logo_white.png";
import { Link } from "react-router-dom";

const LoginLogo = () => {
  return (
    <>
      <img id="login-logo" src={Logo} alt="Iku logo" />
      <h2 id="login-title">
        Let's find your
        <br />
        transit scores
      </h2>
      <br />
      <Link to="/">
        <button id="login-button">Return to Homepage</button>
      </Link>
    </>
  );
};

export default LoginLogo;

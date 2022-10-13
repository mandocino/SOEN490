import React from "react";

import '../../styles/Login.css';

import Logo from '../../assets/iku_logo_white.png'

const LoginLogo = () => {
    return(
        <>
            <img id='login-logo' src={Logo} alt='Iku logo' />
            <h2 id='login-title'>Let's find your<br />transit scores</h2>
        </>
    );
}

export default LoginLogo
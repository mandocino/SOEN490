<<<<<<< HEAD
import React from "react";

import '../../styles/Login.css';
=======
import './Login.css';
>>>>>>> d9edb8a0b156a83ad237cd4f26b0dd1058c22da8

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
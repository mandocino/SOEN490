import React from "react";

import '../styles/Login.css';

import LoginLogo from '../components/Login/LoginLogo';
import InfoContainer from '../components/Login/InfoContainer';
import SingleGradientBackground from '../components/Login/SingleGradientBackground';
import LoginForm from '../components/Login/LoginForm';

const Register = () => {
    
    const inputs = [
        {
            label: "Username",
            type: "text",
            name: "username",
            ariaLabel: "Username input field",
            value: ""
        },
        {
            label: "Email",
            type: "text",
            name: "email",
            ariaLabel: "Email input field",
            value: ""
        },
        {
            label: "Password",
            type: "password",
            name: "password",
            ariaLabel: "Password input field",
            value: ""
        },
        {
            label: "Confirm Password",
            type: "password",
            name: "cpassword",
            ariaLabel: "Confirm password input field",
            value: ""
        }
    ]

    return(
        <SingleGradientBackground>
            <div className='half-container left'>
                <LoginLogo />
            </div>
            <div className='half-container right'>
                <InfoContainer>
                    <h3 id='login-container-title'>Register</h3>
                    <LoginForm inputs={inputs} type={0} />
                </InfoContainer>
            </div>
        </SingleGradientBackground>
    )
}

export default Register
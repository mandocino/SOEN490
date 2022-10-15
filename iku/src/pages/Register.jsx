import React from 'react';
import { Link } from 'react-router-dom';

import '../styles/Login.css';

import LoginLogo from '../components/Login/LoginLogo';
import SingleGradientBackground from '../components/Login/SingleGradientBackground';
import LoginForm from '../components/Login/LoginForm';
import HomepageLogo from '../assets/homepage_logo.svg';

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
            label: "First Name",
            type: "text",
            name: "first_name",
            ariaLabel: "First name input field",
            value: ""
        },
        {
            label: "Last Name",
            type: "text",
            name: "last_name",
            ariaLabel: "Last name input field",
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
            <Link id='login-return-home' to='/'>
                <img src={HomepageLogo} alt='Homepage' />
            </Link>
            <div className='half-container left'>
                <LoginLogo />
            </div>
            <h2 id='login-title-small'>Let's find your transit scores</h2>
            <div className='half-container right'>
                <div id='login-container'>
                    <h3 id='login-container-title'>Register</h3>
                    <LoginForm inputs={inputs} type={0} />
                </div>
            </div>
        </SingleGradientBackground>
    )
}

export default Register
import '../styles/Login.css';

import React from 'react';
import { Link } from 'react-router-dom';

import LoginLogo from '../components/Login/LoginLogo';
import SingleGradientBackground from '../components/Login/SingleGradientBackground';
import LoginForm from '../components/Login/LoginForm';
import HomepageLogo from '../assets/homepage_logo.svg';

const Login = () => {

    const inputs = [
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
        }
    ]

    return(
        <SingleGradientBackground>
            <Link id='login-return-home' to='/'>
                <img src={HomepageLogo} />
            </Link>
            <div className='half-container left'>
                <LoginLogo />
            </div>
            <h2 id='login-title-small'>Let's find your transit scores</h2>
            <div className='half-container right'>
                <div id='login-container'>
                    <h3 id='login-container-title'>Login</h3>
                    <LoginForm inputs={inputs} type={1} />
                </div>
            </div>
        </SingleGradientBackground>
    )
}

export default Login
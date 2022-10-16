import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import '../../styles/Login.css';

import LoginInput from './LoginInput'

const LoginForm = ({ inputs, type }) => {

    const [inputValue, setInputValues] = useState(inputs);

    const _handleOnChange = (event, count) => {
        let newValue = inputValue.slice();
        newValue[count].value = event.target.value;
        setInputValues(newValue);
    }

    const getButtonType = (type) => {
        return type === 0 ? 'Register' : 'Log in';
    }

    const getRedirectMessage = (type) => {
        return type === 0 ? 'Have an account? Log in' : 'Create an account';
    }

    const getRedirectLink = (type) => {
        return type === 0 ? '/login' : '/register';
    }

    const testInput = async () => {
        switch (type) {
            case 0:
                const checkEmail = await axios.post('http://localhost:5000/login', {
                    email: inputValue[1].value
                }).catch(e => e.message);
                if (checkEmail.data.length > 0) {
                    emailInUse();
                } else if (inputValue[4].value !== inputValue[5].value) {
                    //console.log(inputValue[4] + " " + inputValue[5])
                    passwordNoMatch();
                } else {
                    register();
                }
                break;
            case 1:
                login();
                break;
            default:
        }
    }

    const login = async () => {
        const res = await axios.post('http://localhost:5000/login', {
            email: inputValue[0].value,
            password: inputValue[1].value
        }).catch(e => e.message);
        if(res.data.length > 0) {
            localStorage.setItem('authenticated', 'true');
            localStorage.setItem('first_name', res.data[0].first_name)
            window.location.reload();
        } else {
            incorrectInput();
        }
    }

    const register = async () => {
        await axios.post('http://localhost:5000/signup', {
            email: inputValue[0].value,
            first_name: inputValue[1].value,
            last_name: inputValue[2].value,
            password: inputValue[3].value
        }).catch(e => e.message);
    }

    const onEnterPress = (event) => {
        const key = event.key;
        if (key === 'Enter') {
            testInput();
        }
    }

    const incorrectInput = () => {
        document.getElementById('incorrect-input-message').style.display = 'block';
    }

    const emailInUse = () => {
        document.getElementById('email-in-use').style.display = 'block';
    }

    const passwordNoMatch = () => {
        document.getElementById('password-no-match').style.display = 'block';
    }

    let count = 0;

    return(
        <>
            {
                inputValue.map(({ label, type, name, ariaLabel, value }) => {
                    return (
                        <>
                            <LoginInput
                                label={label}
                                type={type}
                                name={name}
                                ariaLabel={ariaLabel}
                                value={value}
                                handleInputChange={_handleOnChange}
                                count={count++}
                                key={name}
                                onEnterDown={onEnterPress}
                            />
                            {
                                label === 'Email' &&
                                <p id='email-in-use'>Email already in use</p>
                            }
                            {
                                label === 'Confirm Password' &&
                                <p id='password-no-match'>Passwords do not match</p>
                            }
                        </>
                    )
                })
            }
            <p id='incorrect-input-message'>Incorrect login. Please check email and password.</p>
            <div id='button-container'>
                <button id='login-button' onClick={testInput}>{getButtonType(type)}</button>
                <Link id='redirect-link' to={getRedirectLink(type)}>{getRedirectMessage(type)}</Link>
            </div>
        </>
    )
}

export default LoginForm
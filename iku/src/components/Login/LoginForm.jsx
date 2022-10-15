import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import axios from 'axios';

import '../../styles/Login.css';

import LoginInput from './LoginInput'

const LoginForm = ({ inputs, type }) => {

    const [inputValue, setInputValues] = useState(inputs);

    const _handleOnChange = (event, count) => {
        console.log(count);
        let newValue = inputValue.slice();
        newValue[count].value = event.target.value;
        setInputValues(newValue);
    }

    const getButtonType = (type) => {
        return type === 0 ? 'Register' : 'Log in';
    }

    const getRedirectMessage = (type) => {
        return type === 0 ? 'Already have an account? Log in' : 'Create an account';
    }

    const getRedirectLink = (type) => {
        return type === 0 ? '/login' : '/register';
    }

    const testInput = async () => {
        switch (type) {
            case 0:
                // Register information here.
                break;
            case 1:
                // Login information here.
                // To get value of a certain input field use --> inputValue[i].value ||| where i is the 'i'th input field on the webpage.
                //const res = await axios.post(`http://localhost:5000/user`, {username: inputValue[0].value, password: inputValue[1].value})
                break;
            default:

        }
    }

    let count = 0;

    return(
        <form id='login-form'>
            {
                inputValue.map(({ label, type, name, ariaLabel, value }) => {
                    return (
                        <LoginInput
                            label={label}
                            type={type}
                            name={name}
                            ariaLabel={ariaLabel}
                            value={value}
                            handleInputChange={_handleOnChange}
                            count={count++}
                            key={name}
                        />
                    )
                })
            }
            <div id='button-container'>
                <button id='login-button' onClick={testInput}>{getButtonType(type)}</button>
                <Link to={getRedirectLink(type)}>{getRedirectMessage(type)}</Link>
            </div>
        </form>
    )
}

export default LoginForm
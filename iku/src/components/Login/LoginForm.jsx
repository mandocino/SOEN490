import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
        return type === 0 ? 'Log In Instead' : 'Create an account';
    }

    const getRedirectLink = (type) => {
        return type === 0 ? '/login' : '/register';
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
                <button id='login-button'>{getButtonType(type)}</button>
                <Link to={getRedirectLink(type)}>{getRedirectMessage(type)}</Link>
            </div>
        </form>
    )
}

export default LoginForm
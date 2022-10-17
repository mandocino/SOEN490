import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import '../../styles/Login.css';
import QuestionMarkLogo from '../../assets/question_mark.svg';

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
                register();
                break;
            case 1:
                login();
                break;
            default:
        }
    }

    const register = async () => {
        const checkEmail = await axios.post('http://localhost:5000/login', {
                email: inputValue[0].value.toLowerCase()
            }).catch(e => e.message);

        if (checkEmail.data.length > 0) {
            emailInUse(true);
            passwordNoMatch(false);
            passwordPoor(false);
        } else if (inputValue[3].value !== inputValue[4].value) {
            emailInUse(false);
            passwordNoMatch(true);
            passwordPoor(false);
        } else if (!goodPassword(inputValue[3])) {
            emailInUse(false);
            passwordNoMatch(false);
            passwordPoor(true);
        } else {
            //await axios.post('http://localhost:5000/signup', {
            //    email: inputValue[0].value,
            //    first_name: inputValue[1].value,
            //    last_name: inputValue[2].value,
            //    password: inputValue[3].value
            //}).catch(e => e.message);
            console.log('all good');
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

    const onEnterPress = (event) => {
        const key = event.key;
        if (key === 'Enter') {
            testInput();
        }
    }

    const incorrectInput = () => {
        document.getElementById('incorrect-input-message').style.display = 'block';
    }

    const emailInUse = (condition) => {
        condition === true ?
            document.getElementById('email-in-use').style.display = 'block'
            : document.getElementById('email-in-use').style.display = 'none';
    }

    const passwordPoor = (condition) => {
        condition === true ? (
                document.getElementById('password-poor').style.display = 'flex'
            ) : (
                document.getElementById('password-poor').style.display = 'none'
            );
    }

    const passwordNoMatch = (condition) => {
        condition === true ?
            document.getElementById('password-no-match').style.display = 'block'
            : document.getElementById('password-no-match').style.display = 'none';
    }

    const goodPassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)” + “(?=.*[-+_!@#$%^&*., ?]).+$/;
        return regex.test(password);
    }

    const setIncorrectMessage = (label) => {
        let element = <></>;
        switch (label) {
            case 'Email':
                element = <p id='email-in-use' className='error-message' key={label}>Email already in use</p>;
                break;
            case 'Password':
                element = <div id='password-poor' className='error-message' key={label}>
                            <p>Password requirements not met</p>
                            <img
                                id='password-poor-question'
                                src={QuestionMarkLogo}
                                alt={'Question mark'}
                                onMouseEnter={() => {
                                    document.getElementById('password-poor-info').style.display = 'block';
                                }}
                                onMouseLeave={() => {
                                    document.getElementById('password-poor-info').style.display = 'none';
                                }}
                            />
                            <div id='password-poor-info'>
                                <p>
                                    Password must contain:<br />
                                    &nbsp;- 8 characters<br />
                                    &nbsp;- 1 uppercase character<br />
                                    &nbsp;- 1 lowercase character<br />
                                    &nbsp;- 1 number<br />
                                    &nbsp;- 1 symbol<br />
                                </p>
                            </div>
                        </div>;
                break;
            case 'Confirm Password':
                element = <p id='password-no-match' className='error-message' key={label}>Passwords do not match</p>;
                break;
            default:
        }
        return element;
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
                            { setIncorrectMessage(label) }
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
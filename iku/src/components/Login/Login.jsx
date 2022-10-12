import './Login.css';

import { useState } from 'react';
import { Link } from 'react-router-dom'
import LoginLogo from './LoginLogo';
import InfoContainer from './InfoContainer';
import SingleGradientBackground from './SingleGradientBackground'

const Login = () => {

    const [email, setUsername] = useState();
    const [password, setPassword] = useState();



    return(
        <SingleGradientBackground>
            <div class='half-container'>
                <LoginLogo />
            </div>
            <div class='half-container'>
                <InfoContainer>
                    <h3>Login</h3>
                    <form>
                        <input type='text' placeholder='Email' name='email' aria-label='Email input field' required />
                        <input type='password' placeholder='Password' name='email' aria-label='Password input field' required />
                        <div id='button-container'>
                            <button></button>
                            <Link to='/signup'>Create account</Link>
                        </div>
                    </form>
                </InfoContainer>
            </div>
        </SingleGradientBackground>
    )
}

export default Login
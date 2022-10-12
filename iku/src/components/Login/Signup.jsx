import './Login.css';

import LoginLogo from './LoginLogo';
import InfoContainer from './InfoContainer';
import SingleGradientBackground from './SingleGradientBackground'

const Signup = () => {


    return(
        <SingleGradientBackground>
            <div class='half-container'>
                <LoginLogo />
            </div>
            <div class='half-container'>
                <InfoContainer>
                    <h3>Signup</h3>
                </InfoContainer>
            </div>
        </SingleGradientBackground>
    )
}

export default Signup
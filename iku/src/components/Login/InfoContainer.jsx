import React from "react";

import '../../styles/Login.css';

const InfoContainer = (props) => {

    return(
        <div id='login-container'>
            { props.children }
        </div>
    )
}

export default InfoContainer
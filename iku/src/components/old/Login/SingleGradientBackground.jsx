import React from "react";

import '../../styles/Login.css';

const SingleGradientBackground = (props) => {

    return(
        <div id='login-root'>
            { props.children }
        </div>
    )
}

export default SingleGradientBackground
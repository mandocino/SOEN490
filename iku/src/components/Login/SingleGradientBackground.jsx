import React from "react";

import '../../styles/Login.css';

const SingleGradientBackground = (props) => {

    return(
        <div id='login-root' className='bg-gradient-to-br from-emerald-400 to-emerald-600'>
            { props.children }
        </div>
    )
}

export default SingleGradientBackground
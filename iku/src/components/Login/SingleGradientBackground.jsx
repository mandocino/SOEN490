import './Login.css';

const SingleGradientBackground = (props) => {

    return(
        <div id='login-background'>
            { props.children }
        </div>
    )
}

export default SingleGradientBackground
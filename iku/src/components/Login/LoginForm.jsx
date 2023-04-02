import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../../styles/Login.css";
import QuestionMarkLogo from "../../assets/question_mark.svg";

import LoginInput from "./LoginInput";

const LoginForm = ({ inputs, type }) => {
  const [inputValue, setInputValues] = useState(inputs);

  const _handleOnChange = (event, count) => {
    let newValue = inputValue.slice();
    newValue[count].value = event.target.value;
    setInputValues(newValue);
  };

  const getButtonType = (type) => {
    return type === 0 ? "Register" : "Log in";
  };

  const getRedirectMessage = (type) => {
    return type === 0 ? "Have an account? Log in" : "Create an account";
  };

  const getRedirectLink = (type) => {
    return type === 0 ? "/login" : "/register";
  };

  const onEnterPress = (event) => {
    const key = event.key;
    if (key === "Enter") {
      testInput();
    }
  };

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
  };

  const login = async () => {
    const res = await axios
      .post("http://localhost:5000/login", {
        email: inputValue[0].value.toLowerCase(),
        password: inputValue[1].value,
      })
      .catch((e) => e.message);
    if (res.data.length > 0) {
      localStorage.setItem("authenticated", "true");
      localStorage.setItem("user_id", res.data[0]._id);
      localStorage.setItem("first_name", res.data[0].first_name);
      window.location.reload();
    } else {
      incorrectInput();
    }
  };

  const register = async () => {
    inputIsGood().then((inputIsGood) => {
      if (inputIsGood) {
        const currentDate = Date.now();
        axios
          .post("http://localhost:5000/signup", {
            email: inputValue[0].value.toLowerCase(),
            first_name: inputValue[1].value,
            last_name: inputValue[2].value,
            password: inputValue[3].value,
            lastScoringPrefChangeTime: currentDate,
            lastRoutingPrefChangeTime: currentDate
          })
          .catch((e) => e.message);
        document.getElementById("registerMsg").innerHTML = "Account Successfully Registered!";
        document.getElementById("redirectMsg").innerHTML = "Redirecting to Login...";
        setTimeout(() => {
          window.location.href = '/login';
          }, 3000);
      }
    });
  };

  const inputIsGood = async () => {
    return emailIsGood(inputValue[0].value).then((emailIsGood) => {
      console.log(emailIsGood);
      console.log(firstNameIsGood(inputValue[1].value));
      console.log(lastNameIsGood(inputValue[2].value));
      console.log(passwordIsGood(inputValue[3].value, inputValue[4].value));

      return (
        emailIsGood &
        firstNameIsGood(inputValue[1].value) &
        lastNameIsGood(inputValue[2].value) &
        passwordIsGood(inputValue[3].value, inputValue[4].value)
      );
    });
  };

  const emailIsGood = async (email) => {
    if (!email) {
      emptyEmail(true);
      return false;
    }
    emptyEmail(false);

    const checkEmail = await axios
      .get(`http://localhost:5000/userByEmail/${inputValue[0].value.toLowerCase()}`)
      .catch((e) => e.message);

    if (checkEmail.data.length > 0) {
      emailInUse(true);
      passwordsDoNotMatch(false);
      passwordPoor(false);
      return false;
    }
    emailInUse(false);
    return true;
  };

  const firstNameIsGood = (firstName) => {
    if (!firstName) {
      emptyFirstName(true);
      return false;
    }
    emptyFirstName(false);
    return true;
  };

  const lastNameIsGood = (lastName) => {
    if (!lastName) {
      emptyLastName(true);
      return false;
    }
    emptyLastName(false);
    return true;
  };

  const passwordIsGood = (password, cpassword) => {
    if (password !== cpassword) {
      emailInUse(false);
      passwordsDoNotMatch(true);
      passwordPoor(false);
      return false;
    } else if (!isGoodPassword(password)) {
      emailInUse(false);
      passwordsDoNotMatch(false);
      passwordPoor(true);
      return false;
    }
    passwordsDoNotMatch(false);
    passwordPoor(false);
    return true;
  };

  const incorrectInput = () => {
    document.getElementById("incorrect-input-message").style.display = "block";
  };

  const emptyEmail = (condition) => {
    let property = "";
    condition === true ? (property = "block") : (property = "none");
    document.getElementById("empty-email").style.display = property;
  };

  const emptyFirstName = (condition) => {
    let property = "";
    condition === true ? (property = "block") : (property = "none");
    document.getElementById("empty-first-name").style.display = property;
  };

  const emptyLastName = (condition) => {
    let property = "";
    condition === true ? (property = "block") : (property = "none");
    document.getElementById("empty-last-name").style.display = property;
  };

  const emailInUse = (condition) => {
    let property = "";
    condition === true ? (property = "block") : (property = "none");
    document.getElementById("email-in-use").style.display = property;
  };

  const passwordPoor = (condition) => {
    let property = "";
    condition === true ? (property = "flex") : (property = "none");
    document.getElementById("password-poor").style.display = property;
  };

  const passwordsDoNotMatch = (condition) => {
    let property = "";
    condition === true ? (property = "block") : (property = "none");
    document.getElementById("password-no-match").style.display = property;
  };

  const isGoodPassword = (password) => {
    const regex = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/
    );
    return regex.test(password);
  };

  const setIncorrectMessage = (label) => {
    let element = <></>;
    switch (label) {
      case "Email":
        element = (
          <>
            <p id="empty-email" className="error-message">
              Error! Cannot have empty Email.
            </p>
            <p id="email-in-use" className="error-message">
              Error! Email already in use.
            </p>
          </>
        );
        break;
      case "First Name":
        element = (
          <p id="empty-first-name" className="error-message">
            Error! Cannot have empty First Name.
          </p>
        );
        break;
      case "Last Name":
        element = (
          <p id="empty-last-name" className="error-message">
            Error! Cannot have empty Last Name.
          </p>
        );
        break;
      case "Password":
        element = (
          <div id="password-poor" className="error-message">
            <p>Error! Password requirements not met.</p>
            <img
              id="password-poor-question"
              src={QuestionMarkLogo}
              alt={"Question mark"}
              onMouseEnter={() => {
                document.getElementById("password-poor-info").style.display =
                  "block";
              }}
              onMouseLeave={() => {
                document.getElementById("password-poor-info").style.display =
                  "none";
              }}
            />
            <div id="password-poor-info">
              <p>
                Error! Password must contain:
                <br />
                &nbsp;- 8 characters
                <br />
                &nbsp;- 1 uppercase character
                <br />
                &nbsp;- 1 lowercase character
                <br />
                &nbsp;- 1 number
                <br />
                &nbsp;- 1 special character
                <br />
              </p>
            </div>
          </div>
        );
        break;
      case "Confirm Password":
        element = (
          <p id="password-no-match" className="error-message">
            Error! Passwords do not match
          </p>
        );
        break;
      default:
    }
    return element;
  };

  let count = 0;

  return (
    <>
      {inputValue.map(({ label, type, name, ariaLabel, value }) => {
        return (
          <div className='input-container' key={label}>
            <LoginInput
              label={label}
              type={type}
              name={name}
              ariaLabel={ariaLabel}
              value={value}
              handleInputChange={_handleOnChange}
              count={count++}
              onEnterDown={onEnterPress}
            />
            {setIncorrectMessage(label)}
          </div>
        );
      })}
      <p id="incorrect-input-message">
        Incorrect login. Please check email and password.
      </p>
      <div id="button-container">
        <button id="login-button" onClick={testInput}>
          {getButtonType(type)}
        </button>
        <Link id="redirect-link" to={getRedirectLink(type)}>
          {getRedirectMessage(type)}
        </Link>
      </div>
    </>
  );
};

export default LoginForm;

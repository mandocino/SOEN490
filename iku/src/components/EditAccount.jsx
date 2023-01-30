import { React, useEffect, useState } from "react";
import LinkButton from "./custom/LinkButton";
import axios from "axios";
import mongoose from "mongoose";

export default function EditAccount() {
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Email, setEmail] = useState("");
  const [CurrentLocation, setCurrentLocation] = useState("");

  const [NewFirstName, setNewFirstName] = useState("");
  const [NewLastName, setNewLastName] = useState("");
  const [NewEmail, setNewEmail] = useState("");
  const [NewCurrentLocation, setNewCurrentLocation] = useState("");

  const fetchAccountInfo = () => {
    const user_id = localStorage.getItem("user_id");
    axios
      .get(`http://localhost:5000/userByID/${user_id}`)
      .then((response) => {
        setFirstName(response.data[0].first_name);
        setLastName(response.data[0].last_name);
        setEmail(response.data[0].email);
        setCurrentLocation(response.data[0].current_location);
      })
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    fetchAccountInfo();
  }, []);
  useEffect(() => {
    postAccountInfo();
  }, [NewFirstName, NewLastName, NewEmail, NewCurrentLocation]);

  const SubmitHandler = () => {
    let newFirstNameInput = document.getElementById("newFirstName").value;
    let newLastNameInput = document.getElementById("newLastName").value;
    let newEmailInput = document.getElementById("newEmail").value;
    let newLocationInput = document.getElementById("newLocation").value;

    if (newFirstNameInput === "") {
      setNewFirstName(FirstName);
    } else {
      setNewFirstName(newFirstNameInput);
    }

    if (newLastNameInput === "") {
      setNewLastName(LastName);
    } else {
      setNewLastName(newLastNameInput);
    }

    if (newEmailInput === "") {
      setNewEmail(Email);
    } else {
      setNewEmail(newEmailInput);
    }

    if (newLocationInput === "") {
      setNewCurrentLocation(CurrentLocation);
    } else {
      setNewCurrentLocation(newLocationInput);
    }
    postAccountInfo();
  };
  const postAccountInfo = () => {
    if (
      NewEmail !== "" ||
      NewFirstName !== "" ||
      NewLastName !== "" ||
      NewCurrentLocation !== ""
    ) {
      axios
        .post("http://localhost:5000/modifyUserById", {
          _id: mongoose.Types.ObjectId(localStorage.getItem("user_id")),
          email: NewEmail,
          first_name: NewFirstName,
          last_name: NewLastName,
          current_location: NewCurrentLocation,
        })
        .catch((error) => {
          console.log(error.message);
        });
      window.location.reload(false);
    }
  };
  return (
    <form>
      <div className="bg-emerald-500 mx-auto text-center rounded-3xl text-white max-w-xl mt-20">
        <div>
          <p className="pt-7 pb-7 text-2xl">My Account Information Edit</p>
          <p className="pb-4">First Name: {FirstName} </p>
          <input
            className="block p-3 mb-5 text-center w-half mx-auto text-md font-semibold text-white placeholder-white bg-emerald-500 rounded-lg border-2 border-emerald-200 dark:border-emerald-300 accent-white focus:border-white dark:bg-emerald-700 dark:placeholder-emerald-100"
            placeholder="Enter new First Name"
            id="newFirstName"
          />
          <p className="pb-4">Last Name: {LastName} </p>
          <input
            className="block p-3 mb-5 text-center w-half mx-auto text-md font-semibold text-white placeholder-white bg-emerald-500 rounded-lg border-2 border-emerald-200 dark:border-emerald-300 accent-white focus:border-white dark:bg-emerald-700 dark:placeholder-emerald-100"
            placeholder="Enter new Last Name"
            id="newLastName"
          />
          <p className="pb-4">Email: {Email} </p>
          <input
            className="block p-3 mb-5 text-center w-half mx-auto text-md font-semibold text-white placeholder-white bg-emerald-500 rounded-lg border-2 border-emerald-200 dark:border-emerald-300 accent-white focus:border-white dark:bg-emerald-700 dark:placeholder-emerald-100"
            placeholder="Enter new Email"
            id="newEmail"
          />
          <p className="pb-4">Location: {CurrentLocation}</p>
          <input
            className="block p-3 mb-5 text-center w-half mx-auto text-md font-semibold text-white placeholder-white bg-emerald-500 rounded-lg border-2 border-emerald-200 dark:border-emerald-300 accent-white focus:border-white dark:bg-emerald-700 dark:placeholder-emerald-100"
            placeholder="Enter new Location"
            id="newLocation"
          />
          <button
            type="button"
            onClick={SubmitHandler}
            className="border-2 border-white mb-10 rounded	p-2"
          >
            Submit
          </button>
          <div className="w-60 mx-auto pb-10">
            <LinkButton className="mb-10" to="/accountpage">
              Return to Account
            </LinkButton>
          </div>
        </div>
      </div>
    </form>
  );
}

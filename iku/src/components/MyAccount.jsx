import { React, useEffect, useState } from "react";
import LinkButton from "./custom/LinkButton";
import defaultPhoto from "./../assets/default_user.jpg";
import axios from "axios";

export default function MyAccount() {
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Email, setEmail] = useState("");
  const [CurrentHome, setCurrentHome] = useState("");
  const fetchAccountInfo = () => {
    const user_id = localStorage.getItem("user_id");
    axios
      .get(`http://localhost:5000/userByID/${user_id}`)
      .then((response) => {
        setFirstName(response.data[0].first_name);
        setLastName(response.data[0].last_name);
        setEmail(response.data[0].email);
        setCurrentHome(response.data[0].current_location);
      })
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    fetchAccountInfo();
  }, []);
  return (
    <>
      <div class="bg-emerald-500 mx-auto text-center rounded-3xl text-white max-w-xl mt-20">
        <div>
          <p class="pt-7 pb-7 text-2xl">My Account</p>
          <img
            class="w-20 rounded-lg mx-auto pb-7"
            src={defaultPhoto}
            alt="default_user.jpg"
          />
          <p class="pb-4">First Name: {FirstName} </p>
          <p class="pb-4">Last Name: {LastName} </p>
          <p class="pb-4">Email: {Email}</p>
          <p class="pb-4">Location: {CurrentHome}</p>
          <div class="w-60 mx-auto pb-10">
            <LinkButton to="/editinfo">Edit Account Information</LinkButton>
            <LinkButton to="/editpassword">Change Password</LinkButton>
          </div>
        </div>
      </div>
    </>
  );
}

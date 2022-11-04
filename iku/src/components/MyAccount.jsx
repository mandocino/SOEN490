import React from "react";
import tempUserImg from "./../assets/default_user.jpg";
import styles from "./../styles/cssAccount.module.css";
import LinkButton from "./custom/LinkButton";

export default function MyAccount() {
  return (
    <>
      <div class="bg-emerald-500 mx-auto text-center rounded-3xl text-white max-w-xl mt-20">
        <div>
          <p class="pt-7 pb-7 text-2xl">My Account</p>
          <img
            class="w-20 rounded-lg mx-auto pb-7"
            src={tempUserImg}
            alt="tempUserImg"
          ></img>{" "}
          <p class="pb-4">Username: </p>
          <p class="pb-4">Email: </p>
          <p class="pb-4">Location:</p>
          <div class="w-60 mx-auto pb-10">
            <LinkButton class="mb-10" to="/dashboard">
              Change Profile Picture
            </LinkButton>
            <LinkButton to="/dashboard">Edit Account Information</LinkButton>
          </div>
        </div>
      </div>
    </>
  );
}

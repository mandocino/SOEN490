import { React, useEffect, useState } from "react";
import LinkButton from "./custom/LinkButton";
import axios from "axios";
import mongoose from "mongoose";

export default function EditAccount() {
  const [oldPassword, setOldPassword] = useState("");
  const [oldPasswordInput, setoldPasswordInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reEnterNewPassword, setreEnterNewPassword] = useState("");
  var boolOldPassInput = false;
  var boolPasswordsMatch = false;

  const fetchAccountInfo = () => {
    const user_id = localStorage.getItem("user_id");
    axios
      .get(`http://iku.ddns.net:5000/userByID/${user_id}`)
      .then((response) => {
        setOldPassword(response.data[0].password);
      })
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    fetchAccountInfo();
  }, []);
  useEffect(() => {
    postPasswordInfo();
  }, [oldPassword,oldPasswordInput, newPassword, reEnterNewPassword]);

  const SubmitHandler = async (event) => {
    let oldPassInput = document.getElementById("oldPassword").value;
    let newPasswordInput = document.getElementById("newPassword").value;
    let reenterNewPasswordInput = document.getElementById("reenterNewPassword").value;

    if (oldPassInput !== "") {
      setoldPasswordInput(oldPassInput);
    }
    if (reenterNewPasswordInput !== "") {
      setreEnterNewPassword(reenterNewPasswordInput);
    }
    if (newPasswordInput !== "") {
      setNewPassword(newPasswordInput);
    }
    postPasswordInfo();

  };
  const postPasswordInfo = async (event) => {

    if (oldPasswordInput === oldPassword) {
      boolOldPassInput = true;
    }
    if (newPassword === reEnterNewPassword) {
      boolPasswordsMatch = true;
    }

    if (boolOldPassInput && boolPasswordsMatch && oldPasswordInput!="") {

      await axios
        .post("http://iku.ddns.net:5000/modifyUserById", {
        _id: mongoose.Types.ObjectId(localStorage.getItem("user_id")),
        password: newPassword,
        })
        .catch((error) => {
          console.log(error.message);
        });
      window.location.reload(true);
      document.getElementById("passwordChangeMsg").innerHTML = "Password Successfully Changed!";
    }
    else {
      console.log("Error in fields.");
    }
  };
  return (
    <form>
      <div className="bg-emerald-500 mx-auto text-center rounded-3xl text-white max-w-xl mt-20">
        <div>
          <p className="pt-7 pb-5 text-2xl">My Account Password Edit</p>
          <p id="passwordChangeMsg" className="pb-5 text-lg">Password Successfully Changed!</p>
          <input
            className="block p-3 mb-5 text-center w-half mx-auto text-md font-semibold text-white placeholder-white bg-emerald-500 rounded-lg border-2 border-emerald-200 dark:border-emerald-300 accent-white focus:border-white dark:bg-emerald-700 dark:placeholder-emerald-100"
            placeholder="Old Password"
            id="oldPassword"
          />
          <input
            className="block p-3 mb-5 text-center w-half mx-auto text-md font-semibold text-white placeholder-white bg-emerald-500 rounded-lg border-2 border-emerald-200 dark:border-emerald-300 accent-white focus:border-white dark:bg-emerald-700 dark:placeholder-emerald-100"
            placeholder="New Password"
            id="newPassword"
          />
          <input
            className="block p-3 mb-5 text-center w-half mx-auto text-md font-semibold text-white placeholder-white bg-emerald-500 rounded-lg border-2 border-emerald-200 dark:border-emerald-300 accent-white focus:border-white dark:bg-emerald-700 dark:placeholder-emerald-100"
            placeholder="Re-Enter New Password"
            id="reenterNewPassword"
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

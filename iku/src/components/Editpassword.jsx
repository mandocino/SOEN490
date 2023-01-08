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
      .get(`http://localhost:5000/userByID/${user_id}`)
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
    console.log(oldPassword);
    console.log(oldPasswordInput);
    console.log(newPassword);
    console.log(reEnterNewPassword);
    console.log(boolOldPassInput);
    console.log(boolPasswordsMatch);
    console.log();
    console.log();
    console.log();


    if (boolOldPassInput && boolPasswordsMatch) {

      await axios
        .post("http://localhost:5000/modifyUserById", {
        _id: mongoose.Types.ObjectId(localStorage.getItem("user_id")),
        password: newPassword,
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
    else {
      console.log("Error in fields.");
    }
  };
  return (
    <form>
      <div class="bg-emerald-500 mx-auto text-center rounded-3xl text-white max-w-xl mt-20">
        <div>
          <p class="pt-7 pb-7 text-2xl">My Account Password Edit</p>
          <input
            class="block p-3 mb-5 text-center w-half mx-auto text-md font-semibold text-white placeholder-white bg-emerald-500 rounded-lg border-2 border-emerald-200 dark:border-emerald-300 accent-white focus:border-white dark:bg-emerald-700 dark:placeholder-emerald-100"
            placeholder="Old Password"
            id="oldPassword"
          />
          <input
            class="block p-3 mb-5 text-center w-half mx-auto text-md font-semibold text-white placeholder-white bg-emerald-500 rounded-lg border-2 border-emerald-200 dark:border-emerald-300 accent-white focus:border-white dark:bg-emerald-700 dark:placeholder-emerald-100"
            placeholder="New Password"
            id="newPassword"
          />
          <input
            class="block p-3 mb-5 text-center w-half mx-auto text-md font-semibold text-white placeholder-white bg-emerald-500 rounded-lg border-2 border-emerald-200 dark:border-emerald-300 accent-white focus:border-white dark:bg-emerald-700 dark:placeholder-emerald-100"
            placeholder="Re-Enter New Password"
            id="reenterNewPassword"
          />
          
          <button
            type="button"
            onClick={SubmitHandler}
            class="border-2 border-white mb-10 rounded	p-2"
          >
            Submit
          </button>
          <div class="w-60 mx-auto pb-10">
            <LinkButton class="mb-10" to="/accountpage">
              Return to Account
            </LinkButton>
          </div>
        </div>
      </div>
    </form>
  );
}

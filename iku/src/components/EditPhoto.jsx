import React from "react";
import tempUserImg from "./../assets/default_user.jpg";
import LinkButton from "./custom/LinkButton";

export default function EditPhoto() {
  return (
    <>
      <div class="bg-emerald-500 mx-auto text-center rounded-3xl text-white max-w-xl mt-20">
        <div>
          <p class="pt-7 pb-7 text-2xl">My Account Edit</p>
          <img
            class="w-20 rounded-lg mx-auto pb-7"
            src={tempUserImg}
            alt="tempUserImg"
          ></img>{" "}
          <input class="ml-24 mb-5" type="file" id="myFile" name="filename" />
          <br></br>
          <input class="border-2 border-white mb-10 rounded	p-2" type="submit" />
          <div class="w-60 mx-auto pb-10">
            <LinkButton class="mb-10" to="/accountpage">
              Return to Account
            </LinkButton>
            <LinkButton to="/editinfo">Edit Account Information</LinkButton>
          </div>
        </div>
      </div>
    </>
  );
}

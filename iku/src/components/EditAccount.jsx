import React from "react";
import tempUserImg from "./../assets/default_user.jpg";
import LinkButton from "./custom/LinkButton";

export default function EditAccount() {
  return (
    <form>
      <div class="bg-emerald-500 mx-auto text-center rounded-3xl text-white max-w-xl mt-20">
        <div>
          <p class="pt-7 pb-7 text-2xl">My Account Edit</p>
          <p class="pb-4">Username: </p>
          <input
            class="block p-3 mb-5 text-center w-half mx-auto text-md font-semibold text-white placeholder-white bg-emerald-500 rounded-lg border-2 border-emerald-200 dark:border-emerald-300 accent-white focus:border-white dark:bg-emerald-700 dark:placeholder-emerald-100"
            placeholder="Enter new Username"
          />
          <p class="pb-4">Email: </p>
          <input
            class="block p-3 mb-5 text-center w-half mx-auto text-md font-semibold text-white placeholder-white bg-emerald-500 rounded-lg border-2 border-emerald-200 dark:border-emerald-300 accent-white focus:border-white dark:bg-emerald-700 dark:placeholder-emerald-100"
            placeholder="Enter new Email"
          />
          <p class="pb-4">Location:</p>
          <input
            class="block p-3 mb-5 text-center w-half mx-auto text-md font-semibold text-white placeholder-white bg-emerald-500 rounded-lg border-2 border-emerald-200 dark:border-emerald-300 accent-white focus:border-white dark:bg-emerald-700 dark:placeholder-emerald-100"
            placeholder="Enter new Location"
          />
          <input class="border-2 border-white mb-10 rounded	p-2" type="submit" />

          <div class="w-60 mx-auto pb-10">
            <LinkButton class="mb-10" to="/editphoto">
              Change Profile Picture
            </LinkButton>
            <LinkButton class="mb-10" to="/accountpage">
              Return to Account
            </LinkButton>
          </div>
        </div>
      </div>
    </form>
  );
}

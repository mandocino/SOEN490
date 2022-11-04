import React from "react";

export default function Button(props) {
  return (
    <>
      <div class="transition ease-in-out font-semibold rounded-lg text-md px-4 py-2 border-2 focus:border-0 focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-400 text-white dark:text-emerald-100 hover:text-emerald-500 hover:bg-white border-emerald-200 dark:border-emerald-300">
        {props.children}
      </div>
    </>
  );
}

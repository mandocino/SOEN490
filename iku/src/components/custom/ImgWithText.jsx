import React from "react";

export default function ImgWithText(props) {
  let padding;
  
  if (props.innerpadding == null) {
    padding = "p-2 xs:p-4 sm:p-8";
  } else {
    padding = props.innerpadding;
  }
  
  return (
    <>
      <div className="w-full h-full flex flex-col items-center">
        <div className={"w-full shadow-lg shadow-gray-400 dark:shadow-gray-900 rounded-3xl bg-cover bg-center bg-[url(\'" + props.url + "\')]"}>
          <div className={"rounded-3xl " + padding + " w-full backdrop-blur backdrop-brightness-50 flex items-center justify-center"}>
            <p className="text-center text-5xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-emerald-500">
              {props.children}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

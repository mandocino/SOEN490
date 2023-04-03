import React from "react";


export function CloseButton({onClick, right=0, top=0}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        right: right,
        top: top
      }}
      className="absolute right-0 top-0 m-2.5 z-10 w-8 h-8 flex items-center gap-2 justify-center transition ease-in-out duration-200 text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-lg"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
           stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    </button>
  )
}
import React from "react";

export default function Guide() {
  return (
    <>
      <div className="shadow-lg shadow-gray-400 dark:shadow-gray-900 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-700 dark:to-emerald-900 rounded-3xl text-white flex items-center justify-center p-4 w-full">
        <div className="flex flex-col items-center gap-2 w-full md:w-auto">
          <div className="pb-2 text-left text-4xl font-bold w-full">
            It's pretty straightforward!
          </div>

          <div className="flex items-center justify-center flex-col md:flex-row">
            <div className="w-48 h-48 rounded-full flex items-center justify-center bg-none border-4 border-white">
              <div className="p-4 text-center flex flex-col gap-2 text-white">
                <span className="text-xl font-bold">
                  1.
                </span>
                <span className="font-semibold">
                  Enter an origin address
                </span>
                <span className="text-xs">
                  This could be your home or your potential home, for example!
                </span>
              </div>
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="text-white hidden md:block bi bi-chevron-right" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="text-white md:hidden bi bi-chevron-down" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>

            <div className="w-48 h-48 rounded-full flex items-center justify-center bg-none border-4 border-white">
              <div className="p-4 text-center flex flex-col gap-2 text-white">
                <span className="text-xl font-bold">
                  2.
                </span>
                <span className="font-semibold">
                  Enter a destination address
                </span>
                <span className="text-xs">
                  This could be your work, school, or simply downtown.
                </span>
              </div>
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="text-white hidden md:block bi bi-chevron-right" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="text-white md:hidden bi bi-chevron-down" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>

            <div className="w-48 h-48 rounded-full flex items-center justify-center bg-none border-4 border-white">
              <div className="p-4 text-center flex flex-col gap-2 text-white">
                <span className="text-xl font-bold">
                  3.
                </span>
                <span className="font-semibold">
                  Generate a transit score
                </span>
                <span className="text-xs">
                  Use this generated score to compare addresses, like potential homes!
                </span>
              </div>
            </div>
          </div>
          <div className="pb-2 h-auto text-right text-4xl font-bold w-full">
            Simple, right?
          </div>
        </div>
      </div>
    </>
  );
}

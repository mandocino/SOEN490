import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ReactComponent as RightArrowIcon } from "./../assets/arrow-right.svg";
import CircleWithText from "./custom/CircleWithText";
import axios from "axios";

function ScoreDetailModal({ originLocation }) {
  
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    fetchOverallSavedScore();
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const [savedScores, setSavedScores] = useState({});

  const defaultSavedScores = {
    "overall": 0,
    "rushHour": 0,
    "offPeak": 0,
    "weekend": 0,
    "overnight": 0
  };

  const fetchOverallSavedScore = () => {
    axios
      .get(`http://localhost:5000/savedScores/${originLocation._id}`)
      .then((response) => {
        if(response.data[0]){
          setSavedScores(response.data[0]);
        }
        else{
          setSavedScores(defaultSavedScores);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <button
        onClick={openModal}
        type="button"
        class="w-8 h-8 flex items-center justify-center transition ease-in-out font-semibold rounded-lg text-md bg-emerald-200 focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-400 text-emerald-600 dark:text-emerald-800 hover:bg-white"
        on
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0  bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {/* Contents of the modal */}
              <Dialog.Panel className="inline-block w-full max-w-6xl  p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-emerald-50 shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-3xl py-2.5 font-medium leading-6 text-emerald-500 pl-5 "
                >
                  <div>Details</div>
                  <div className="float-right absolute right-4 top-4 ">
                    <button type="button" onClick={closeModal}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="35"
                        height="35"
                        fill="currentColor"
                        viewBox="0 0 512 512"
                      >
                        {" "}
                        <title>ionicons-v5-m</title>{" "}
                        <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-2xl pt-7 font-normal">
                    <div className="pr-3 inline">{originLocation.name}</div>
                    <RightArrowIcon className="inline"></RightArrowIcon>
                  </div>
                </Dialog.Title>

                {/* Table contents */}
                <div class="w-full bg-emerald-400 rounded-3xl p-4 flex mt-2">
                  <table class="table-auto border-separate border-spacing-3">
                    <thead>
                      <tr>
                        <th>
                          <span class="bg-emerald-900 font-semibold text-lg text-white rounded-2xl px-4 py-2 flex gap-2 justify-start items-center invisible">
                            <p>Placeholder</p>
                          </span>
                        </th>
                        <th>
                          <div class="bg-emerald-900 font-semibold text-lg text-white rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                            <table className="text-center table-auto border-separate border-spacing-1">
                              <tbody>
                                <tr>
                                  <td colSpan={3} className="border-b">
                                    Frequency
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-r px-2">Min</td>
                                  <td className="border-r px-2">Avg</td>
                                  <td className="px-2">Max</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </th>
                        <th>
                          <div class="bg-emerald-900 font-semibold text-lg text-white rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                            <table className="text-center table-auto border-separate border-spacing-1">
                              <tbody>
                                <tr>
                                  <td colSpan={3} className="border-b">
                                    Duration
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-r px-2">Min</td>
                                  <td className="border-r px-2">Avg</td>
                                  <td className="px-2">Max</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </th>
                        <th>
                          <div class="bg-emerald-900 font-semibold text-lg text-white rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                            <table className="text-center table-auto border-separate border-spacing-1">
                              <tbody>
                                <tr>
                                  <td colSpan={3} className="border-b">
                                    Walk
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-r px-2">Min</td>
                                  <td className="border-r px-2">Avg</td>
                                  <td className="px-2">Max</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </th>
                        <th>
                          <div class="bg-emerald-900 font-semibold text-lg text-white rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                            <table className="text-center table-auto border-separate border-spacing-1">
                              <tbody>
                                <tr>
                                  <td colSpan={3} className="border-b">
                                    Transfers
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-r px-2">Min</td>
                                  <td className="border-r px-2">Avg</td>
                                  <td className="px-2">Max</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div class="bg-emerald-900 font-semibold text-lg text-white rounded-2xl px-4 py-2 h-14 flex gap-2 justify-start items-center">
                            <span>Overall</span>
                          </div>
                        </td>
                        <td>
                          <div class="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                            <table className="text-center table-fixed border-separate border-spacing-1">
                              <tbody>
                                <tr>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    20
                                  </td>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    25
                                  </td>
                                  <td className="px-3 w-12">30</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                        <td>
                          <div class="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                            <table className="text-center table-fixed border-separate border-spacing-1">
                              <tbody>
                                <tr>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    20
                                  </td>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    25
                                  </td>
                                  <td className="px-3 w-12">30</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                        <td>
                          <div class="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                            <table className="text-center table-fixed border-separate border-spacing-1">
                              <tbody>
                                <tr>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    20
                                  </td>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    25
                                  </td>
                                  <td className="px-3 w-12">30</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                        <td>
                          <div class="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                            <table className="text-center table-fixed border-separate border-spacing-1">
                              <tbody>
                                <tr>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    20
                                  </td>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    25
                                  </td>
                                  <td className="px-3 w-12">30</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                        <td>
                          <CircleWithText
                            class="pl-1"
                            size="w-14 h-14"
                            textClass="text-lg font-bold"
                            bgColor="bg-white dark:bg-teal-900"
                            gradient="bg-gradient-to-br from-green-300 to-green-500 dark:from-white dark:to-green-400"
                          >
                            {savedScores.overall}
                          </CircleWithText>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="bg-emerald-900 font-semibold text-lg text-white rounded-2xl px-4 py-2 h-14  flex gap-2 justify-start items-center">
                            <span>Rush-Hour</span>
                          </div>
                        </td>
                        <td>
                          <div class="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                            <table className="text-center table-fixed border-separate border-spacing-1">
                              <tbody>
                                <tr>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    20
                                  </td>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    25
                                  </td>
                                  <td className="px-3 w-12">30</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                        <td>
                          <div class="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                            <table className="text-center table-fixed border-separate border-spacing-1">
                              <tbody>
                                <tr>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    20
                                  </td>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    25
                                  </td>
                                  <td className="px-3 w-12">30</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                        <td>
                          <div class="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                            <table className="text-center table-fixed border-separate border-spacing-1 ">
                              <tbody>
                                <tr>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    20
                                  </td>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    25
                                  </td>
                                  <td className="px-3 w-12">30</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                        <td>
                          <div class="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                            <table className="text-center table-fixed border-separate border-spacing-1">
                              <tbody>
                                <tr>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    20
                                  </td>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    25
                                  </td>
                                  <td className="px-3 w-12">30</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                        <td>
                          <CircleWithText
                            class="pl-1"
                            size="w-14 h-14"
                            textClass="text-lg font-bold"
                            bgColor="bg-white dark:bg-teal-900"
                            gradient="bg-gradient-to-br from-green-300 to-green-500 dark:from-white dark:to-green-400"
                          >
                            {savedScores.rushHour}
                          </CircleWithText>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="bg-emerald-900 font-semibold text-lg text-white rounded-2xl px-4 py-2 h-14  flex gap-2 justify-start items-center">
                            <span>Off-Peak</span>
                          </div>
                        </td>
                        <td>
                          <div class="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                            <table className="text-center table-fixed border-separate border-spacing-1">
                              <tbody>
                                <tr>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    20
                                  </td>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    25
                                  </td>
                                  <td className="px-3 w-12">30</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                        <td>
                          <div class="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                            <table className="text-center table-fixed border-separate border-spacing-1">
                              <tbody>
                                <tr>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    20
                                  </td>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    25
                                  </td>
                                  <td className="px-3 w-12">30</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                        <td>
                          <div class="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                            <table className="text-center table-fixed border-separate border-spacing-1">
                              <tbody>
                                <tr>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    20
                                  </td>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    25
                                  </td>
                                  <td className="px-3 w-12">30</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                        <td>
                          <div class="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                            <table className="text-center table-fixed border-separate border-spacing-1">
                              <tbody>
                                <tr>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    20
                                  </td>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    25
                                  </td>
                                  <td className="px-3 w-12">30</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                        <td>
                          <CircleWithText
                            class="pl-1"
                            size="w-14 h-14"
                            textClass="text-lg font-bold"
                            bgColor="bg-white dark:bg-teal-900"
                            gradient="bg-gradient-to-br from-yellow-300 to-yellow-500 dark:from-white dark:to-yellow-400"
                          >
                            {savedScores.offPeak}
                          </CircleWithText>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="bg-emerald-900 font-semibold text-lg text-white rounded-2xl px-4 py-2 h-14 flex gap-2 justify-start items-center">
                            <span>Weekend</span>
                          </div>
                        </td>
                        <td>
                          <div class="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                            <table className="text-center table-fixed border-separate border-spacing-1">
                              <tbody>
                                <tr>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    20
                                  </td>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    25
                                  </td>
                                  <td className="px-3 w-12">30</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                        <td>
                          <div class="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                            <table className="text-center table-fixed border-separate border-spacing-1">
                              <tbody>
                                <tr>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    20
                                  </td>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    25
                                  </td>
                                  <td className="px-3 w-12">30</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                        <td>
                          <div class="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                            <table className="text-center table-fixed border-separate border-spacing-1">
                              <tbody>
                                <tr>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    20
                                  </td>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    25
                                  </td>
                                  <td className="px-3 w-12">30</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                        <td>
                          <div class="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                            <table className="text-center table-fixed border-separate border-spacing-1">
                              <tbody>
                                <tr>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    20
                                  </td>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    25
                                  </td>
                                  <td className="px-3 w-12">30</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                        <td>
                          <CircleWithText
                            class="pl-1"
                            size="w-14 h-14"
                            textClass="text-lg font-bold"
                            bgColor="bg-white dark:bg-teal-900"
                            gradient="bg-gradient-to-br from-orange-300 to-orange-500 dark:from-white dark:to-orange-400"
                          >
                            {savedScores.weekend}
                          </CircleWithText>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="bg-emerald-900 font-semibold text-lg text-white rounded-2xl px-4 py-2 h-14 flex gap-2 justify-start items-center">
                            <span>Overnight</span>
                          </div>
                        </td>
                        <td>
                          <div class="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                            <table className="text-center table-fixed border-separate border-spacing-1">
                              <tbody>
                                <tr>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    20
                                  </td>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    25
                                  </td>
                                  <td className="px-3 w-12">30</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                        <td>
                          <div class="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                            <table className="text-center table-fixed border-separate border-spacing-1">
                              <tbody>
                                <tr>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    20
                                  </td>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    25
                                  </td>
                                  <td className="px-3 w-12">30</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                        <td>
                          <div class="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                            <table className="text-center table-fixed border-separate border-spacing-1">
                              <tbody>
                                <tr>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    20
                                  </td>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    25
                                  </td>
                                  <td className="px-3 w-12">30</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                        <td>
                          <div class="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                            <table className="text-center table-fixed border-separate border-spacing-1">
                              <tbody>
                                <tr>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    20
                                  </td>
                                  <td className="border-r border-emerald-900/30 px-3 w-12">
                                    25
                                  </td>
                                  <td className="px-3 w-12">30</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                        <td>
                          <CircleWithText
                            class="pl-1"
                            size="w-14 h-14"
                            textClass="text-lg font-bold"
                            bgColor="bg-white dark:bg-teal-900"
                            gradient="bg-gradient-to-br from-red-300 to-red-500 dark:from-white dark:to-red-400"
                          >
                            {savedScores.overnight}
                          </CircleWithText>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default ScoreDetailModal;

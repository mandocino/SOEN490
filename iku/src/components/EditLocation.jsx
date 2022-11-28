import React from "react";
import { Switch, Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import axios from "axios";
import mongoose from "mongoose";

export default function EditLocation(props) {
  let loc = props.loc
  let [isOpen, setIsOpen] = useState(false);

  const [Name, setName] = useState(loc.name);
  const [Notes, setNotes] = useState(loc.notes);
  const [Priority, setPriority] = useState(loc.priority);
  const [CurrentHome, setCurrentHome] = useState(loc.current_home);

  const handleNameChange = (event) => {
    setName(event.target.value);
  }

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  }

  const handlePriorityChange = event => {
    const regex = /\D/g;
    const result = event.target.value.replace(regex, '');
    console.log(result);

    setPriority(result);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    // Reset all other homes to false if current location changed
    if (CurrentHome !== loc.current_home) {
      const user_id = localStorage.getItem("user_id");
      let locations;

      await axios.get(`http://localhost:5000/locations/${user_id}`)
      .then((response) => {
        locations = response.data;
        locations = locations.filter(l => l._id !== loc._id && l.current_home);
      })
      .catch(err => console.error(err));

      for (let l in locations) {
        let oldHome = locations[l];
        await axios
        .post("http://localhost:5000/updateLocation", {
          _id: mongoose.Types.ObjectId(oldHome._id),
          current_home: false,
        })
        .catch((error) => {
          console.log(error.message);
        });
      }
    }
    
    if (
      Name !== "" ||
      Notes !== "" ||
      Priority !== ""
    ) {
      await axios
        .post("http://localhost:5000/updateLocation", {
          _id: mongoose.Types.ObjectId(loc._id),
          name: Name,
          notes: Notes,
          priority: parseInt(Priority),
          current_home: CurrentHome,
        })
        .catch((error) => {
          console.log(error.message);
        });
      window.location.reload(false);
    }
  };

  function closeModal() {
    // Close modal without saving changes
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
      <button 
        type="button" 
        onClick={openModal}
        class={props.buttonClass}
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" class="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div class="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    class="text-lg font-medium leading-6 text-emerald-900"
                  >
                    Edit location
                  </Dialog.Title>
                  <div class="mt-2">
                    <form>
                      <div class="flex flex-col gap-4">
                        <div class="flex px-4 py-2 bg-emerald-100 rounded-xl">
                          <div class="flex items-center h-8 gap-4">
                            <span class="w-16 h-full flex items-center justify-start">
                              Name
                            </span>
                            <input
                              class="px-2 h-full text-md font-semibold text-white placeholder-white bg-emerald-500 rounded-lg border-2 border-emerald-200 dark:border-emerald-300 accent-white focus:border-white dark:bg-emerald-700 dark:placeholder-emerald-100"
                              placeholder="Enter new First Name"
                              onChange={handleNameChange}
                              defaultValue={Name}
                              id="newName"
                            />
                          </div>
                        </div>
                        
                        <div class="flex px-4 py-2 bg-emerald-100 rounded-xl">
                          <div class="flex items-center h-8 gap-4">
                            <span class="w-16 h-full flex items-center justify-start">
                              Notes
                            </span>
                            <input
                              class="px-2 h-full text-md font-semibold text-white placeholder-white bg-emerald-500 rounded-lg border-2 border-emerald-200 dark:border-emerald-300 accent-white focus:border-white dark:bg-emerald-700 dark:placeholder-emerald-100"
                              placeholder="Enter new First Name"
                              onChange={handleNotesChange}
                              defaultValue={Notes}
                              id="newNotes"
                            />
                          </div>
                        </div>

                        {loc.origin ?
                          <>
                            <div class="flex px-4 py-2 bg-emerald-100 rounded-xl">
                              <div class="flex items-center h-8 gap-4">
                                <span class="w-16 h-full flex items-center justify-start">
                                  Priority
                                </span>
                                <input
                                  class="px-2 h-full text-md font-semibold text-white placeholder-white bg-emerald-500 rounded-lg border-2 border-emerald-200 dark:border-emerald-300 accent-white focus:border-white dark:bg-emerald-700 dark:placeholder-emerald-100"
                                  placeholder="Enter new First Name"
                                  value={Priority}
                                  onChange={handlePriorityChange}
                                  id="newPriority"
                                />
                              </div>
                            </div>

                            <div class="flex px-4 py-2 bg-emerald-100 rounded-xl">
                              <div class="flex items-center h-8 gap-4">
                                <span class="w-16 h-full flex items-center justify-start">
                                  Current Home
                                </span>
                                <Switch
                                  checked={CurrentHome}
                                  onChange={setCurrentHome}
                                  className={`${CurrentHome ? 'bg-emerald-600' : 'bg-teal-900'}
                                    relative inline-flex h-[26px] w-[50px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                                >
                                  <span className="sr-only">Use setting</span>
                                  <span
                                    aria-hidden="true"
                                    className={`${CurrentHome ? 'translate-x-6' : 'translate-x-0'}
                                      pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                                  />
                                </Switch>
                              </div>
                            </div>
                          </>
                          :
                          <></>
                        }
                      </div>
                    </form>
                  </div>

                  <div class="mt-4 flex gap-2">
                    <button 
                      type="button"
                      onClick={submitHandler}
                      class="px-4 py-2 flex items-center gap-2 justify-center transition ease-in-out duration-200 text-white bg-emerald-500 hover:bg-emerald-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-semibold rounded-lg dark:bg-emerald-400 dark:hover:bg-emerald-600 dark:focus:ring-green-300"
                      >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Save
                    </button>
                    <button 
                      type="button"
                      onClick={closeModal}
                      class="px-4 py-2 flex items-center gap-2 justify-center transition ease-in-out duration-200 text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-lg dark:bg-red-400 dark:hover:bg-red-600 dark:focus:ring-red-300"
                      >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

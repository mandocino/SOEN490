import {React, Fragment, useState} from "react";
import { Switch, Dialog, Transition } from '@headlessui/react'
import axios from "axios";
import mongoose from "mongoose";

export default function EditLocation({loc, buttonClass, notext=false}) {

  const user_id = localStorage.getItem("user_id");
  const oldPriority = loc.priority;
  const oldIsOrigin = loc.origin;

  let [isOpen, setIsOpen] = useState(false);

  const [Name, setName] = useState(loc.name);
  const [Notes, setNotes] = useState(loc.notes);
  const [Priority, setPriority] = useState(loc.priority);
  const [CurrentHome, setCurrentHome] = useState(loc.current_home);
  const [isOrigin, setOrigin] = useState(loc.origin);

  const handleNameChange = (event) => {
    setName(event.target.value);
  }

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  }

  const handlePriorityChange = event => {
    const regex = /\D/g;
    const result = event.target.value.replace(regex, '');
    setPriority(result);
  };

  const deleteRelevantDocumentsOnOriginChange = async (isOrigin, itemToDelete) => {
    const byDestStr = isOrigin ? "ByOrigin" : "ByDest";

    await axios
      .post(`http://localhost:5000/deleteSavedScore${byDestStr}/${itemToDelete}`, {})
      .catch((error) => {
        console.log(error.message);
      });

    await axios
      .post(`http://localhost:5000/deleteRoutingData${byDestStr}/${itemToDelete}`, {})
      .catch((error) => {
        console.log(error.message);
      });

    await axios
      .post(`http://localhost:5000/deleteItineraries${byDestStr}/${itemToDelete}`, {})
      .catch((error) => {
        console.log(error.message);
      });
  }

  const submitHandler = async (event) => {
    event.preventDefault();

    if(user_id === null) {
      submitHandlerNonLoggedInUsers();

    } else {
      await submitHandlerLoggedInUsers();
    }
  };

  const submitHandlerNonLoggedInUsers = () => {
    let locationStringArray = sessionStorage.getItem('location')
    let locationArray = JSON.parse(locationStringArray); 

    // Remove other homes if new home is set
    if(CurrentHome !== loc.current_home) {
      for(const l of locationArray) {
        if(l._id !== loc._id && l.current_home) {
          l.current_home = false;
        }
      }
    }

    if (
      Name !== "" ||
      Notes !== "" ||
      Priority !== ""
    ) {
      const newPriority = parseInt(Priority);
      for(const l of locationArray) {
        if(l._id === loc._id) {
          l.name = Name;
          l.notes = Notes;
          l.priority = newPriority;
          l.current_home = isOrigin ? CurrentHome : false;
          l.origin = isOrigin;
        }
      }
      sessionStorage.setItem('location', JSON.stringify(locationArray));

      if (newPriority !== oldPriority || isOrigin !== oldIsOrigin) {
        const oldPrefs = JSON.parse(sessionStorage.getItem('preferences'));
        oldPrefs.preferencesUpdated = true;
        sessionStorage.setItem('preferences', JSON.stringify(oldPrefs))
      }

      window.location.reload(false);
    }
  }

  const submitHandlerLoggedInUsers = async () => {
    // Reset all other homes to false if current location changed
    if (CurrentHome !== loc.current_home) {
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
      const newPriority = parseInt(Priority);
      await axios
        .post("http://localhost:5000/updateLocation", {
          _id: mongoose.Types.ObjectId(loc._id),
          name: Name,
          notes: Notes,
          priority: newPriority,
          current_home: isOrigin ? CurrentHome : false,
          origin: isOrigin
        })
        .catch((error) => {
          console.log(error.message);
        });
      if (newPriority !== oldPriority) {
        const currentDate = Date.now();

        const data = {
          _id: mongoose.Types.ObjectId(user_id),
          lastScoringPrefChangeTime: currentDate
        }

        await axios
          .post("http://localhost:5000/modifyUserByID", data)
          .catch((error) => {
            console.log(error.message);
          });
      }
      if (isOrigin !== oldIsOrigin) {
        const currentDate = Date.now();
        const itemToDelete = mongoose.Types.ObjectId(loc._id);
        console.log(itemToDelete)

        const data = {
          _id: mongoose.Types.ObjectId(user_id),
          lastScoringPrefChangeTime: currentDate
        }

        await axios
          .post("http://localhost:5000/modifyUserByID", data)
          .catch((error) => {
            console.log(error.message);
          });

        await deleteRelevantDocumentsOnOriginChange(oldIsOrigin, itemToDelete);
      }
      window.location.reload();
    }
  }

  const deleteHandler = async (event) => {
    event.preventDefault();
    if(user_id === null) {
      let locationStringArray = sessionStorage.getItem('location')
      let locationArray = JSON.parse(locationStringArray);
      for(let i = 0; i < locationArray.length; i++) {
        if(locationArray[i]._id === loc._id) {
          locationArray.splice(i, 1);
        }
      }
      sessionStorage.setItem('location', JSON.stringify(locationArray));
    } else {

      const locationToDelete = mongoose.Types.ObjectId(loc._id);
      await deleteRelevantDocumentsOnOriginChange(loc.origin, locationToDelete);

      await axios
        .post("http://localhost:5000/deleteLocation", {
          _id: locationToDelete,
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
    window.location.reload(false);
  }

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
        className={buttonClass}
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
        { !notext && <span>Edit</span> }
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-br from-white to-emerald-50 dark:from-emerald-900 dark:to-emerald-dark p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between gap-2 pb-1">
                    <Dialog.Title
                      as="h3"
                      className="text-3xl font-semibold leading-snug text-transparent bg-clip-text bg-gradient-to-r from-emerald-900 to-emerald-dark dark:from-white dark:to-emerald-100 flex items-center pb-1"
                    >
                      Edit location
                    </Dialog.Title>

                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={deleteHandler}
                        className="px-4 py-2 flex items-center gap-2 justify-center transition ease-in-out duration-200 text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-lg"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Delete Location
                      </button>
                    </div>

                  </div>

                  <hr className="mb-8 dark:border-emerald-700"></hr>

                  <div className="mt-2 text-emerald-darker dark:text-white">
                    <form>
                      <div className="flex flex-col gap-2">
                        <div className="flex px-4 py-2 bg-emerald-dark/10 dark:bg-black/30 rounded-md">
                          <div className="flex items-center h-8 gap-4">
                            <span className="w-16 h-full flex items-center justify-start">
                              Name
                            </span>
                            <input
                              className="px-2 h-full text-md font-semibold text-white placeholder-white bg-emerald-500 rounded-lg border-2 border-emerald-200 accent-white focus:border-white dark:border-emerald-600 dark:bg-emerald-800 dark:placeholder-emerald-100"
                              placeholder="Enter new First Name"
                              onChange={handleNameChange}
                              defaultValue={Name}
                              id="newName"
                            />
                          </div>
                        </div>

                        <div className="flex px-4 py-2 bg-emerald-dark/10 dark:bg-black/30 rounded-md">
                          <div className="flex items-center h-8 gap-4">
                            <span className="w-16 h-full flex items-center justify-start">
                              Notes
                            </span>
                            <input
                              className="px-2 h-full text-md font-semibold text-white placeholder-white bg-emerald-500 rounded-lg border-2 border-emerald-200 accent-white focus:border-white dark:border-emerald-600 dark:bg-emerald-800 dark:placeholder-emerald-100"
                              placeholder="Enter new First Name"
                              onChange={handleNotesChange}
                              defaultValue={Notes}
                              id="newNotes"
                            />
                          </div>
                        </div>

                        {isOrigin ?
                          <>
                            <div className="flex px-4 py-2 bg-emerald-dark/10 dark:bg-black/30 rounded-md" id="currentHomeBox">
                              <div className="flex items-center h-8 gap-4">
                                  <span className="w-16 h-full flex items-center justify-start leading-none">
                                    Current Home
                                  </span>
                                <Switch
                                    checked={CurrentHome}
                                    onChange={setCurrentHome}
                                    className={`${CurrentHome ? 'bg-emerald-400' : 'bg-emerald-800'}
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
                          <>
                            <div className="flex px-4 py-2 bg-emerald-dark/10 dark:bg-black/30 rounded-md" id="currentPriority">
                              <div className="flex items-center h-8 gap-4">
                            <span className="w-16 h-full flex items-center justify-start">
                            Priority
                            </span>
                                <input
                                    className="px-2 h-full text-md font-semibold text-white placeholder-white bg-emerald-500 rounded-lg border-2 border-emerald-200 accent-white focus:border-white dark:border-emerald-600 dark:bg-emerald-800 dark:placeholder-emerald-100"
                                    placeholder="Enter a number here"
                                    value={Priority}
                                    onChange={handlePriorityChange}
                                    id="newPriority"
                                />
                              </div>
                            </div>
                          </>
                        }
                        <div className="flex px-4 py-2 bg-emerald-dark/10 dark:bg-black/30 rounded-md">
                          <div className="flex items-center h-8 gap-4">
                            <span className="w-16 h-full flex items-center justify-start">
                              Origin
                            </span>
                            <Switch
                              checked={isOrigin}
                              onChange={setOrigin}
                              className={`${isOrigin ? 'bg-emerald-400' : 'bg-emerald-800'}
                                relative inline-flex h-[26px] w-[50px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                            >
                              <span
                                aria-hidden="true"
                                className={`${isOrigin ? 'translate-x-6' : 'translate-x-0'}
                                  pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                              />
                            </Switch>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={submitHandler}
                      className="px-4 py-2 flex items-center gap-2 justify-center transition ease-in-out duration-200 text-white bg-emerald-500 hover:bg-emerald-700 focus:ring-4 focus:outline-none focus:ring-emerald-400 font-semibold rounded-lg"
                      >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 flex items-center gap-2 justify-center transition ease-in-out duration-200 text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-lg"
                      >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

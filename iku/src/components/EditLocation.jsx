import {React, Fragment, useState} from "react";
import axios from "axios";
import mongoose from "mongoose";
import {Dialog, DialogTitle} from "@mui/material";
import {StyledSwitch} from "./ScoringFactorFormElements";
import {ConfirmDialog} from "./custom/ConfirmDialog";


const isDark = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;

export default function EditLocation({loc, buttonClass, notext=false}) {

  const user_id = localStorage.getItem("user_id");

  const oldName = loc.name;
  const oldNotes = loc.notes;
  const oldPriority = loc.priority;
  const oldCurrentHome = loc.current_home
  const oldIsOrigin = loc.origin;

  const [isOpen, setIsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [name, setName] = useState(loc.name);
  const [notes, setNotes] = useState(loc.notes);
  const [priority, setPriority] = useState(loc.priority);
  const [currentHome, setCurrentHome] = useState(loc.current_home);
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

  const handleCurrentHomeChange = (e) => {
    e.stopPropagation();
    setCurrentHome(!currentHome);
  }

  const handleIsOriginChange = (e) => {
    e.stopPropagation();
    setOrigin(!isOrigin);
  }

  const deleteRelevantDocumentsOnOriginChange = async (isOrigin, itemToDelete) => {
    const byDestStr = isOrigin ? "ByOrigin" : "ByDest";

    await axios
      .post(`http://iku.ddns.net:5000/deleteSavedScore${byDestStr}/${itemToDelete}`, {})
      .catch((error) => {
        console.log(error.message);
      });

    await axios
      .post(`http://iku.ddns.net:5000/deleteRoutingData${byDestStr}/${itemToDelete}`, {})
      .catch((error) => {
        console.log(error.message);
      });

    await axios
      .post(`http://iku.ddns.net:5000/deleteItineraries${byDestStr}/${itemToDelete}`, {})
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
    if(currentHome !== loc.current_home) {
      for(const l of locationArray) {
        if(l._id !== loc._id && l.current_home) {
          l.current_home = false;
        }
      }
    }

    if (
      name !== "" ||
      notes !== "" ||
      priority !== ""
    ) {
      const newPriority = parseInt(priority);
      for(const l of locationArray) {
        if(l._id === loc._id) {
          l.name = name;
          l.notes = notes;
          l.priority = newPriority;
          l.current_home = isOrigin ? currentHome : false;
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
    if (currentHome !== loc.current_home) {
      let locations;

      await axios.get(`http://iku.ddns.net:5000/locations/${user_id}`)
      .then((response) => {
        locations = response.data;
        locations = locations.filter(l => l._id !== loc._id && l.current_home);
      })
      .catch(err => console.error(err));

      for (let l in locations) {
        let oldHome = locations[l];
        await axios
        .post("http://iku.ddns.net:5000/updateLocation", {
          _id: mongoose.Types.ObjectId(oldHome._id),
          current_home: false,
        })
        .catch((error) => {
          console.log(error.message);
        });
      }
    }

    if (
      name !== "" ||
      notes !== "" ||
      priority !== ""
    ) {
      const newPriority = parseInt(priority);
      await axios
        .post("http://iku.ddns.net:5000/updateLocation", {
          _id: mongoose.Types.ObjectId(loc._id),
          name: name,
          notes: notes,
          priority: newPriority,
          current_home: isOrigin ? currentHome : false,
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
          .post("http://iku.ddns.net:5000/modifyUserByID", data)
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
          .post("http://iku.ddns.net:5000/modifyUserByID", data)
          .catch((error) => {
            console.log(error.message);
          });

        await deleteRelevantDocumentsOnOriginChange(oldIsOrigin, itemToDelete);
      }
      window.location.reload();
    }
  }

  const deleteLocation = () => {
    setDeleteDialogOpen(true);
  }

  const deleteHandler = async (event) => {
    if (event) {
      event.preventDefault();
    }

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
        .post("http://iku.ddns.net:5000/deleteLocation", {
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
    setName(oldName);
    setNotes(oldNotes);
    setPriority(oldPriority);
    setCurrentHome(oldCurrentHome);
    setOrigin(oldIsOrigin);
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

      <Dialog
        open={isOpen}
        onClose={closeModal}
        maxWidth='xs'
        fullWidth
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)'
          },
          '& .MuiDialog-paper': {
            borderRadius: '1rem',
            padding: '1.5rem',
            background: isDark
              ? 'linear-gradient(to bottom right, #0a1e1d, #0c2927)'
              : 'linear-gradient(to bottom right, #ecfdf5, #d1fae5)',
            color: isDark
              ? '#fff'
              : '#0a1e1d'
          }
        }}
      >
          <div className="flex justify-between gap-2 pb-1">
            <DialogTitle
              as="h3"
              className="text-3xl font-semibold leading-snug text-transparent bg-clip-text bg-gradient-to-r from-emerald-900 to-emerald-dark dark:from-white dark:to-emerald-100 flex items-center "
              sx={{ p: 0}}
            >
              <div className="flex">
                <div className="inline flex flex-row">Edit Location</div>
              </div>
            </DialogTitle>

          </div>

          <hr className="mb-8 dark:border-emerald-700"></hr>

          <div className="mt-2 text-emerald-darker dark:text-white">
            <form>
              <div className="flex flex-col gap-2">
                <div className="flex p-2 sm:px-4 bg-emerald-dark/10 dark:bg-black/30 rounded-md">
                  <div className="flex items-center h-8 gap-4">
                    <span className="w-16 h-full flex items-center justify-start">
                      Name
                    </span>
                    <input
                      className="px-2 h-full text-md font-semibold text-white placeholder-white bg-emerald-500 rounded-lg border-2 border-emerald-200 accent-white focus:border-white dark:border-emerald-600 dark:bg-emerald-800 dark:placeholder-emerald-100"
                      placeholder="Enter new First Name"
                      onChange={handleNameChange}
                      defaultValue={name}
                      id="newName"
                    />
                  </div>
                </div>

                <div className="flex p-2 sm:px-4 bg-emerald-dark/10 dark:bg-black/30 rounded-md">
                  <div className="flex items-center h-8 gap-4">
                    <span className="w-16 h-full flex items-center justify-start">
                      Notes
                    </span>
                    <input
                      className="px-2 h-full text-md font-semibold text-white placeholder-white bg-emerald-500 rounded-lg border-2 border-emerald-200 accent-white focus:border-white dark:border-emerald-600 dark:bg-emerald-800 dark:placeholder-emerald-100"
                      placeholder="Enter new First Name"
                      onChange={handleNotesChange}
                      defaultValue={notes}
                      id="newNotes"
                    />
                  </div>
                </div>

                {isOrigin ?
                  <>
                    <div className="flex p-2 sm:px-4 bg-emerald-dark/10 dark:bg-black/30 rounded-md" id="currentHomeBox">
                      <div className="flex items-center h-8 gap-4">
                        <span className="w-16 h-full flex items-center justify-start leading-none">
                          Current Home
                        </span>
                        <StyledSwitch
                          checked={currentHome}
                          onChange={handleCurrentHomeChange}
                        />
                      </div>
                    </div>
                  </>
                  :
                  <>
                    <div className="flex p-2 sm:px-4 bg-emerald-dark/10 dark:bg-black/30 rounded-md" id="currentPriority">
                      <div className="flex items-center h-8 gap-4">
                        <span className="w-16 h-full flex items-center justify-start">
                          Priority
                        </span>
                        <input
                          className="px-2 h-full text-md font-semibold text-white placeholder-white bg-emerald-500 rounded-lg border-2 border-emerald-200 accent-white focus:border-white dark:border-emerald-600 dark:bg-emerald-800 dark:placeholder-emerald-100"
                          placeholder="Enter a number here"
                          value={priority}
                          onChange={handlePriorityChange}
                          id="newPriority"
                        />
                      </div>
                    </div>
                  </>
                }
                <div className="flex p-2 sm:px-4 bg-emerald-dark/10 dark:bg-black/30 rounded-md">
                  <div className="flex items-center h-8 gap-4">
                    <span className="w-16 h-full flex items-center justify-start">
                      Origin
                    </span>
                    <StyledSwitch
                      checked={isOrigin}
                      onChange={handleIsOriginChange}
                      />
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={submitHandler}
              className="p-2 sm:px-4 flex items-center gap-2 justify-center transition ease-in-out duration-200 text-white bg-emerald-500 hover:bg-emerald-700 focus:ring-4 focus:outline-none focus:ring-emerald-400 font-semibold rounded-lg"
              >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm sm:text-normal">Save</span>
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="p-2 sm:px-4 flex items-center gap-2 justify-center transition ease-in-out duration-200 text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-lg"
              >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm sm:text-normal">Cancel</span>

            </button>

            <div className="flex items-center">
              <button
                type="button"
                onClick={deleteLocation}
                className="p-2 sm:px-4 flex items-center gap-2 justify-center transition ease-in-out duration-200 text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                <span className="text-sm sm:text-normal">Delete</span>
              </button>

              <ConfirmDialog
                open={deleteDialogOpen}
                setOpen={setDeleteDialogOpen}
                onConfirm={deleteHandler}
              >
                Delete location {loc.name}?
              </ConfirmDialog>
            </div>
          </div>
      </Dialog>
    </>
  )
}

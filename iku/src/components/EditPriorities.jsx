import {React, Fragment, useState} from "react";
import {Switch, Dialog, Transition} from '@headlessui/react';
import {Slider} from '@mui/material';
import axios from "axios";
import mongoose from "mongoose";
import {Link} from "react-router-dom";

export default function EditPriorities(props) {
  let [isOpen, setIsOpen] = useState(false);

  const [frequency, setFrequency] = useState(80);
  const [duration, setDuration] = useState(15);
  const [walkTime, setWalkTime] = useState(5);
  const [sliderVal, setSliderVal] = useState([80,95])


  // const [Name, setName] = useState(loc.name);
  // const [Notes, setNotes] = useState(loc.notes);
  // const [Priority, setPriority] = useState(loc.priority);

  // const handleNameChange = (event) => {
  //   setName(event.target.value);
  // }
  //
  // const handleNotesChange = (event) => {
  //   setNotes(event.target.value);
  // }
  //
  // const handlePriorityChange = event => {
  //   const regex = /\D/g;
  //   const result = event.target.value.replace(regex, '');
  //   setPriority(result);
  // };

  function valuetext(value) {
    return `${value}%`;
  }

  const minDistance = 5;
  const minValue = minDistance;
  const maxValue = 100 - minDistance;

  const frequencyColor = '#38bdf8';
  const durationColor = '#f472b6';
  const walkTimeColor = '#facc15';
  const sliderThumbColor = '#fff'
  const sliderThumbShadow = '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';
  const sliderThumbActiveShadow = '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)';


  const handleChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    // If the user tries to set the middle value below the minimum distance
    if (newValue[1] - newValue[0] < minDistance) {
      // If the user was adjusting the left thumb (button)
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        // If the right value is valid (user is not trying to set the right value above maximum)
        if (clamped + minDistance <= maxValue) {
          setSliderVal([clamped, clamped + minDistance]);
        } else {
          setSliderVal([maxValue - minDistance, maxValue])
        }
      }

      // If the user was adjusting the right thumb (button)
      else {
        const clamped = Math.max(newValue[1], minDistance);
        // If the left value is valid (user is not trying to set the left value below minimum)
        if (clamped - minDistance >= minValue) {
          setSliderVal([clamped - minDistance, clamped]);
        } else {
          setSliderVal([minValue, minValue + minDistance])
        }
      }
    }

    // Middle value is good
    else {
      // If the user was adjusting the left thumb (button)
      if (activeThumb === 0) {
        // If the left value is valid (user is not trying to set the left value below minimum)
        if (newValue[0] >= minValue) {
          setSliderVal(newValue);
        } else {
          setSliderVal([minValue, newValue[1]]);
        }
      } else {
        // If the right value is valid (user is not trying to set the right value above maximum)
        if (newValue[1] <= maxValue) {
          setSliderVal(newValue);
        } else {
          setSliderVal([newValue[0], maxValue]);
        }
      }
    }

    // Set frequency to left value, duration to middle value, walkTime to right value
    setFrequency(sliderVal[0]);
    setDuration(sliderVal[1]-sliderVal[0]);
    setWalkTime(100-sliderVal[1]);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    // // Reset all other homes to false if current location changed
    // if (CurrentHome !== loc.current_home) {
    //   const user_id = localStorage.getItem("user_id");
    //   let locations;
    //
    //   await axios.get(`http://localhost:5000/locations/${user_id}`)
    //   .then((response) => {
    //     locations = response.data;
    //     locations = locations.filter(l => l._id !== loc._id && l.current_home);
    //   })
    //   .catch(err => console.error(err));
    //
    //   for (let l in locations) {
    //     let oldHome = locations[l];
    //     await axios
    //     .post("http://localhost:5000/updateLocation", {
    //       _id: mongoose.Types.ObjectId(oldHome._id),
    //       current_home: false,
    //     })
    //     .catch((error) => {
    //       console.log(error.message);
    //     });
    //   }
    // }
    //
    // if (
    //   Name !== "" ||
    //   Notes !== "" ||
    //   Priority !== ""
    // ) {
    //   await axios
    //     .post("http://localhost:5000/updateLocation", {
    //       _id: mongoose.Types.ObjectId(loc._id),
    //       name: Name,
    //       notes: Notes,
    //       priority: parseInt(Priority),
    //       current_home: isOrigin ? CurrentHome : false,
    //       origin: isOrigin
    //     })
    //     .catch((error) => {
    //       console.log(error.message);
    //     });
    //   window.location.reload(false);
    // }
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
      <div>
        <button onClick={openModal} type="button" className={props.buttonClass}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
               stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
          </svg>
          Edit Priorities
        </button>
      </div>

      {/*<button*/}
      {/*  type="button"*/}
      {/*  onClick={openModal}*/}
      {/*  className={props.buttonClass}*/}
      {/*  >*/}
      {/*  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">*/}
      {/*    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />*/}
      {/*  </svg>*/}
      {/*</button>*/}

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
            <div className="fixed inset-0 bg-black bg-opacity-25"/>
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
                <Dialog.Panel
                  className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between gap-2">
                    <Dialog.Title
                      as="h3"
                      className="text-3xl font-semibold leading-6 text-emerald-900 flex items-center"
                    >
                      Edit location
                    </Dialog.Title>
                  </div>

                  <hr className="mt-1 mb-8"></hr>

                  <p>
                    The <b>frequency</b> refers to the gap between departures: if the departures are spaced 15 minutes
                    apart then the frequency is 15. The frequency is by far regarded to be the most important aspect of
                    any transit service.
                  </p>

                  <p>
                    The <b>duration</b> refers to the the total trip time, excluding the initial wait time but including
                    any transfer wait times: if you board your first bus at 9am and you arrive at your destination at
                    9.45am, then the duration is 45 minutes. The frequency is generally regarded to be the second most
                    important aspect of a transit service.
                  </p>

                  <p>
                    The <b>walk time</b> refers to the total amount of walking involved in a route. Most generally do
                    not worry too much about the required walk time, as long as it is not excessive; however it may be
                    important for those with reduced or limited mobility to reduce the total walk time.
                  </p>

                  <div>
                    <Slider
                      track={false}
                      getAriaLabel={() => 'Minimum distance shift'}
                      value={sliderVal}
                      onChange={handleChange}
                      valueLabelDisplay="off"
                      getAriaValueText={valuetext}
                      disableSwap
                      sx={{
                        '& .MuiSlider-rail': {
                          background: `linear-gradient(to right, ${frequencyColor} ${frequency}%,
                        ${durationColor} ${frequency}%, ${durationColor} ${frequency+duration}%,
                        ${walkTimeColor} ${frequency+duration}%);`,
                          opacity: 1
                        },
                        '& .MuiSlider-thumb': {
                          backgroundColor: sliderThumbColor,
                          boxShadow: sliderThumbShadow,
                          '&:focus, &:hover, &.Mui-active': {
                            boxShadow: sliderThumbActiveShadow,
                            // Reset on touch devices, it doesn't add specificity
                            '@media (hover: none)': {
                              boxShadow: sliderThumbShadow,
                            },
                          },
                        }
                      }}
                    />
                  </div>


                  {frequency} {duration} {walkTime}


                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={submitHandler}
                      className="px-4 py-2 flex items-center gap-2 justify-center transition ease-in-out duration-200 text-white bg-emerald-500 hover:bg-emerald-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-semibold rounded-lg dark:bg-emerald-400 dark:hover:bg-emerald-600 dark:focus:ring-green-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                           stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 flex items-center gap-2 justify-center transition ease-in-out duration-200 text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-lg dark:bg-red-400 dark:hover:bg-red-600 dark:focus:ring-red-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                           stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
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

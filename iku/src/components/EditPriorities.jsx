import React, {Fragment, useState} from "react";
import {Dialog, Transition} from '@headlessui/react';
import {Slider} from '@mui/material';
import Carousel from 'react-material-ui-carousel';

import axios from "axios";
import mongoose from "mongoose";

import {ReactComponent as DurationIcon} from "./../assets/clock-regular.svg";
import {ReactComponent as FrequencyIcon} from "./../assets/table-solid.svg";
import {ReactComponent as WalkIcon} from "./../assets/person-walking-solid.svg";


function CarouselItem(props) {
  return (
    <div className="h-72 bg-emerald-dark/10 dark:bg-black/30 to-emerald-darkest rounded-xl p-2 overflow-y-auto">
      {props.children}
    </div>
  )
}

export default function EditPriorities(props) {
  let frequency = props.frequency;
  let setFrequency = props.setFrequency;
  let duration = props.duration;
  let setDuration = props.setDuration;
  let walkTime = props.walkTime;
  let setWalkTime = props.setWalkTime;

  const [isOpen, setIsOpen] = useState(false);
  const [sliderVal, setSliderVal] = useState([0,0]);

  const [oldFreq, setOldFreq] = useState(0);
  const [oldDur, setOldDur] = useState(0);
  const [oldWalk, setOldWalk] = useState(0);

  const user_id = localStorage.getItem("user_id");

  const minDistance = 5;
  const minValue = minDistance;
  const maxValue = 100 - minDistance;

  const frequencyColor = '#38bdf8';
  const durationColor = '#c084fc';
  const walkTimeColor = '#f472b6';
  const sliderThumbColor = '#fff'
  const sliderThumbShadow = '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';
  const sliderThumbActiveShadow = '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)';

  // boxConicGradient1 has the center of the gradient at the bottom of the box.
  // boxConicGradient2 has the center of the gradient below the bottom of the box, giving a quasi-linear appearance.
  const boxConicGradient1 = `conic-gradient(
    from 180deg at 50% 100%, 
    ${frequencyColor} 90deg, 
    ${frequencyColor} ${90 + 1.8 * (frequency/2)}deg,
    ${durationColor} ${90 + 1.8 * (frequency)}deg, 
    ${durationColor} ${90 + 1.8 * (frequency + duration)}deg, 
    ${walkTimeColor} ${90 + 1.8 * (frequency + duration + walkTime/2)}deg,
    ${walkTimeColor} 270deg
    )`;
  const boxConicGradient2 = `conic-gradient(
    from 180deg at 50% 200%, 
    ${frequencyColor} 140deg, 
    ${durationColor} ${140 + 0.8 * (frequency)}deg, 
    ${durationColor} ${140 + 0.8 * (frequency + duration)}deg, 
    ${walkTimeColor} 220deg
    )`;

  function openModal() {
    // Save old values in case user clicks cancel
    // TODO: there's probably a better way to do this.
    setOldFreq(frequency);
    setOldDur(duration);
    setOldWalk(walkTime);
    setSliderVal([frequency, frequency + duration]);

    setIsOpen(true);
  }


  function closeModal() {
    // Reset to old values
    setFrequency(oldFreq);
    setDuration(oldDur);
    setWalkTime(oldWalk);
    setSliderVal([oldFreq, oldFreq + oldDur]);

    // Close modal without saving changes
    setIsOpen(false);
  }
  function sliderValueText(value, index) {
    switch (index){
      case 0:
        return `Frequency ${value}%`;
      case 1:
        return `Walk time ${100-value}%`;
    }
  }

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
    setDuration(sliderVal[1] - sliderVal[0]);
    setWalkTime(100 - sliderVal[1]);
  };

  // Submit user's scoring factor preferences
  const submitHandler = async (event) => {
    event.preventDefault();

    const currentDate = Date.now();

    await axios
      .post("http://localhost:5000/modifyUserByID", {
        _id: mongoose.Types.ObjectId(user_id),
        duration_priority: duration,
        frequency_priority: frequency,
        walk_priority: walkTime,
        lastPrefChangeTime: currentDate
      })
      .catch((error) => {
        console.log(error.message);
      });
    window.location.reload(false);
  };

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
                  className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-br from-white to-emerald-50 dark:from-emerald-dark dark:to-emerald-darker p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between gap-2 mb-2">
                    <Dialog.Title
                      as="h3"
                      className="text-3xl font-semibold leading-6 text-emerald-900 dark:text-emerald-50 flex items-center"
                    >
                      Edit location
                    </Dialog.Title>
                  </div>

                  <hr className="mt-1 mb-8 dark:border-emerald-900"></hr>

                  <Carousel autoPlay={false} animation="slide" cycleNavigation={false} className="text-emerald-darker dark:text-white">
                    <CarouselItem>
                      <div className="mb-4">
                        The three adjustable scoring factors are the <b>frequency</b>, <b>duration</b>, and <b>walk
                        time</b>. Use the slider below to adjust the proportional impact of these factors.
                      </div>

                      <div className="mb-4">
                        If you need explanations on what these factors mean, or guidance on how to set these scoring
                        factors, click the arrows on the sides (or swipe left) to view details.
                      </div>
                    </CarouselItem>

                    <CarouselItem>
                      <div className="mb-4">
                        The <b>frequency</b> refers to the gap between departures: if the departures are spaced on
                        average 15 minutes apart (such that departures are at 9:00 AM, 9:15 AM, etc.), then the
                        frequency is 15. The frequency is by far regarded to be the most important aspect of any
                        transit service.
                      </div>

                      <div className="mb-4">
                        By default, the frequency represents 70% of the grade. Because of its importance, it is
                        recommended that the frequency remains a huge proportion of the grade.
                      </div>
                    </CarouselItem>

                    <CarouselItem>
                      <div className="mb-4">
                        The <b>duration</b> refers to the the total trip time, including any transfer wait times: if you
                        board your first bus at 9am and you arrive at your destination at 9.45am, then the duration is
                        45 minutes.
                      </div>

                      <div className="mb-4">
                        By default, the duration represents 20% of the grade. It is tempting to set the duration to a
                        large proportion, but consider that long durations do not necessarily indicate bad transit;
                        longer distances naturally involve longer commutes, whether by transit or by driving.
                      </div>
                    </CarouselItem>

                    <CarouselItem>
                      <div className="mb-4">
                        The <b>walk time</b> refers to the total amount of walking involved in a route. If you have to
                        walk 10 minutes to the train station, and then another 10 minutes from the train statin to your
                        destination, then the total walk time is 20 minutes.
                      </div>

                      <div className="mb-4">
                        By default, the walk time represents 10% of the grade. Most will not need to worry about routes'
                        walk time; however it may be important for those with reduced or limited mobility to prioritize
                        routes with shorter walk time.
                      </div>

                    </CarouselItem>
                  </Carousel>

                  <div>
                    <Slider
                      track={false}
                      getAriaLabel={() => 'Scoring factor proportions'}
                      value={sliderVal}
                      onChange={handleChange}
                      valueLabelDisplay="off"
                      getAriaValueText={sliderValueText}
                      disableSwap
                      sx={{
                        '& .MuiSlider-rail': {
                          background: `linear-gradient(to right, ${frequencyColor} ${frequency}%,
                        ${durationColor} ${frequency}%, ${durationColor} ${frequency + duration}%,
                        ${walkTimeColor} ${frequency + duration}%);`,
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

                  <div className=" text-white w-full rounded-3xl p-4 flex flex-col gap-2"
                       style={{background: boxConicGradient1}}>
                    <div className="font-semibold text-2xl rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                      <FrequencyIcon className="fill-white w-6 h-6"/>
                      <span>Frequency: {frequency}%</span>
                    </div>

                    <div className="font-semibold text-2xl rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                      <DurationIcon className="fill-white w-6 h-6"/>
                      <span>Duration: {duration}%</span>
                    </div>

                    <div className="font-semibold text-2xl rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                      <WalkIcon className="fill-white w-6 h-6"/>
                      <span>Walk Time: {walkTime}%</span>
                    </div>
                  </div>


                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={submitHandler}
                      className="px-4 py-2 flex items-center gap-2 justify-center transition ease-in-out duration-200 text-white bg-emerald-500 hover:bg-emerald-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-semibold rounded-lg"
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
                      className="px-4 py-2 flex items-center gap-2 justify-center transition ease-in-out duration-200 text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-lg"
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

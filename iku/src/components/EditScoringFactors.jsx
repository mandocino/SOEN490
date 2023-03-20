import React, {Fragment, useState} from "react";
import {Dialog, Transition} from '@headlessui/react';
import Carousel from 'react-material-ui-carousel';

import axios from "axios";
import mongoose from "mongoose";

import {ReactComponent as DurationIcon} from "./../assets/clock-regular.svg";
import {ReactComponent as FrequencyIcon} from "./../assets/table-solid.svg";
import {ReactComponent as WalkIcon} from "./../assets/person-walking-solid.svg";
import ProportionalSlider from "./custom/ProportionalSlider";


function CarouselItem(props) {
  return (
    <div className="h-72 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-emerald-darker dark:to-black rounded-xl p-2 overflow-y-auto">
      {props.children}
    </div>
  )
}

export default function EditScoringFactors(props) {
  let factorWeights = props.factorState[0];
  let setFactorWeights = props.factorState[1];
  let nightDayWeights = props.nightDayState[0];
  let setNightDayWeights = props.nightDayState[1];
  let factorColors= props.factorColors;


  const [isOpen, setIsOpen] = useState(false);

  const [factorSliderVal, setFactorSliderVal] = useState([]);
  const [oldFactorWeights, setOldFactorWeights] = useState([]);

  const [oldNightDayWeights, setOldNightDayWeights] = useState([]);
  const [nightDaySliderVal, setNightDaySliderVal] = useState([]);

  const user_id = localStorage.getItem("user_id");

  const frequencyColor = factorColors[0].hex;
  const frequencyTextColor = factorColors[0].text
  const durationColor = factorColors[1].hex;
  const durationTextColor = factorColors[1].text;
  const walkTimeColor = factorColors[2].hex;
  // const walkTimeTextColor = props.walkTimeColor.text;

  // boxConicGradient1 has the center of the gradient at the bottom of the box.
  // boxConicGradient2 has the center of the gradient below the bottom of the box, giving a quasi-linear appearance.
  const boxConicGradient1 = `conic-gradient(
    from 180deg at 50% 100%, 
    ${frequencyColor} 90deg, 
    ${frequencyColor} ${90 + 1.8 * (factorWeights[0]/2)}deg,
    ${durationColor} ${90 + 1.8 * (factorWeights[0])}deg, 
    ${durationColor} ${90 + 1.8 * (factorWeights[0] + factorWeights[1])}deg,
    ${durationColor} 270deg
    )`;
  // const boxConicGradient2 = `conic-gradient(
  //   from 180deg at 50% 200%,
  //   ${frequencyColor} 140deg,
  //   ${durationColor} ${140 + 0.8 * (frequency)}deg,
  //   ${durationColor} ${140 + 0.8 * (frequency + duration)}deg,
  //   ${walkTimeColor} 220deg
  //   )`;

  function createCumulativeArray(val) {
    let newArr = [val[0]];
    for (let i=1; i<val.length-1; i++) {
      newArr.push(val[i]+newArr[i-1]);
    }
    return newArr;
  }

  function openModal() {
    // Save old values in case user clicks cancel
    // TODO: there's probably a better way to do this.
    setOldFactorWeights(factorWeights);
    setFactorSliderVal(createCumulativeArray(factorWeights));

    setOldNightDayWeights(nightDayWeights);
    setNightDaySliderVal(createCumulativeArray(nightDayWeights));

    setIsOpen(true);
  }


  function closeModal() {
    // Reset to old values
    setFactorWeights(oldFactorWeights);
    setFactorSliderVal(createCumulativeArray(oldFactorWeights));

    setOldNightDayWeights(oldNightDayWeights);
    setNightDaySliderVal(createCumulativeArray(oldNightDayWeights));

    // Close modal without saving changes
    setIsOpen(false);
  }

  // Submit user's scoring factor preferences
  const submitHandler = async (event) => {
    event.preventDefault();

    const currentDate = Date.now();

    if(user_id === null) {
      let preferences = JSON.parse(sessionStorage.getItem("preferences"));

      preferences.factorWeights = factorWeights;

      sessionStorage.setItem("preferences", JSON.stringify(preferences));
    } else {
      await axios
        .post("http://localhost:5000/modifyUserByID", {
          _id: mongoose.Types.ObjectId(user_id),
          factorWeights: {
            frequencyWeight: factorWeights[0],
            durationWeight: factorWeights[1]
          },
          lastPrefChangeTime: currentDate
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
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
          Edit Scoring Factors
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
            <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-75"/>
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
                  className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-br from-white to-emerald-50 dark:from-emerald-900 dark:to-emerald-dark p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between gap-2 pb-1">
                    <Dialog.Title
                      as="h3"
                      className="text-3xl font-semibold leading-snug text-transparent bg-clip-text bg-gradient-to-r from-emerald-900 to-emerald-dark dark:from-white dark:to-emerald-100 flex items-center"
                    >
                      Edit scoring factors
                    </Dialog.Title>
                  </div>

                  <hr className="mb-8 dark:border-emerald-700"></hr>

                  <Carousel autoPlay={false} animation="slide" cycleNavigation={false} className="text-emerald-darker dark:text-white"
                    sx={{
                      button: {
                        '&:hover': {
                          opacity: '1 !important'
                        }
                      },
                      buttonWrapper: {
                        '&:hover': {
                          '& $button': {
                            backgroundColor: "black",
                            filter: "brightness(120%)",
                            opacity: "1"
                          }
                        }
                      },
                    }}>
                    <CarouselItem>
                      <div className="mb-4">
                        The three adjustable scoring factors are the <b className={frequencyTextColor}>frequency</b> and
                        the <b className={durationTextColor}>duration</b>. Use the slider below to adjust the
                        proportional impact of these factors.
                      </div>

                      <div className="mb-4">
                        If you need explanations on what these factors mean, or guidance on how to set these scoring
                        factors, click the arrows on the sides (or swipe left) to view details.
                      </div>
                    </CarouselItem>

                    <CarouselItem>
                      <div className="mb-4">
                        The <b className={frequencyTextColor}>frequency</b> refers to the gap between departures: if the
                        departures are spaced on average 15 minutes apart (such that departures are at 9:00 AM, 9:15 AM,
                        etc.), then the frequency is 15. The frequency is by far regarded to be the most important
                        aspect of any transit service.
                      </div>

                      <div className="mb-4">
                        By default, the frequency represents 70% of the grade. Because of its importance, it is
                        recommended that the frequency remains a huge proportion of the grade.
                      </div>
                    </CarouselItem>

                    <CarouselItem>
                      <div className="mb-4">
                        The <b className={durationTextColor}>duration</b> refers to the the total trip time, including
                        any transfer wait times: if you board your first bus at 9am and you arrive at your destination
                        at 9.45am, then the duration is 45 minutes.
                      </div>

                      <div className="mb-4">
                        By default, the duration represents 20% of the grade. It is tempting to set the duration to a
                        large proportion, but consider that long durations do not necessarily indicate bad transit;
                        longer distances naturally involve longer commutes, whether by transit or by driving.
                      </div>
                    </CarouselItem>
                  </Carousel>

                  <div>
                    <ProportionalSlider
                      sliderState={[factorSliderVal, setFactorSliderVal]}
                      valueState={[factorWeights, setFactorWeights]}
                      sliderColors={[frequencyColor, durationColor]}
                    />
                  </div>

                  <div>
                    <ProportionalSlider
                      sliderState={[nightDaySliderVal, setNightDaySliderVal]}
                      valueState={[nightDayWeights, setNightDayWeights]}
                      sliderColors={[frequencyColor, durationColor, walkTimeColor]}
                    />
                  </div>

                  <div className=" text-white w-full rounded-3xl p-4 flex flex-col gap-2"
                       style={{background: boxConicGradient1}}>
                    <div className="font-semibold text-2xl rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                      <FrequencyIcon className="fill-white w-6 h-6"/>
                      <span>Frequency: {factorWeights[0]}%</span>
                    </div>

                    <div className="font-semibold text-2xl rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                      <DurationIcon className="fill-white w-6 h-6"/>
                      <span>Duration: {factorWeights[1]}%</span>
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

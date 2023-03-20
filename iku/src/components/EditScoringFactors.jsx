import React, {Fragment, useEffect, useState} from "react";
import Carousel from 'react-material-ui-carousel';
import ProportionalSlider from "./custom/ProportionalSlider";
import axios from "axios";
import {Dialog, Transition} from '@headlessui/react';
import {ReactComponent as DurationIcon} from "./../assets/clock-regular.svg";
import {ReactComponent as FrequencyIcon} from "./../assets/table-solid.svg";
import {ReactComponent as WalkIcon} from "./../assets/person-walking-solid.svg";
import {ReactComponent as WeekIcon} from "./../assets/calendar-week-solid.svg";
import {ReactComponent as FridayIcon} from "./../assets/calendar-fri-solid.svg";
import {ReactComponent as SaturdayIcon} from "./../assets/calendar-sat-solid.svg";
import {ReactComponent as SundayIcon} from "./../assets/calendar-sun-solid.svg";
import {ReactComponent as ToDestIcon} from "./../assets/arrow-right-to-city-solid.svg";
import {ReactComponent as FromDestIcon} from "./../assets/arrow-left-from-city-solid.svg";
import mongoose from "mongoose";
import {
  defaultUserFactorWeights,
  defaultUserNightDayWeights,
  defaultUserNightDirectionWeights,
  defaultUserTimeSliceWeights,
  defaultUserWeekendWeights
} from "../backend/config/db";
import BoxConicGradientDisplay from "./custom/BoxConicGradientDisplay";


const color1 = {bgGradient: 'bg-gradient-to-br from-sky-500 to-sky-400', text: 'text-sky-400', hex: '#38bdf8'};
const color2 = {bgGradient: 'bg-gradient-to-br from-purple-500 to-purple-400', text: 'text-purple-400', hex: '#c084fc'};
const color3 = {bgGradient: 'bg-gradient-to-br from-pink-500 to-pink-400', text: 'text-pink-400', hex: '#f472b6'};
const color4 = {bgGradient: 'bg-gradient-to-br from-rose-500 to-rose-400', text: 'text-rose-400', hex: '#f43f5e'}

const frequencyIcon = <FrequencyIcon className="fill-white w-6 h-6"/>;
const durationIcon = <DurationIcon className="fill-white w-6 h-6"/>;
const walkIcon = <WalkIcon className="fill-white w-6 h-6"/>;

const weekIcon = <WeekIcon className="fill-white w-6 h-6"/>;
const friIcon = <FridayIcon className="fill-white w-6 h-6"/>;
const satIcon = <SaturdayIcon className="fill-white w-6 h-6"/>;
const sunIcon = <SundayIcon className="fill-white w-6 h-6"/>;

const toDestIcon = <ToDestIcon className="fill-white w-6 h-6"/>;
const fromDestIcon = <FromDestIcon className="fill-white w-6 h-6"/>;

const factorHexColors = [color1.hex, color2.hex];
const factorNames = ["Frequency", "Duration"];
const factorIcons = [frequencyIcon, durationIcon];

const nightDayHexColors = [color1.hex, color2.hex, color3.hex];
const nightDayNames = ["Weeknight", "Fri. Night", "Sat. Night"];
const nightDayIcons = [weekIcon, friIcon, satIcon]

const nightDirectionHexColors = [color1.hex, color2.hex];
const nightDirectionNames = ["Towards Dest", "From Dest"];
const nightDirectionIcons = [toDestIcon, fromDestIcon];

const weekendHexColors = [color1.hex, color2.hex];
const weekendNames = ["Saturday", "Sunday"];
const weekendIcons = [satIcon, sunIcon];

const timeSliceHexColors = [color1.hex, color2.hex, color3.hex, color4.hex];
const timeSliceNames = ["Rush Hour", "Off-Peak", "Overnight", "Weekend"];
const timeSliceIcons = []

const user_id = localStorage.getItem("user_id");


function CarouselItem(props) {
  return (
    <div className="h-72 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-emerald-darker dark:to-black rounded-xl p-2 overflow-y-auto">
      {props.children}
    </div>
  )
}

export default function EditScoringFactors(props) {
  const [factorWeights, setFactorWeights] = useState([
    defaultUserFactorWeights.frequencyWeight,
    defaultUserFactorWeights.durationWeight
  ]);
  const [nightDayWeights, setNightDayWeights] = useState([
    defaultUserNightDayWeights.weeknightWeight,
    defaultUserNightDayWeights.fridayNightWeight,
    defaultUserNightDayWeights.saturdayNightWeight
  ]);
  const [nightDirectionWeights, setNightDirectionWeights] = useState([
    defaultUserNightDirectionWeights.toDestWeight,
    defaultUserNightDirectionWeights.fromDestWeight
  ]);
  const [weekendWeights, setWeekendWeights] = useState([
    defaultUserWeekendWeights.saturdayWeight,
    defaultUserWeekendWeights.sundayWeight
  ]);
  const [timeSliceWeights, setTimeSliceWeights] = useState([
    defaultUserTimeSliceWeights.rushHourWeight,
    defaultUserTimeSliceWeights.offPeakWeight,
    defaultUserTimeSliceWeights.nightWeight,
    defaultUserTimeSliceWeights.weekendWeight
  ]);

  // Fetch user's preferred scoring priorities
  const fetchUserPreferences = async () => {
    if(user_id === null) {

      if(sessionStorage.getItem("factorWeights") === null) {
        sessionStorage.setItem("factorWeights", JSON.stringify(defaultUserFactorWeights))
      } else {
        let preferences = JSON.parse(sessionStorage.getItem("factorWeights"));
        let userFactorWeights = preferences.factorWeights;

        setFactorWeights([userFactorWeights.frequencyWeight, userFactorWeights.durationWeight]);
      }
    } else {

      // Get the weighted average scores
      const response = await axios.get(`http://localhost:5000/userById/${user_id}`);
      const userData = response.data[0];

      if (userData.factorWeights.frequencyWeight + userData.factorWeights.durationWeight !== 100) {
        // TODO: Reset user factor weights
        //  Don't forget to update the user pref time when resetting
        setFactorWeights([
          defaultUserFactorWeights.frequencyWeight,
          defaultUserFactorWeights.durationWeight
        ]);
      } else {
        setFactorWeights([
          userData.factorWeights.frequencyWeight,
          userData.factorWeights.durationWeight
        ]);
      }

      if (userData.nightDayWeights.weeknightWeight + userData.nightDayWeights.fridayNightWeight + userData.nightDayWeights.saturdayNightWeight !== 100) {
        // TODO: Reset user factor weights
        setNightDayWeights([
          defaultUserNightDayWeights.weeknightWeight,
          defaultUserNightDayWeights.fridayNightWeight,
          defaultUserNightDayWeights.saturdayNightWeight
        ]);
      } else {
        setNightDayWeights([
          userData.nightDayWeights.weeknightWeight,
          userData.nightDayWeights.fridayNightWeight,
          userData.nightDayWeights.saturdayNightWeight
        ]);
      }

      if (userData.nightDirectionWeights.toDestWeight + userData.nightDirectionWeights.fromDestWeight !== 100) {
        // TODO: Reset user factor weights
        setNightDirectionWeights([
          defaultUserNightDirectionWeights.toDestWeight,
          defaultUserNightDirectionWeights.fromDestWeight
        ]);
      } else {
        setNightDirectionWeights([
          userData.nightDirectionWeights.toDestWeight,
          userData.nightDirectionWeights.fromDestWeight
        ]);
      }

      if (userData.weekendWeights.saturdayWeight + userData.weekendWeights.sundayWeight !== 100) {
        // TODO: Reset user factor weights
        setWeekendWeights([
          defaultUserWeekendWeights.saturdayWeight,
          defaultUserWeekendWeights.sundayWeight
        ]);
      } else {
        setWeekendWeights([
          userData.weekendWeights.saturdayWeight,
          userData.weekendWeights.sundayWeight
        ]);
      }

      if (userData.scoringWeights.rushHourWeight + userData.scoringWeights.offPeakWeight + userData.scoringWeights.nightWeight + userData.scoringWeights.weekendWeight !== 100) {
        // TODO: Reset user factor weights
        setTimeSliceWeights([
          defaultUserTimeSliceWeights.rushHourWeight,
          defaultUserTimeSliceWeights.offPeakWeight,
          defaultUserTimeSliceWeights.nightWeight,
          defaultUserTimeSliceWeights.weekendWeight
        ]);
      } else {
        setTimeSliceWeights([
          userData.scoringWeights.rushHourWeight,
          userData.scoringWeights.offPeakWeight,
          userData.scoringWeights.nightWeight,
          userData.scoringWeights.weekendWeight
        ]);
      }
    }
  }

  useEffect(() => {
    fetchUserPreferences();
  }, []);


  // Create card with the scoring factors
  const factorCardsArray = [{
    name: "Frequency", bg: color1.bgGradient, value: factorWeights[0]
  }, {
    name: "Duration", bg: color2.bgGradient, value: factorWeights[1]
  }];

  // Create an array with the three scoring factors
  // Sort it (mutate in-place)
  // Create divs with the position (1, 2, 3), name, value, and icon
  const factorCards = [].concat(factorCardsArray)
    .sort((a, b) => a.value < b.value ? 1 : -1)
    .map((item, i) =>
      <div key={i} className={`${item.bg} font-semibold text-2xl text-white rounded-2xl px-4 py-2 flex gap-2 justify-start items-center`}>
        <span>{i + 1}.</span>
        {item.name === "Frequency" ? frequencyIcon : item.name === "Duration" ? durationIcon : walkIcon}
        <span>{item.name}: {item.value}%</span>
      </div>);


  const [isOpen, setIsOpen] = useState(false);

  const [factorSliderVal, setFactorSliderVal] = useState([]);
  const [oldFactorWeights, setOldFactorWeights] = useState([]);

  const [nightDaySliderVal, setNightDaySliderVal] = useState([]);
  const [oldNightDayWeights, setOldNightDayWeights] = useState([]);

  const [nightDirectionSliderVal, setNightDirectionSliderVal] = useState([]);
  const [oldNightDirectionWeights, setOldNightDirectionWeights] = useState([]);

  const [weekendSliderVal, setWeekendSliderVal] = useState([]);
  const [oldWeekendWeights, setOldWeekendWeights] = useState([]);

  const [timeSliceSliderVal, setTimeSliceSliderVal] = useState([]);
  const [oldTimeSliceWeights, setOldTimeSliceWeights] = useState([]);

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

    setOldNightDirectionWeights(nightDirectionWeights);
    setNightDirectionSliderVal(createCumulativeArray(nightDirectionWeights));

    setOldWeekendWeights(weekendWeights);
    setWeekendSliderVal(createCumulativeArray(weekendWeights));

    setOldTimeSliceWeights(timeSliceWeights);
    setTimeSliceSliderVal(createCumulativeArray(timeSliceWeights));

    setIsOpen(true);
  }


  function closeModal() {
    // Reset to old values
    setFactorWeights(oldFactorWeights);
    setFactorSliderVal(createCumulativeArray(oldFactorWeights));

    setNightDayWeights(oldNightDayWeights);
    setNightDaySliderVal(createCumulativeArray(oldNightDayWeights));

    setNightDirectionWeights(oldNightDirectionWeights);
    setNightDirectionSliderVal(createCumulativeArray(oldNightDirectionWeights));

    setWeekendWeights(oldWeekendWeights);
    setWeekendSliderVal(createCumulativeArray(oldWeekendWeights));

    setTimeSliceWeights(oldTimeSliceWeights);
    setTimeSliceSliderVal(createCumulativeArray(oldTimeSliceWeights));

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
        <div
          className={`${props.dashboardInnerElementGradientClass} w-full rounded-3xl p-4 flex flex-col gap-2`}>
          {factorCards}
        </div>

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
                        The three adjustable scoring factors are the <b className={color1.text}>frequency</b> and
                        the <b className={color2.text}>duration</b>. Use the slider below to adjust the
                        proportional impact of these factors.
                      </div>

                      <div className="mb-4">
                        If you need explanations on what these factors mean, or guidance on how to set these scoring
                        factors, click the arrows on the sides (or swipe left) to view details.
                      </div>
                    </CarouselItem>

                    <CarouselItem>
                      <div className="mb-4">
                        The <b className={color1.text}>frequency</b> refers to the gap between departures: if the
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
                        The <b className={color2.text}>duration</b> refers to the the total trip time, including
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

                  <div className="flex flex-col gap-8">
                    <div>
                      <ProportionalSlider
                        sliderState={[factorSliderVal, setFactorSliderVal]}
                        valueState={[factorWeights, setFactorWeights]}
                        sliderColors={factorHexColors}
                      />
                      <BoxConicGradientDisplay
                        values={factorWeights}
                        colors={factorHexColors}
                        names={factorNames}
                        icons={factorIcons}
                      />
                    </div>

                    <div>
                      <ProportionalSlider
                        sliderState={[nightDaySliderVal, setNightDaySliderVal]}
                        valueState={[nightDayWeights, setNightDayWeights]}
                        sliderColors={nightDayHexColors}
                      />
                      <BoxConicGradientDisplay
                        values={nightDayWeights}
                        colors={nightDayHexColors}
                        names={nightDayNames}
                        icons={nightDayIcons}
                      />
                    </div>

                    <div>
                      <ProportionalSlider
                        sliderState={[nightDirectionSliderVal, setNightDirectionSliderVal]}
                        valueState={[nightDirectionWeights, setNightDirectionWeights]}
                        sliderColors={nightDirectionHexColors}
                      />
                      <BoxConicGradientDisplay
                        values={nightDirectionWeights}
                        colors={nightDirectionHexColors}
                        names={nightDirectionNames}
                        icons={nightDirectionIcons}
                      />
                    </div>

                    <div>
                      <ProportionalSlider
                        sliderState={[weekendSliderVal, setWeekendSliderVal]}
                        valueState={[weekendWeights, setWeekendWeights]}
                        sliderColors={weekendHexColors}
                      />
                      <BoxConicGradientDisplay
                        values={weekendWeights}
                        colors={weekendHexColors}
                        names={weekendNames}
                        icons={weekendIcons}
                      />
                    </div>

                    <div>
                      <ProportionalSlider
                        sliderState={[timeSliceSliderVal, setTimeSliceSliderVal]}
                        valueState={[timeSliceWeights, setTimeSliceWeights]}
                        sliderColors={timeSliceHexColors}
                      />
                      <BoxConicGradientDisplay
                        values={timeSliceWeights}
                        colors={timeSliceHexColors}
                        names={timeSliceNames}
                        icons={timeSliceIcons}
                      />
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

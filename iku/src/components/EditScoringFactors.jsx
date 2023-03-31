import React, {useEffect, useState} from "react";
import axios from "axios";
import mongoose from "mongoose";
import {
  checkIfWeightsAddTo100,
  convertUserFactorWeightsToArr,
  convertUserNightDayWeightsToArr,
  convertUserNightDirectionWeightsToArr,
  convertUserTimeSliceWeightsToArr,
  convertUserWeekendWeightsToArr,
  defaultUserFactorWeights,
  defaultUserNightDayWeights,
  defaultUserNightDirectionWeights,
  defaultUserRoutingPreferences,
  defaultUserScoringPreferences,
  defaultUserTimeSliceWeights,
  defaultUserWeekendWeights
} from "../backend/config/defaultUserPreferences";
import {
  Dialog, DialogTitle
} from "@mui/material";
import {
  ConsistencyImportanceInfo,
  FactorWeightsInfo,
  NightDayWeightsInfo,
  NightDirectionWeightsInfo,
  TimeSliceWeightsInfo,
  AccessibilitySettingsInfo,
  WeekendWeightsInfo,
  WorstAcceptableCasesInfo
} from "./ScoringFactorInfoPopovers";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IsWheelChair,
  WalkReluctance,
  ConsistencyImportance,
  WorstAcceptableCases,
  CoreFactorWeights,
  NightDayWeights,
  NightDirectionWeights,
  WeekendWeights,
  TimeSliceWeights,
  factorHexColors,
  nightDayHexColors,
  nightDirectionHexColors,
  weekendHexColors,
  timeSliceHexColors
} from "./ScoringFactorFormElements";
import {ConfirmDialog} from "./custom/ConfirmDialog";

const user_id = localStorage.getItem("user_id");

async function updateUserPreferences(data, routing) {

  if(user_id === null) {
    let preferences = JSON.parse(sessionStorage.getItem("preferences"));
    const weightName = Object.keys(data)[0];
    preferences.factorWeights[weightName] = data[weightName];

    sessionStorage.setItem("preferences", JSON.stringify(preferences));

  } else {
    const currentDate = Date.now();

    data._id = mongoose.Types.ObjectId(user_id);
    if (routing) {
      data.lastRoutingPrefChangeTime = currentDate;
    }
    data.lastScoringPrefChangeTime = currentDate;

    return await axios
      .post("http://localhost:5000/modifyUserByID", data)
      .catch((error) => {
        console.log(error.message);
      });
  }
}

export default function EditScoringFactors({userData, buttonClass}) {
  const [factorWeights, setFactorWeights] = useState([]);
  const [nightDayWeights, setNightDayWeights] = useState([]);
  const [nightDirectionWeights, setNightDirectionWeights] = useState([]);
  const [weekendWeights, setWeekendWeights] = useState([]);
  const [timeSliceWeights, setTimeSliceWeights] = useState([]);
  const [consistencyImportance, setConsistencyImportance] = useState('');
  const [worstAcceptableFrequency, setWorstAcceptableFrequency] = useState(0);
  const [worstAcceptableDuration, setWorstAcceptableDuration] = useState(0);
  const [walkReluctance, setWalkReluctance] = useState([]);
  const [isWheelChair, setIsWheelChair] = useState(false);


  const [infoPopoverActive, setinfoPopoverActive] = useState(false);
  const [infoPopoverName, setinfoPopoverName] = useState(null);
  const [infoPopoverContent, setinfoPopoverContent] = useState(null);

  const resetScoringPreferences = async () => {
    setConsistencyImportance(defaultUserScoringPreferences.consistencyImportance);
    setWorstAcceptableFrequency(defaultUserScoringPreferences.worstAcceptableFrequency);
    setWorstAcceptableDuration(defaultUserScoringPreferences.worstAcceptableDuration);
    await updateUserPreferences({scoringPreferences: defaultUserScoringPreferences}, false);
  }

  const resetRoutingPreferences = async () => {
    const defaultIsWheelChair = defaultUserRoutingPreferences.isWheelChair;
    const defaultWalkReluctance = defaultUserRoutingPreferences.walkReluctance

    setIsWheelChair(defaultIsWheelChair);
    setWalkReluctance(defaultWalkReluctance);


    const isWheelChairChanged = defaultIsWheelChair !== oldIsWheelChair;
    const walkReluctanceChanged = defaultWalkReluctance !== oldWalkReluctance;
    const routingChanged = walkReluctanceChanged || isWheelChairChanged;

    await updateUserPreferences({routingPreferences: defaultUserRoutingPreferences}, routingChanged);
  }

  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const handleResetAllFactors = async () => {
    const weightsToReset = [
      // [converterFunction, weightName, stateSetterFunction, defaultWeights]
      [convertUserFactorWeightsToArr, "factorWeights", setFactorWeights, defaultUserFactorWeights],
      [convertUserNightDayWeightsToArr, "nightDayWeights", setNightDayWeights, defaultUserNightDayWeights],
      [convertUserNightDirectionWeightsToArr, "nightDirectionWeights", setNightDirectionWeights, defaultUserNightDirectionWeights],
      [convertUserWeekendWeightsToArr, "weekendWeights", setWeekendWeights, defaultUserWeekendWeights],
      [convertUserTimeSliceWeightsToArr, "timeSliceWeights", setTimeSliceWeights, defaultUserTimeSliceWeights],
    ];

    for (let i of weightsToReset) {
      const convert = i[0];
      const weightName = i[1];
      const setState = i[2];
      const defaults = i[3];

      await updateUserPreferences({[weightName]: defaults}, false);
      setState(convert(defaults));
    }

    await resetScoringPreferences();
    await resetRoutingPreferences();
    window.location.reload();
  }

  const resetAllFactors = () => {
    setResetDialogOpen(true);
  }

  // Fetch user's preferred scoring priorities
  const fetchUserPreferences = async () => {

    const weightsToFetch = [
      // [converterFunction, weightName, stateSetterFunction, defaultWeights]
      [convertUserFactorWeightsToArr, "factorWeights", setFactorWeights, defaultUserFactorWeights],
      [convertUserNightDayWeightsToArr, "nightDayWeights", setNightDayWeights, defaultUserNightDayWeights],
      [convertUserNightDirectionWeightsToArr, "nightDirectionWeights", setNightDirectionWeights, defaultUserNightDirectionWeights],
      [convertUserWeekendWeightsToArr, "weekendWeights", setWeekendWeights, defaultUserWeekendWeights],
      [convertUserTimeSliceWeightsToArr, "timeSliceWeights", setTimeSliceWeights, defaultUserTimeSliceWeights],
    ];

    for (let i of weightsToFetch) {
      const convert = i[0];
      const weightName = i[1];
      const setState = i[2];
      const defaults = i[3];

      let resetWeights = true

      if (userData.hasOwnProperty(weightName)) {
        const fetched = convert(userData[weightName]);

        if (checkIfWeightsAddTo100(fetched)) {
          setState(fetched);
          resetWeights = false;
        }
      }

      if (resetWeights) {
        await updateUserPreferences({[weightName]: defaults}, false);
        setState(convert(defaults));
      }
    }

    if (userData.hasOwnProperty("scoringPreferences")) {
      const scoringPreferencesToFetch = [
        // [weightName, stateSetterFunction, isScoringPreference]
        ["consistencyImportance", setConsistencyImportance],
        ["worstAcceptableFrequency", setWorstAcceptableFrequency],
        ["worstAcceptableDuration", setWorstAcceptableDuration],
      ];

      for (let i of scoringPreferencesToFetch) {
        const weightName = i[0];
        const setState = i[1];

        if (userData.scoringPreferences.hasOwnProperty(weightName)) {
          const fetched = userData.scoringPreferences[weightName];
          setState(fetched);
        } else {
          await resetScoringPreferences();
          break;
        }
      }
    } else {
      await resetScoringPreferences();
    }

    if (userData.hasOwnProperty("routingPreferences")) {
      const routingPreferencesToFetch = [
        // [weightName, stateSetterFunction, isScoringPreference]
        ["walkReluctance", setWalkReluctance],
        ["isWheelChair", setIsWheelChair],
      ];

      for (let i of routingPreferencesToFetch) {
        const weightName = i[0];
        const setState = i[1];

        if (userData.routingPreferences.hasOwnProperty(weightName)) {
          const fetched = userData.routingPreferences[weightName];
          setState(fetched);
        } else {
          await resetRoutingPreferences();
          break;
        }
      }
    } else {
      await resetRoutingPreferences();
    }
    
  }

  useEffect(() => {
    fetchUserPreferences();
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  // For these weighted values, we need slider values since
  //  the slider stores "cumulative" values, but we need non-cumulative ones
  const [factorSliderVal, setFactorSliderVal] = useState([]);
  const [nightDaySliderVal, setNightDaySliderVal] = useState([]);
  const [nightDirectionSliderVal, setNightDirectionSliderVal] = useState([]);
  const [weekendSliderVal, setWeekendSliderVal] = useState([]);
  const [timeSliceSliderVal, setTimeSliceSliderVal] = useState([]);

  // Store the old values, so we can reset the modal when we close it
  const [oldFactorWeights, setOldFactorWeights] = useState([]);
  const [oldNightDayWeights, setOldNightDayWeights] = useState([]);
  const [oldNightDirectionWeights, setOldNightDirectionWeights] = useState([]);
  const [oldWeekendWeights, setOldWeekendWeights] = useState([]);
  const [oldTimeSliceWeights, setOldTimeSliceWeights] = useState([]);

  const [oldConsistencyImportance, setOldConsistencyImportance] = useState('');
  const [oldWorstAcceptableFrequency, setOldWorstAcceptableFrequency] = useState(0);
  const [oldWorstAcceptableDuration, setOldWorstAcceptableDuration] = useState(0);
  const [oldWalkReluctance, setOldWalkReluctance] = useState([]);
  const [oldIsWheelChair, setOldIsWheelChair] = useState(false);

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
    setOldNightDayWeights(nightDayWeights);
    setOldNightDirectionWeights(nightDirectionWeights);
    setOldWeekendWeights(weekendWeights);
    setOldTimeSliceWeights(timeSliceWeights);

    setOldConsistencyImportance(consistencyImportance);
    setOldWorstAcceptableFrequency(worstAcceptableFrequency);
    setOldWorstAcceptableDuration(worstAcceptableDuration);
    setOldWalkReluctance(walkReluctance);
    setOldIsWheelChair(isWheelChair);

    // Save the slider values too, for the ones that represent weights
    setFactorSliderVal(createCumulativeArray(factorWeights));
    setNightDaySliderVal(createCumulativeArray(nightDayWeights));
    setNightDirectionSliderVal(createCumulativeArray(nightDirectionWeights));
    setWeekendSliderVal(createCumulativeArray(weekendWeights));
    setTimeSliceSliderVal(createCumulativeArray(timeSliceWeights));

    setIsOpen(true);
  }


  function closeModal() {
    // Reset to old values
    setFactorWeights(oldFactorWeights);
    setNightDayWeights(oldNightDayWeights);
    setNightDirectionWeights(oldNightDirectionWeights);
    setWeekendWeights(oldWeekendWeights);
    setTimeSliceWeights(oldTimeSliceWeights);

    setConsistencyImportance(oldConsistencyImportance);
    setWorstAcceptableFrequency(oldWorstAcceptableFrequency);
    setWorstAcceptableDuration(oldWorstAcceptableDuration);
    setWalkReluctance(oldWalkReluctance);
    setIsWheelChair(oldIsWheelChair);

    // Reset slider values for the ones that represent weights
    setFactorSliderVal(createCumulativeArray(oldFactorWeights));
    setNightDaySliderVal(createCumulativeArray(oldNightDayWeights));
    setNightDirectionSliderVal(createCumulativeArray(oldNightDirectionWeights));
    setWeekendSliderVal(createCumulativeArray(oldWeekendWeights));
    setTimeSliceSliderVal(createCumulativeArray(oldTimeSliceWeights));

    // Close modal without saving changes
    setIsOpen(false);
  }

  // Submit user's scoring factor preferences
  const submitHandler = async (event) => {
    event.preventDefault();

    const walkReluctanceChanged = walkReluctance !== oldWalkReluctance;
    const isWheelChairChanged = isWheelChair !== oldIsWheelChair;
    const routingChanged = walkReluctanceChanged || isWheelChairChanged;

    const data = {
      factorWeights: {
        frequencyWeight: factorWeights[0],
        durationWeight: factorWeights[1]
      },
      nightDayWeights: {
        weeknightWeight: nightDayWeights[0],
        fridayNightWeight: nightDayWeights[1],
        saturdayNightWeight: nightDayWeights[2]
      },
      nightDirectionWeights: {
        toDestWeight: nightDirectionWeights[0],
        fromDestWeight: nightDirectionWeights[1]
      },
      weekendWeights: {
        saturdayWeight: weekendWeights[0],
        sundayWeight: weekendWeights[1]
      },
      timeSliceWeights: {
        rushHourWeight: timeSliceWeights[0],
        offPeakWeight: timeSliceWeights[1],
        nightWeight: timeSliceWeights[2],
        weekendWeight: timeSliceWeights[3]
      },
      scoringPreferences: {
        consistencyImportance: consistencyImportance,
        worstAcceptableFrequency: worstAcceptableFrequency,
        worstAcceptableDuration: worstAcceptableDuration
      },
      routingPreferences: {
        walkReluctance: walkReluctance,
        isWheelChair: isWheelChair
      }
    };

    if(user_id === null) {
      let preferences = JSON.parse(sessionStorage.getItem("preferences"));

      preferences.factorWeights = data;
      preferences.preferencesUpdated = true;

      sessionStorage.setItem("preferences", JSON.stringify(preferences));
    } else {
      await updateUserPreferences(data, routingChanged);
    }
    window.location.reload(false);
  };

  const handleCloseinfoPopover = () => {
    setinfoPopoverActive(false);
    setinfoPopoverName('')
  }

  const handleOpeninfoPopover = (newSetting) => {

    let markToCollapse = false;

    switch(newSetting) {
      case "accessibilitySettingsInfo":
        setinfoPopoverContent(<AccessibilitySettingsInfo handleClose={handleCloseinfoPopover} />);
        break;
      case "consistencyImportanceInfo":
        setinfoPopoverContent(<ConsistencyImportanceInfo handleClose={handleCloseinfoPopover} />);
        break;
      case "worstAcceptableCasesInfo":
        setinfoPopoverContent(<WorstAcceptableCasesInfo handleClose={handleCloseinfoPopover} />);
        break;
      case "factorInfo":
        setinfoPopoverContent(<FactorWeightsInfo handleClose={handleCloseinfoPopover} colors={factorHexColors} />);
        break;
      case "nightDayInfo":
        setinfoPopoverContent(<NightDayWeightsInfo handleClose={handleCloseinfoPopover} colors={nightDayHexColors} />);
        break;
      case "nightDirectionInfo":
        setinfoPopoverContent(<NightDirectionWeightsInfo handleClose={handleCloseinfoPopover} colors={nightDirectionHexColors} />);
        break;
      case "weekendInfo":
        setinfoPopoverContent(<WeekendWeightsInfo handleClose={handleCloseinfoPopover} colors={weekendHexColors} />);
        break;
      case "timeSliceInfo":
        setinfoPopoverContent(<TimeSliceWeightsInfo handleClose={handleCloseinfoPopover} colors={timeSliceHexColors} />);
        break;
      default:
        setinfoPopoverContent(null);
        setinfoPopoverName('');
        markToCollapse = true;
        break;
    }

    if (markToCollapse || newSetting === infoPopoverName) {
      handleCloseinfoPopover();
    } else {
      setinfoPopoverActive(true);
      setinfoPopoverName(newSetting);
    }
  }


  return (
    <>
      <div>
        <button onClick={openModal} type="button" className={buttonClass}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
               stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
          </svg>
          Edit Scoring Factors
        </button>
      </div>

      <Dialog
        open={isOpen}
        onClose={closeModal}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(8px)'
          }
        }}
      >
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div
              className="w-full absolute top-4 max-w-md z-10 transition-transform duration-300 overflow-hidden rounded-2xl bg-gradient-to-br from-white to-emerald-50 dark:from-emerald-900 dark:to-emerald-dark p-6 text-left align-middle shadow-xl"
              style={infoPopoverActive ? {
                transform: 'translate(calc(-50% - 0.5rem))'
              } : {
                transform: 'translate(0)'
              }}>
              <div className="flex justify-between gap-2 pb-1">
                <DialogTitle
                  as="h3"
                  className="text-3xl font-semibold leading-snug text-transparent bg-clip-text bg-gradient-to-r from-emerald-900 to-emerald-dark dark:from-white dark:to-emerald-100 flex items-center"
                  sx={{ p: 0 }}
                >
                  Edit scoring factors
                </DialogTitle>
              </div>

              <hr className="mb-8 dark:border-emerald-700"></hr>

              <div>
                <Accordion className="rounded-t-xl">
                  <AccordionSummary infoPopover={() => {handleOpeninfoPopover("accessibilitySettingsInfo")}}>
                    <span>Accessibility Settings</span>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="flex flex-col gap-4">
                      <WalkReluctance state={[walkReluctance, setWalkReluctance]}/>
                      <IsWheelChair state={[isWheelChair, setIsWheelChair]}/>
                    </div>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary infoPopover={() => {handleOpeninfoPopover("consistencyImportanceInfo")}}>
                    <span>Consistency Importance</span>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ConsistencyImportance state={[consistencyImportance, setConsistencyImportance]}/>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary infoPopover={() => {handleOpeninfoPopover("worstAcceptableCasesInfo")}}>
                    <span>Worst Acceptable Cases</span>
                  </AccordionSummary>
                  <AccordionDetails>
                    <WorstAcceptableCases
                      freqState={[worstAcceptableFrequency, setWorstAcceptableFrequency]}
                      durState={[worstAcceptableDuration, setWorstAcceptableDuration]}
                    />
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary infoPopover={() => {handleOpeninfoPopover("factorInfo")}}>
                    <span>Core Scoring Factor Weights</span>
                  </AccordionSummary>
                  <AccordionDetails>
                    <CoreFactorWeights
                      valueState={[factorWeights, setFactorWeights]}
                      sliderState={[factorSliderVal, setFactorSliderVal]}
                    />
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary infoPopover={() => {handleOpeninfoPopover("nightDayInfo")}}>
                    <span>Night Day Weights</span>
                  </AccordionSummary>
                  <AccordionDetails>
                    <NightDayWeights
                      valueState={[nightDayWeights, setNightDayWeights]}
                      sliderState={[nightDaySliderVal, setNightDaySliderVal]}
                    />
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary infoPopover={() => {handleOpeninfoPopover("nightDirectionInfo")}}>
                    <span>Night Direction Weights</span>
                  </AccordionSummary>
                  <AccordionDetails>
                    <NightDirectionWeights
                      valueState={[nightDirectionWeights, setNightDirectionWeights]}
                      sliderState={[nightDirectionSliderVal, setNightDirectionSliderVal]}
                    />
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary infoPopover={() => {handleOpeninfoPopover("weekendInfo")}}>
                    <span>Weekend Day Weights</span>
                  </AccordionSummary>
                  <AccordionDetails>
                    <WeekendWeights
                      valueState={[weekendWeights, setWeekendWeights]}
                      sliderState={[weekendSliderVal, setWeekendSliderVal]}
                    />
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary infoPopover={() => {handleOpeninfoPopover("timeSliceInfo")}}>
                    <span>Time Period Weights</span>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TimeSliceWeights
                      valueState={[timeSliceWeights, setTimeSliceWeights]}
                      sliderState={[timeSliceSliderVal, setTimeSliceSliderVal]}
                    />
                  </AccordionDetails>
                </Accordion>
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
                <button
                  type="button"
                  onClick={resetAllFactors}
                  className="px-4 py-2 flex items-center gap-2 justify-center transition ease-in-out duration-200 text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                       stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
                  </svg>
                  Reset All
                </button>
                <ConfirmDialog
                  open={resetDialogOpen}
                  setOpen={setResetDialogOpen}
                  onConfirm={handleResetAllFactors}
                  >
                  Reset all scoring factor settings to defaults?
                </ConfirmDialog>

              </div>
            </div>
            <div
              className="w-full max-w-md fixed z-0 top-4 transition-transform duration-300 overflow-hidden rounded-2xl bg-gradient-to-br from-white to-emerald-50 dark:from-emerald-900 dark:to-emerald-dark p-6 text-left align-middle shadow-xl"
              style={infoPopoverActive ? {
                transform: 'translate(calc(50% + 0.5rem))'
              } : {
                transform: 'translate(0)'
              }}
            >
              { infoPopoverContent }
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}

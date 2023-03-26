import React, {useEffect, useState} from "react";
import ProportionalSlider from "./custom/ProportionalSlider";
import axios from "axios";
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
import BoxConicGradientDisplay from "./custom/BoxConicGradientDisplay";
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
import SteppedSlider from "./custom/SteppedSlider";
import {Dialog, DialogTitle, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {
  FactorWeightsInfo,
  NightDayWeightsInfo,
  NightDirectionWeightsInfo,
  TimeSliceWeightsInfo,
  WeekendWeightsInfo
} from "./InfoPopovers";


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




async function updateUserPreferences(data, scoring) {
  const currentDate = Date.now();

  data._id = mongoose.Types.ObjectId(user_id);
  if (scoring) {
    data.lastScoringPrefChangeTime = currentDate;
  } else {
    data.lastRoutingPrefChangeTime = currentDate;
  }

  return await axios
    .post("http://localhost:5000/modifyUserByID", data)
    .catch((error) => {
      console.log(error.message);
    });
}

export default function EditScoringFactors(props) {
  const [factorWeights, setFactorWeights] = useState([]);
  const [nightDayWeights, setNightDayWeights] = useState([]);
  const [nightDirectionWeights, setNightDirectionWeights] = useState([]);
  const [weekendWeights, setWeekendWeights] = useState([]);
  const [timeSliceWeights, setTimeSliceWeights] = useState([]);
  const [consistencyImportance, setConsistencyImportance] = useState([]);
  const [worstAcceptableFrequency, setWorstAcceptableFrequency] = useState([]);
  const [worstAcceptableDuration, setWorstAcceptableDuration] = useState([]);
  const [walkReluctance, setWalkReluctance] = useState([]);
  const [isWheelChair, setIsWheelChair] = useState([]);


  const [infoPopoverActive, setInfoPopoverActive] = useState(false);
  const [infoPopoverName, setInfoPopoverName] = useState(null);
  const [infoPopoverContent, setInfoPopoverContent] = useState(null);

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
    }

    else {
      // Get the weighted average scores
      const response = await axios.get(`http://localhost:5000/userById/${user_id}`);
      const userData = response.data[0];

      const weightsToFetch = [
        // [converterFunction, weightName, stateSetterFunction, defaultWeights]
        [convertUserFactorWeightsToArr, "factorWeights", setFactorWeights, defaultUserFactorWeights],
        [convertUserNightDayWeightsToArr, "nightDayWeights", setNightDayWeights, defaultUserNightDayWeights],
        [convertUserNightDirectionWeightsToArr, "nightDirectionWeights", setNightDirectionWeights, defaultUserNightDirectionWeights],
        [convertUserWeekendWeightsToArr, "weekendWeights", setWeekendWeights, defaultUserWeekendWeights],
        [convertUserTimeSliceWeightsToArr, "timeSliceWeights", setTimeSliceWeights, defaultUserTimeSliceWeights],
      ]

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
          await updateUserPreferences({[weightName]: defaults}, true);
          setState(convert(defaults));
        }
      }

      const scoringAndRoutingPreferencesToFetch = [
        // [weightName, stateSetterFunction, isScoringPreference]
        ["consistencyImportance", setConsistencyImportance, true],
        ["worstAcceptableFrequency", setWorstAcceptableFrequency, true],
        ["worstAcceptableDuration", setWorstAcceptableDuration, true],
        ["walkReluctance", setWalkReluctance, false],
        ["isWheelChair", setIsWheelChair, false],
      ]

      for (let i of scoringAndRoutingPreferencesToFetch) {
        const weightName = i[0];
        const setState = i[1];
        const isScoringPreference = i[2]

        const defaults = isScoringPreference ? defaultUserScoringPreferences : defaultUserRoutingPreferences;

        if (userData.hasOwnProperty(weightName)) {
          const fetched = userData[weightName];
          setState(fetched);
        } else {
          await updateUserPreferences({[weightName]: defaults[weightName]}, isScoringPreference);
          setState(defaults[weightName]);
        }
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

  const [oldConsistencyImportance, setOldConsistencyImportance] = useState([]);
  const [oldWorstAcceptableFrequency, setOldWorstAcceptableFrequency] = useState([]);
  const [oldWorstAcceptableDuration, setOldWorstAcceptableDuration] = useState([]);
  const [oldWalkReluctance, setOldWalkReluctance] = useState([]);
  const [oldIsWheelChair, setOldIsWheelChair] = useState([]);

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

    if(user_id === null) {
      let preferences = JSON.parse(sessionStorage.getItem("preferences"));

      // TODO: Save ALL data
      preferences.factorWeights = factorWeights;

      sessionStorage.setItem("preferences", JSON.stringify(preferences));
    } else {
      const data = {
        factorWeights: {
          frequencyWeight: factorWeights[0],
          durationWeight: factorWeights[1]
        }
      };
      await updateUserPreferences(data);
    }
    window.location.reload(false);
  };

  const handleConsistencyImportance = (event, newValue) => {
    if (newValue !== null) {
      setConsistencyImportance(newValue);
    }
  };

  const handleOpenInfoPopover = (newSetting) => {

    let markToCollapse = false;

    switch(newSetting) {
      case "factorInfo":
        setInfoPopoverContent(<FactorWeightsInfo colors={[color1, color2]} />);
        break;
      case "nightDayInfo":
        setInfoPopoverContent(<NightDayWeightsInfo colors={[color1, color2, color3]} />);
        break;
      case "nightDirectionInfo":
        setInfoPopoverContent(<NightDirectionWeightsInfo colors={[color1, color2]} />);
        break;
      case "weekendInfo":
        setInfoPopoverContent(<WeekendWeightsInfo colors={[color1, color2]} />);
        break;
      case "timeSliceInfo":
        setInfoPopoverContent(<TimeSliceWeightsInfo colors={[color1, color2, color3, color4]} />);
        break;
      default:
        setInfoPopoverContent(null);
        setInfoPopoverName('');
        markToCollapse = true;
        break;
    }

    if (markToCollapse || newSetting === infoPopoverName) {
      setInfoPopoverActive(false);
      setInfoPopoverName('')
    } else {
      setInfoPopoverActive(true);
      setInfoPopoverName(newSetting);
    }
  }


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

      <Dialog open={isOpen} onClose={closeModal}
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
              className="w-full max-w-md z-10 transition-transform duration-300 overflow-hidden rounded-2xl bg-gradient-to-br from-white to-emerald-50 dark:from-emerald-900 dark:to-emerald-dark p-6 text-left align-middle shadow-xl"
              style={infoPopoverActive ? {
                transform: 'translate(calc(-50% - 0.5rem))'
              } : {
                transform: 'translate(0)'
              }}
            >
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
              <div className="flex flex-col gap-8">
                <div className="rounded-xl bg-emerald-darkest flex items-center justify-center">
                  <ToggleButtonGroup
                    value={consistencyImportance}
                    exclusive
                    onChange={handleConsistencyImportance}
                    aria-label="consistency importance"
                    sx={{
                      '& .MuiToggleButtonGroup-root': {
                        width: '100%',
                      },
                      '& .MuiToggleButtonGroup-grouped': {
                        height: '2.5rem',
                        margin: "0.125rem 0.125rem",
                        color: "black",
                        backgroundColor: "#999",
                        '&.Mui-selected': {
                          backgroundColor: "#eee",
                          '&:hover, & .Mui-active': {
                            backgroundColor: "#fff"
                          },
                        },
                        '&:hover, & .Mui-active': {
                          backgroundColor: "#fff"
                        },
                        '& .MuiTouchRipple-child': {
                          backgroundColor: '#10b981'
                        },
                      },
                    }}
                  >
                    <ToggleButton value="moreConsistent" aria-label="left aligned">
                      <span>Consistent</span>
                    </ToggleButton>
                    <ToggleButton value="balanced" aria-label="centered">
                      <span>Balanced</span>
                    </ToggleButton>
                    <ToggleButton value="betterAverages" aria-label="right aligned">
                      <span>Max Average</span>
                    </ToggleButton>
                  </ToggleButtonGroup>
                </div>

                <div>
                  <SteppedSlider
                    state={[worstAcceptableFrequency, setWorstAcceptableFrequency]}
                    step={15}
                    min={15}
                    max={180}
                  />
                </div>

                <div>
                  <SteppedSlider
                    state={[worstAcceptableDuration, setWorstAcceptableDuration]}
                    step={15}
                    min={15}
                    max={180}
                  />
                </div>

                <div>
                  <SteppedSlider
                    state={[walkReluctance, setWalkReluctance]}
                    step={1}
                    min={1}
                    max={9}
                  />
                </div>

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
                  <button onClick={() => {handleOpenInfoPopover("factorInfo")}}>Show help</button>
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
                  <button onClick={() => {handleOpenInfoPopover("nightDayInfo")}}>Show help</button>
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
                  <button onClick={() => {handleOpenInfoPopover("nightDirectionInfo")}}>Show help</button>
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
                  <button onClick={() => {handleOpenInfoPopover("weekendInfo")}}>Show help</button>
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
                    twoCols={true}
                  />
                  <button onClick={() => {handleOpenInfoPopover("timeSliceInfo")}}>Show help</button>
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

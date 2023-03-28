import {alpha, FormControlLabel, FormGroup, ToggleButton, ToggleButtonGroup} from "@mui/material";
import React from "react";
import {styled} from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import SteppedSlider from "./custom/SteppedSlider";
import ProportionalSlider from "./custom/ProportionalSlider";
import BoxConicGradientDisplay from "./custom/BoxConicGradientDisplay";

import {ReactComponent as DurationIcon} from "./../assets/clock-regular.svg";
import {ReactComponent as FrequencyIcon} from "./../assets/table-solid.svg";
import {ReactComponent as WalkIcon} from "./../assets/person-walking-solid.svg";
import {ReactComponent as WeekIcon} from "./../assets/calendar-week-solid.svg";
import {ReactComponent as FridayIcon} from "./../assets/calendar-fri-solid.svg";
import {ReactComponent as SaturdayIcon} from "./../assets/calendar-sat-solid.svg";
import {ReactComponent as SundayIcon} from "./../assets/calendar-sun-solid.svg";
import {ReactComponent as ToDestIcon} from "./../assets/arrow-right-to-city-solid.svg";
import {ReactComponent as FromDestIcon} from "./../assets/arrow-left-from-city-solid.svg";


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

export const factorHexColors = [color1.hex, color2.hex];
const factorNames = ["Frequency", "Duration"];
const factorIcons = [frequencyIcon, durationIcon];

export const nightDayHexColors = [color1.hex, color2.hex, color3.hex];
const nightDayNames = ["Weeknight", "Fri. Night", "Sat. Night"];
const nightDayIcons = [weekIcon, friIcon, satIcon]

export const nightDirectionHexColors = [color1.hex, color2.hex];
const nightDirectionNames = ["Towards Dest", "From Dest"];
const nightDirectionIcons = [toDestIcon, fromDestIcon];

export const weekendHexColors = [color1.hex, color2.hex];
const weekendNames = ["Saturday", "Sunday"];
const weekendIcons = [satIcon, sunIcon];

export const timeSliceHexColors = [color1.hex, color2.hex, color3.hex, color4.hex];
const timeSliceNames = ["Rush Hour", "Off-Peak", "Overnight", "Weekend"];
const timeSliceIcons = []

const isDark = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;


export const Accordion = styled((props) => (
  <MuiAccordion elevation={0} square {...props} />
))(({ theme }) => ({
  color:
    isDark
      ? '#ffffff'
      : '#000000',
  backgroundColor:
    isDark
      ? '#111111'
      : '#aaaaaa',
  border:
    isDark
      ? '1px solid #222'
      : '1px solid #999',
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
  '&:first-of-type': {
    borderTopLeftRadius: '0.75rem',
    borderTopRightRadius: '0.75rem',
    '& .MuiAccordionSummary-root': {
      borderTopLeftRadius: '0.75rem',
      borderTopRightRadius: '0.75rem',
    },
  },
  '&:last-child': {
    borderBottomLeftRadius: '0.75rem',
    borderBottomRightRadius: '0.75rem',
    '& .MuiAccordionSummary-root:not(.Mui-expanded)': {
      borderBottomLeftRadius: '0.75rem',
      borderBottomRightRadius: '0.75rem',
    },
  },
}));


export const AccordionSummary = styled((props) => {
  const { infoPopover, ...rest } = props;
  function showInfoPopover(event) {
    event.stopPropagation();
    infoPopover();
  }
  return (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{fontSize: '0.9rem', color: '#fff'}}/>}
    {...rest}
  >
    <div className="flex w-full ml-4 justify-between items-center">
      {props.children}
      <button
        type="button"
        onClick={showInfoPopover}
        className="z-10 z-10 w-8 h-8 flex items-center gap-2 justify-center transition ease-in-out duration-200 text-white bg-emerald-200 focus:ring-4 focus:ring-emerald-300 text-emerald-800 hover:bg-white font-semibold rounded-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
             className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
        </svg>

      </button>
    </div>

  </MuiAccordionSummary>
)
})(({ theme }) => ({
  backgroundColor:
    isDark
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
}));

export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: '1rem',
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));


const StyledSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-track': {
    backgroundColor: '#fff',
  },
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#34d399',
    '&:hover': {
      backgroundColor: alpha('#34d399', theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#34d399',
  },
}));

export function WalkReluctance({state}) {
  const walkReluctance = state[0];
  const setWalkReluctance = state[1];

  return (
    <div>
      <span>Walk Reluctance: {walkReluctance}</span>
      <div>
        <SteppedSlider
          state={[walkReluctance, setWalkReluctance]}
          step={1}
          min={1}
          max={9}
        />
      </div>
    </div>
  );
}

export function IsWheelChair({state}) {
  const isWheelChair = state[0];
  const setIsWheelChair = state[1];

  const handleChange = (e) => {
    e.stopPropagation();
    setIsWheelChair(!isWheelChair);
  }

  return (
    <FormControlLabel
      control={<StyledSwitch checked={isWheelChair} onChange={handleChange} />}
      label="Wheelchair Accessible Routes"
    />
  )
}


export function ConsistencyImportance({state}) {
  const consistencyImportance = state[0];
  const setConsistencyImportance = state[1];

  const handleChange = (event, newValue) => {
    if (newValue !== null) {
      setConsistencyImportance(newValue);
    }
  };

  return (
    <div>
      <ToggleButtonGroup
        value={consistencyImportance}
        exclusive
        onChange={handleChange}
        aria-label="consistency importance"
        sx={{
          '& .MuiToggleButtonGroup-root': {
            width: '100%',
          },
          '& .MuiToggleButtonGroup-grouped': {
            height: '2.5rem',
            margin: "0.125rem 0.125rem",
            color: "black",
            lineHeight: 1.15,
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
          <span>Max Consistency</span>
        </ToggleButton>
        <ToggleButton value="balanced" aria-label="centered">
          <span>Balanced</span>
        </ToggleButton>
        <ToggleButton value="betterAverages" aria-label="right aligned">
          <span>Max Average</span>
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  )
}


export function WorstAcceptableCases({freqState, durState}) {
  const worstAcceptableFrequency = freqState[0];
  const setWorstAcceptableFrequency = freqState[1];
  const worstAcceptableDuration = durState[0];
  const setWorstAcceptableDuration = durState[1];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <span>Worst Acceptable Frequency: {worstAcceptableFrequency}</span>
        <SteppedSlider
          state={[worstAcceptableFrequency, setWorstAcceptableFrequency]}
          step={15}
          min={15}
          max={180}
        />
      </div>

      <div>
        <span>Worst Acceptable Duration: {worstAcceptableDuration}</span>
        <SteppedSlider
          state={[worstAcceptableDuration, setWorstAcceptableDuration]}
          step={15}
          min={15}
          max={180}
        />
      </div>
    </div>
  );
}

export function CoreFactorWeights({valueState, sliderState}) {
  const factorWeights = valueState[0]
  const setFactorWeights = valueState[1]
  const factorSliderVal = sliderState[0]
  const setFactorSliderVal = sliderState[1]

  return (
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
  )
}

export function NightDayWeights({valueState, sliderState}) {
  const nightDayWeights = valueState[0]
  const setNightDayWeights = valueState[1]
  const nightDaySliderVal = sliderState[0]
  const setNightDaySliderVal = sliderState[1]

  return (
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
  )
}

export function NightDirectionWeights({valueState, sliderState}) {
  const nightDirectionWeights = valueState[0]
  const setNightDirectionWeights = valueState[1]
  const nightDirectionSliderVal = sliderState[0]
  const setNightDirectionSliderVal = sliderState[1]

  return (
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
  )
}

export function WeekendWeights({valueState, sliderState}) {
  const weekendWeights = valueState[0]
  const setWeekendWeights = valueState[1]
  const weekendSliderVal = sliderState[0]
  const setWeekendSliderVal = sliderState[1]

  return (
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
  )
}

export function TimeSliceWeights({valueState, sliderState}) {
  const timeSliceWeights = valueState[0]
  const setTimeSliceWeights = valueState[1]
  const timeSliceSliderVal = sliderState[0]
  const setTimeSliceSliderVal = sliderState[1]

  return (
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
    </div>
  )
}

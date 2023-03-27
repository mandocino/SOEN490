import {alpha, FormControlLabel, FormGroup} from "@mui/material";
import React from "react";
import {styled} from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";



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
}));


export const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem', color: '#fff' }} />}
    {...props}
  >
    <div className="flex w-full ml-4 justify-between items-center">
      {props.children}
      <button
        type="button"
        onClick={(e) => {e.stopPropagation(); props.showHelp(); }}
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
))(({ theme }) => ({
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

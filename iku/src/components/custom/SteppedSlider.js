import React from "react";
import {Slider} from '@mui/material';

export default function SteppedSlider({state, step, min, max}) {
  const value = state[0];
  const setValue = state[1];

  const sliderThumbColor = '#fff'
  const sliderThumbShadow = '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';
  const sliderThumbActiveShadow = '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)';

  const sliderTrackColor = '#eee';
  const sliderRailColor = '#999';

  const sliderActiveMarkColor = '#fff';
  const sliderMarkColor = '#aaa';


  const handleChange = (event, newVal) => {
    setValue(newVal);
  };

  return (
    <>
      <Slider
        getAriaLabel={() => 'Scoring factor proportions'}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        step={step}
        marks
        min={min}
        max={max}
        sx={{
          '& .MuiSlider-track': {
            backgroundColor: sliderTrackColor,
            opacity: 1
          },
          '& .MuiSlider-rail': {
            backgroundColor: sliderRailColor,
            opacity: 1
          },
          '& .MuiSlider-mark': {
            backgroundColor: sliderMarkColor,
            height: 0.25,
            width: '1px',
            '&.MuiSlider-markActive': {
              opacity: 1,
              backgroundColor: sliderActiveMarkColor,
            },
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
    </>
  )
}

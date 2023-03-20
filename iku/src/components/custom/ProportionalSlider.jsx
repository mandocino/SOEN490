import React from "react";
import {Slider} from '@mui/material';

export default function ProportionalSlider({sliderState, valueState, sliderColors, minDistance=5, maxValue=100}) {
  const sliderVal = sliderState[0];
  const setSliderVal = sliderState[1];
  const values = valueState[0];
  const setValues = valueState[1];

  const sliderThumbColor = '#fff'
  const sliderThumbShadow = '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';
  const sliderThumbActiveShadow = '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)';
  const numThumbs = sliderVal.length;

  let sliderColorClass;

  const setSliderColor = (values) => {
    sliderColorClass = `${sliderColors[0]} ${values[0]}%, `;
    if (numThumbs > 1) {
      for (let i=1; i<numThumbs; i++) {
        sliderColorClass += `${sliderColors[i]} ${values[i-1]}%, ${sliderColors[i]} ${values[i-1]+values[i]}%, `
      }
      sliderColorClass += `${sliderColors[numThumbs]} ${values[numThumbs-1]+values[numThumbs-2]}%`;
    } else {
      sliderColorClass += `${sliderColors[1]} ${values[0]}%`;
    }
  }

  setSliderColor(values);


  const handleChange = (event, newSliderVal, activeThumb) => {
    if (!Array.isArray(newSliderVal)) {
      return;
    }

    const correctChangedValue = (values, index) => {
      if (numThumbs === 1) {
        if (values[0] < minDistance) {
          values[0] = minDistance;
        }

        else if (values[0] > maxValue-minDistance) {
          values[0] = maxValue-minDistance;
        }

        return values;
      }

      else {
        let toReturn;
        if (index === 0) {
          if (values[index] < minDistance) {
            values[index] = minDistance;
            toReturn = values;
          }

          else if (values[index] > maxValue-numThumbs*minDistance) {
            values[index] = maxValue - numThumbs * minDistance;
            if (values[index+1] - values[index] < minDistance) {
              values[index+1] = values[index]+minDistance;
            }
            toReturn = correctChangedValue(values, index+1);
          }

          else if (values[index+1]-values[index] < minDistance) {
            values[index+1] = values[index]+minDistance;
            toReturn = correctChangedValue(values, index+1);
          }

          else {
            toReturn = values
          }
        }

        else if (index < numThumbs-1) {
          if (values[index] - values[index-1] < minDistance) {
            if (values[index] >= minDistance*(index+1)) {
              values[index-1] = values[index]-minDistance;
              toReturn = correctChangedValue(values, index-1);
            } else {
              values[index] = minDistance*(index+1)
              if (values[index] - values[index-1] < minDistance) {
                values[index-1] = values[index]-minDistance;
              }
              toReturn = correctChangedValue(values, index-1);
            }
          }

          else if (values[index+1] - values[index] < minDistance) {
            if (values[index] <= (numThumbs-index-1)*minDistance) {
              values[index+1] = values[index]+minDistance;
              toReturn = correctChangedValue(values, index+1);
            } else {
              values[index] = (numThumbs-index-1)*minDistance;
              if (values[index+1] - values[index] < minDistance) {
                values[index+1] = values[index]+minDistance;
              }
              toReturn = correctChangedValue(values, index+1);
            }
          }

          else {
            toReturn = values;
          }
        }

        else if (index === numThumbs-1) {
          if (values[index] > maxValue-minDistance) {
            values[index] = maxValue-minDistance;
            toReturn = values;
          }

          else if (values[index] < (numThumbs*minDistance)) {
            values[index] = numThumbs*minDistance;
            if (values[index] - values[index-1] < minDistance) {
              values[index-1] = values[index]-minDistance;
            }
            toReturn = correctChangedValue(values, index-1);
          }

          else if (values[index] - values[index - 1] < minDistance) {
            values[index - 1] = values[index] - minDistance;
            toReturn = correctChangedValue(values, index-1);
          }

          else {
            toReturn = values;
          }
        }

        return toReturn;
      }
    }

    const correctedValues = correctChangedValue(newSliderVal, activeThumb);
    setSliderVal(correctedValues);

    // Set frequency to left value, duration to middle value, walkTime to right value
    let newValues = []
    newValues.push(sliderVal[0]);

    for (let i=1; i<numThumbs; i++) {
      newValues.push(sliderVal[i]-sliderVal[i-1]);
    }
    newValues.push(maxValue-sliderVal[numThumbs-1]);

    setValues(newValues);
    setSliderColor(sliderVal);
  };

  return (
    <>
      <Slider
        track={false}
        getAriaLabel={() => 'Scoring factor proportions'}
        value={sliderVal}
        onChange={handleChange}
        valueLabelDisplay="off"
        disableSwap
        sx={{
          '& .MuiSlider-rail': {
            background: `linear-gradient(to right, ${sliderColorClass});`,
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
    </>
  )
}
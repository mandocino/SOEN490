import React, {useState} from "react";
import CircleWithText from "../components/custom/CircleWithText";
import EditLocation from "../components/EditLocation";
import ScoreDetailModal from "./ScoreDetailModal";
import PlusIcon from "../assets/plus.png";


// Convert a hue value (in degrees) to a hex RGB representation
// Hue in this case refers to the H of an HSV value where S and V are set to 100%
export function hueToHex(hue) {
  let quotient = (hue/60>>0);
  let remainder = (hue%60/60);
  let r, g, b;

  switch(quotient) {
    case 0: // 0-59deg
      r = 255;
      g = Math.round(255*remainder);
      b = 0;
      break;
    case 1: // 60-119deg
      r = Math.round(255-255*remainder);
      g = 255;
      b = 0;
      break;
    case 2: // 120-179deg
      r = 0;
      g = 255;
      b = Math.round(255*remainder);
      break;
    case 3: // 180-239deg
      r = 0;
      g = Math.round(255-255*remainder);
      b = 255;
      break;
    case 4: // 240-299deg
      r = Math.round(255*remainder);
      g = 0;
      b = 255;
      break;
    case 5: // 300-359deg
      r = 255;
      g = 0;
      b = Math.round(255-255*remainder);
      break;
  }

  // Convert the RGB set into its hex representation
  const hex = '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');

  return hex;
}

export function calculateColorForEachScore(scores) {
  const hueLowerBound = 340;
  const hueUpperBound = 140;
  const hueDirection = 1 // 1 = CW; -1 = CCW
  let hueScale;

  // (x*i+y): x*100+y = upper bound and y = lower bound
  if (hueDirection === 1) {
    hueScale = ((hueUpperBound + 360 - hueLowerBound) % 360) / 100;
  } else {
    hueScale = ((hueLowerBound + 360 - hueUpperBound) % 360) / -100;
  }

  for (let score in scores) {
    const i = scores[score];
    let hue = (hueScale * i + hueLowerBound) % 360
    if (hue < 0) {
      hue += 360;
    }
    scores[`${score}Color`] = hueToHex(hue);
  }

  return scores;
}

export default function DashboardCard(props) {
  let scores;
  if (props.loc.scores) {
    // Deep copy of the scores from the location object
    scores = JSON.parse(JSON.stringify(props.loc.scores));
    // Append the corresponding colors to each score value (overall, rushHour, etc)
    scores = calculateColorForEachScore(scores);
  } else {
    scores = false;
  }
  return (
    <>
      <div className={`${props.className} rounded-3xl p-4 flex flex-col items-center gap-2 w-64`}>

        <div className="flex justify-between items-center gap-2 drop-shadow-lg h-full w-full">
          <div className="self-start w-8" >
              {
                props.compare &&  <button
                                    onClick={() => props.addCardToCompare(props.count)}
                                    type="button"
                                    className="w-8 h-8 flex items-center justify-center transition ease-in-out font-semibold rounded-lg text-md bg-emerald-200 focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-400 text-emerald-600 dark:text-emerald-800 hover:bg-white"
                                  >
                                    <img className="w-5 h-5" src={PlusIcon} />
                                  </button>
              }
          </div>
          <span className="font-bold text-2xl text-center text-white line-clamp-2">
            {props.children}
          </span>
          <div className="flex flex-col gap-2">
            <ScoreDetailModal originLocation={props.loc} destinations={props.destinations} nightDayWeights={props.nightDayWeights} weekendWeights={props.weekendWeights} />
            <EditLocation loc={props.loc} buttonClass="w-8 h-8 flex items-center justify-center transition ease-in-out font-semibold rounded-lg text-md bg-emerald-200 focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-400 text-emerald-600 dark:text-emerald-800 hover:bg-white"/>
          </div>

        </div>

        <div className="flex flex-col gap-2 w-44">
          {scores ? <>
            <div className="w-full flex justify-center">
              <CircleWithText size="w-24 h-24" textClass="text-5xl font-bold"
                              borderColor={scores.overallColor} textColor={scores.overallColor}>
                {scores.overall}
              </CircleWithText>
            </div>
            <div className="grid grid-cols-2 gap-2 justify-items-center">
              <div className="flex flex-col items-center justify-center gap-0.5">
                  <span className="text-white text-sm font-semibold text-center">
                    Rush
                  </span>
                <CircleWithText className="justify-self-start" size="w-16 h-16"
                                textClass="text-4xl font-semibold"
                                borderColor={scores.rushHourColor} textColor={scores.rushHourColor}>
                  {scores.rushHour}
                </CircleWithText>
              </div>

              <div className="flex flex-col items-center justify-center gap-0.5">
                  <span className="text-white text-sm font-semibold text-center">
                    Off-Peak
                  </span>
                <CircleWithText className="justify-self-end" size="w-16 h-16"
                                textClass="text-4xl font-semibold"
                                borderColor={scores.offPeakColor} textColor={scores.offPeakColor}>
                  {scores.offPeak}
                </CircleWithText>
              </div>

              <div className="flex flex-col items-center justify-center gap-0.5">
                  <span className="text-white text-sm font-semibold text-center">
                    Weekend
                  </span>
                <CircleWithText className="justify-self-start" size="w-16 h-16"
                                textClass="text-4xl font-semibold"
                                borderColor={scores.weekendColor} textColor={scores.weekendColor}>
                  {scores.weekend}
                </CircleWithText>
              </div>

              <div className="flex flex-col items-center justify-center gap-0.5">
                  <span className="text-white text-sm font-semibold text-center">
                    Night
                  </span>
                <CircleWithText className="justify-self-end" size="w-16 h-16"
                                textClass="text-4xl font-semibold"
                                borderColor={scores.overnightColor} textColor={scores.overnightColor}>
                  {scores.overnight}
                </CircleWithText>
              </div>
            </div>
          </> : <></>}
        </div>

      </div>
    </>
  );
}

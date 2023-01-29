import React from "react";
import CircleWithText from "../components/custom/CircleWithText";
import EditLocation from "../components/EditLocation";
import { Link } from "react-router-dom";

export default function DashboardCard(props) {
  function hueToHex(hue) {
    let quotient = (hue/60>>0);
    let remainder = (hue%60/60);
    let r, g, b;

    switch(quotient) {
      case 0:
        r = 255;
        g = Math.round(255*remainder);
        b = 0;
        break;
      case 1:
        r = Math.round(255-255*remainder);
        g = 255;
        b = 0;
        break;
      case 2:
        r = 0;
        g = 255;
        b = Math.round(255*remainder);
        break;
      case 3:
        r = 0;
        g = Math.round(255-255*remainder);
        b = 255;
        break;
      case 4:
        r = Math.round(255*remainder);
        g = 0;
        b = 255;
        break;
      case 5:
        r = 255;
        g = 0;
        b = Math.round(255-255*remainder);
        break;
    }
    const hex = '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');

    return hex;
  }

  let scores;

  if (props.loc.scores) {
    scores = JSON.parse(JSON.stringify(props.loc.scores));
    for (let score in scores) {
      const i = scores[score];
      // (x*i+y): x*100+y = upper bound and y = lower bound
      const hue = (1.8 * i + 330) % 360
      scores[`${score}Color`] = hueToHex(hue);
    }
  } else {
    scores = false;
  }

  return (
    <>
      <div class="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl p-4 flex flex-col items-center gap-2 w-64">

        <div class="flex justify-between items-center gap-2 drop-shadow-lg h-full">
          <span class="font-bold text-2xl text-center text-white line-clamp-2">
            {props.children}
          </span>
          <div class="flex flex-col gap-2">
            <Link to="/" class="transition ease-in-out duration-200 rounded-lg">
              <button type="button" class="w-8 h-8 flex items-center justify-center transition ease-in-out font-semibold rounded-lg text-md bg-emerald-200 focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-400 text-emerald-600 dark:text-emerald-800 hover:bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" class="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              </button>
            </Link>
            <EditLocation loc={props.loc} buttonClass="w-8 h-8 flex items-center justify-center transition ease-in-out font-semibold rounded-lg text-md bg-emerald-200 focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-400 text-emerald-600 dark:text-emerald-800 hover:bg-white"/>
          </div>

        </div>

        <div class="flex flex-col gap-2 w-44">
          {scores ? <>
            <div class="w-full flex justify-center">
              <CircleWithText class="drop-shadow-xl" size="w-24 h-24" textClass="text-5xl font-bold"
                              bgColor="bg-[#0c2927]"
                              borderColor={scores.overallColor} textColor={scores.overallColor}>
                {scores.overall}
              </CircleWithText>
            </div>
            <div class="grid grid-cols-2 gap-2 justify-items-center">
              <div class="flex flex-col items-center justify-center gap-0.5">
                  <span class="text-white text-sm font-semibold text-center">
                    Rush
                  </span>
                <CircleWithText class="drop-shadow-xl justify-self-start" size="w-16 h-16"
                                textClass="text-4xl font-semibold" bgColor="bg-[#0c2927]"
                                borderColor={scores.rushHourColor} textColor={scores.rushHourColor}>
                  {scores.rushHour}
                </CircleWithText>
              </div>

              <div class="flex flex-col items-center justify-center gap-0.5">
                  <span class="text-white text-sm font-semibold text-center">
                    Off-Peak
                  </span>
                <CircleWithText class="drop-shadow-xl justify-self-end" size="w-16 h-16"
                                textClass="text-4xl font-semibold" bgColor="bg-[#0c2927]"
                                borderColor={scores.offPeakColor} textColor={scores.offPeakColor}>
                  {scores.offPeak}
                </CircleWithText>
              </div>

              <div class="flex flex-col items-center justify-center gap-0.5">
                  <span class="text-white text-sm font-semibold text-center">
                    Weekend
                  </span>
                <CircleWithText class="drop-shadow-xl justify-self-start" size="w-16 h-16"
                                textClass="text-4xl font-semibold" bgColor="bg-[#0c2927]"
                                borderColor={scores.weekendColor} textColor={scores.weekendColor}>
                  {scores.weekend}
                </CircleWithText>
              </div>

              <div class="flex flex-col items-center justify-center gap-0.5">
                  <span class="text-white text-sm font-semibold text-center">
                    Night
                  </span>
                <CircleWithText class="drop-shadow-xl justify-self-end" size="w-16 h-16"
                                textClass="text-4xl font-semibold" bgColor="bg-[#0c2927]"
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

import React, {useState} from "react";
import CircleWithText from "../components/custom/CircleWithText";
import EditLocation from "../components/EditLocation";
import ScoreDetailModal from "./ScoreDetailModal";
import {listOfScores} from "../backend/utils/scoring";

import {ReactComponent as HomeIcon} from "./../assets/house-solid.svg";
import markerIcon from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'

import {MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet'

// const buttonClass = "h-8 p-2 gap-2 flex items-center justify-center transition ease-in-out font-semibold rounded-lg text-md bg-emerald-200 focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-400 text-emerald-600 dark:text-emerald-800 hover:bg-white";


// Convert a hue value (in degrees) to a hex RGB representation
// Hue in this case refers to the H of an HSV value where S and V are set to 100%
export function hueToHex(hue) {
  let quotient = (hue / 60 >> 0);
  let remainder = (hue % 60 / 60);
  let r, g, b;

  switch (quotient) {
    case 0: // 0-59deg
      r = 255;
      g = Math.round(255 * remainder);
      b = 0;
      break;
    case 1: // 60-119deg
      r = Math.round(255 - 255 * remainder);
      g = 255;
      b = 0;
      break;
    case 2: // 120-179deg
      r = 0;
      g = 255;
      b = Math.round(255 * remainder);
      break;
    case 3: // 180-239deg
      r = 0;
      g = Math.round(255 - 255 * remainder);
      b = 255;
      break;
    case 4: // 240-299deg
      r = Math.round(255 * remainder);
      g = 0;
      b = 255;
      break;
    case 5: // 300-359deg
      r = 255;
      g = 0;
      b = Math.round(255 - 255 * remainder);
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

  for (let score of listOfScores) {
    const i = scores[score];
    let hue = (hueScale * i + hueLowerBound) % 360
    if (hue < 0) {
      hue += 360;
    }
    scores[`${score}Color`] = hueToHex(hue);
  }

  return scores;
}

export default function DashboardCard({className, buttonClass, loc, destinations, count, userData, compare, addCardToCompare}) {
  let scores;
  if (loc.scores) {
    // Deep copy of the scores from the location object
    scores = JSON.parse(JSON.stringify(loc.scores));
    // Append the corresponding colors to each score value (overall, rushHour, etc)
    scores = calculateColorForEachScore(scores);
  } else {
    scores = false;
  }

  const currentHomeClass = loc.current_home ? 'order-first border-2 border-amber-400' : '';
  return (
    <>
      <div className={`${className} ${currentHomeClass} flex flex-col rounded-3xl p-8 h-fit`}>
        <div>
          <span className="flex justify-between">
            <span className="flex items-center justify-center gap-2 fill-white font-bold text-2xl text-white line-clamp-2 ">
              {
                loc.current_home && <HomeIcon className="w-6 h-6" />
              }
              {loc.name}
            </span>
            {
              compare && <button
                onClick={() => addCardToCompare(count)}
                type="button"
                className={buttonClass}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                     stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/>
                </svg>

                <span>Compare</span>
              </button>
            }
          </span>

          <hr className="mt-1 mb-4 border-emerald-900"/>
        </div>
        <div className={`flex flex-col lg:flex-row flex-wrap items-center gap-8 w-full h-full`}>
          <div className="w-64 h-64">
            <MapContainer center={[loc.latitude, loc.longitude]} zoom={13}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[loc.latitude, loc.longitude]}
                      icon={new Icon({iconUrl: markerIcon, iconSize: [25, 41], iconAnchor: [12, 41]})}>
              </Marker>
            </MapContainer>
          </div>

          <div className="flex flex-col gap-4 min-h-[16rem] grow">
            <div className="w-full flex flex-col sm:flex-row flex-wrap items-center lg:items-start gap-2">
              {
                scores && <>
                  <div className="flex justify-center w-36 sm:w-fit">
                    <CircleWithText size="w-24 h-24" textClass="text-5xl font-bold"
                                    borderColor={scores.overallColor} textColor={scores.overallColor}>
                      {scores.overall}
                    </CircleWithText>
                  </div>
                  <div className="flex flex-wrap gap-2 w-36 sm:w-fit">
                    <div className="flex gap-2 justify-between sm:justify-start w-36 sm:w-fit">
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
                    </div>
                    <div className="flex justify-between sm:justify-start gap-2 w-36 sm:w-fit">
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
                  </div>
                </>
              }
            </div>

            <div className="w-full text-white h-full grow">
              <span className="font-bold">Notes:</span>
              <hr className="mb-1 border-emerald-900"/>
              {loc.notes}
            </div>

            <div className="w-full">
              <span className="w-full flex flex-row-reverse gap-2">
                <ScoreDetailModal
                  originLocation={loc}
                  destinations={destinations}
                  userData={userData}
                  buttonClass={buttonClass}
                />
                <EditLocation
                  loc={loc}
                  buttonClass={buttonClass}
                />
              </span>
            </div>
          </div>

        </div>
      </div>

    </>
  );
}

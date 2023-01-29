import React, {useState} from "react";
import CircleWithText from "../components/custom/CircleWithText";
import EditLocation from "../components/EditLocation";
import ScoreDetailModal from "./ScoreDetailModal";

export default function DashboardCard(props) {

  return (
    <>
      <div class="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl p-4 flex flex-col items-center gap-2 w-64">


        <div class="flex justify-between items-center gap-2 drop-shadow-lg h-full">
          <span class="font-bold text-2xl text-center text-white line-clamp-2">
            {props.children}
          </span>
          <div class="flex flex-col gap-2">
          <ScoreDetailModal originLocation={props.loc} destinations={props.destinations} />

            <EditLocation loc={props.loc} buttonClass="w-8 h-8 flex items-center justify-center transition ease-in-out font-semibold rounded-lg text-md bg-emerald-200 focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-400 text-emerald-600 dark:text-emerald-800 hover:bg-white"/>
          </div>
          
        </div>

        <div class="flex flex-col gap-2 w-44">
          <div class="w-full flex justify-center">
            <CircleWithText class="drop-shadow-xl" size="w-24 h-24" textClass="text-5xl font-bold" bgColor="bg-white dark:bg-teal-900" gradient="bg-gradient-to-br from-green-300 to-green-500 dark:from-white dark:to-green-400">
              99
            </CircleWithText>
          </div>
          <div class="grid grid-cols-2 gap-2 justify-items-center">
            <div class="flex flex-col items-center justify-center gap-0.5">
              <span class="text-white text-sm font-semibold text-center">
                Rush
              </span>
              <CircleWithText class="drop-shadow-xl justify-self-start" size="w-16 h-16" textClass="text-4xl font-semibold" bgColor="bg-white dark:bg-teal-900" gradient="bg-gradient-to-br from-green-300 to-green-500 dark:from-white dark:to-green-400">
                80
              </CircleWithText>
            </div>
            
            <div class="flex flex-col items-center justify-center gap-0.5">
              <span class="text-white text-sm font-semibold text-center">
                Off-Peak
              </span>
              <CircleWithText class="drop-shadow-xl justify-self-end" size="w-16 h-16" textClass="text-4xl font-semibold" bgColor="bg-white dark:bg-teal-900" gradient="bg-gradient-to-br from-yellow-200 to-yellow-500 dark:from-white dark:to-yellow-400">
                60
              </CircleWithText>
            </div>

            <div class="flex flex-col items-center justify-center gap-0.5">
              <span class="text-white text-sm font-semibold text-center">
                Weekend
              </span>
              <CircleWithText class="drop-shadow-xl justify-self-start" size="w-16 h-16" textClass="text-4xl font-semibold" bgColor="bg-white dark:bg-teal-900" gradient="bg-gradient-to-br from-orange-200 to-orange-500 dark:from-white dark:to-orange-400">
                40
              </CircleWithText>
            </div>

            <div class="flex flex-col items-center justify-center gap-0.5">
              <span class="text-white text-sm font-semibold text-center">
                Night
              </span>
              <CircleWithText class="drop-shadow-xl justify-self-end" size="w-16 h-16" textClass="text-4xl font-semibold" bgColor="bg-white dark:bg-teal-900" gradient="bg-gradient-to-br from-red-200 to-red-500 dark:from-white dark:to-red-500">
                20
              </CircleWithText>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

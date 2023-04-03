import React, {useState, Fragment} from 'react';
import CircleWithText from "./custom/CircleWithText";
import {Dialog, DialogTitle} from "@mui/material";
import {CloseButton} from "./custom/CloseButton";


const isDark = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;

const ScoreCompareModal = ({firstLocation, secondLocation, scores, show, onClose}) => {

  if (!firstLocation || !secondLocation) {
    return;
  }
  const loc1 = firstLocation.props.loc;
  const loc2 = secondLocation.props.loc;

  let firstLocationInfo = scores[loc1._id];
  let secondLocationInfo = scores[loc2._id];

  const getColor = (objectValue, compareValue) => {
    if (objectValue > compareValue)
      return "bg-green-600"
    if (objectValue === compareValue)
      return "bg-yellow-400"
    return "bg-red-600"
  }

  return (
    <>
      <Dialog
        open={show}
        onClose={onClose}
        maxWidth='md'
        fullWidth
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)'
          },
          '& .MuiDialog-paper': {
            borderRadius: '1rem',
            padding: '1.5rem',
            background: isDark
              ? 'linear-gradient(to bottom right, #0a1e1d, #0c2927)'
              : 'linear-gradient(to bottom right, #ecfdf5, #d1fae5)',
            color: isDark
              ? '#fff'
              : '#0a1e1d'
          }
        }}
      >
        {
          firstLocation &&
          <>
            <div className="flex justify-between gap-2 pb-1">
              <DialogTitle
                as="h3"
                className="text-3xl font-semibold leading-snug text-transparent bg-clip-text bg-gradient-to-r from-emerald-900 to-emerald-dark dark:from-white dark:to-emerald-100 flex items-center "
                sx={{ p: 0}}
              >
                <div className="flex">
                  <div className="inline flex flex-row">Compare</div>
                </div>
              </DialogTitle>
            </div>

            <CloseButton onClick={onClose} top={'1rem'} right={'1rem'} />
            <hr className="mb-8 dark:border-emerald-700"></hr>

            <div className="w-full flex font-bold text-2xl">
              <div className="w-full flex justify-between flex-row">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-900 to-emerald-dark dark:from-white dark:to-emerald-50">
                    {loc1.name}
                  </span>

                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-dark to-emerald-900 dark:from-emerald-50 dark:to-white">
                    {loc2.name}
                  </span>
              </div>
            </div>

            <h3 className="text-emerald-900 dark:text-white text-center"
                style={{fontSize: '21px', fontWeight: 'bold', marginLeft: '15px'}}>
              Overall
            </h3>
            <div className="flex min-w-30 mb-2" style={{height: '56px', width: '100%'}}>
              <div className="-mr-7 z-0">
                <CircleWithText
                  className="pl-3"
                  size="w-14 h-14"
                  textClass="text-lg font-bold"
                  bgColor="bg-white"
                  gradient={getColor(firstLocationInfo.overall, secondLocationInfo.overall)}
                >
                  {firstLocationInfo.overall}
                </CircleWithText>
              </div>
              <div className={getColor(firstLocationInfo.overall, secondLocationInfo.overall)}
                   style={{flexGrow: firstLocationInfo.overall}}></div>
              <div className={getColor(secondLocationInfo.overall, firstLocationInfo.overall)}
                   style={{flexGrow: secondLocationInfo.overall}}></div>
              <div className="-ml-10">
                <CircleWithText
                  className="pl-3"
                  size="w-14 h-14"
                  textClass="text-lg font-bold"
                  bgColor="bg-white"
                  gradient={getColor(secondLocationInfo.overall, firstLocationInfo.overall)}
                >
                  {secondLocationInfo.overall}
                </CircleWithText>
              </div>
            </div>

            <h3 className="text-emerald-900 dark:text-white text-center" style={{fontSize: '21px', fontWeight: 'bold', marginLeft: '15px'}}>
              Rush Hour
            </h3>
            <div className="flex min-w-30 mb-2" style={{height: '56px', width: '100%'}}>
              <div className="-mr-7 z-0">
                <CircleWithText
                  className="pl-3"
                  size="w-14 h-14"
                  textClass="text-lg font-bold"
                  bgColor="bg-white"
                  gradient={getColor(firstLocationInfo.rushHour, secondLocationInfo.rushHour)}
                >
                  {firstLocationInfo.rushHour}
                </CircleWithText>
              </div>
              <div className={getColor(firstLocationInfo.rushHour, secondLocationInfo.rushHour)}
                   style={{flexGrow: firstLocationInfo.rushHour}}></div>
              <div className={getColor(secondLocationInfo.rushHour, firstLocationInfo.rushHour)}
                   style={{flexGrow: secondLocationInfo.rushHour}}></div>
              <div className="-ml-10">
                <CircleWithText
                  className="pl-3"
                  size="w-14 h-14"
                  textClass="text-lg font-bold"
                  bgColor="bg-white"
                  gradient={getColor(secondLocationInfo.rushHour, firstLocationInfo.rushHour)}
                >
                  {secondLocationInfo.rushHour}
                </CircleWithText>
              </div>
            </div>

            <h3 className="text-emerald-900 dark:text-white text-center" style={{fontSize: '21px', fontWeight: 'bold', marginLeft: '15px'}}>
              Off Peak
            </h3>
            <div className="flex min-w-30 mb-2" style={{height: '56px', width: '100%'}}>
              <div className="-mr-7 z-0">
                <CircleWithText
                  className="pl-3"
                  size="w-14 h-14"
                  textClass="text-lg font-bold"
                  bgColor="bg-white"
                  gradient={getColor(firstLocationInfo.offPeak, secondLocationInfo.offPeak)}
                >
                  {firstLocationInfo.offPeak}
                </CircleWithText>
              </div>
              <div className={getColor(firstLocationInfo.offPeak, secondLocationInfo.offPeak)}
                   style={{flexGrow: firstLocationInfo.offPeak}}></div>
              <div className={getColor(secondLocationInfo.offPeak, firstLocationInfo.offPeak)}
                   style={{flexGrow: secondLocationInfo.offPeak}}></div>
              <div className="-ml-10">
                <CircleWithText
                  className="pl-3"
                  size="w-14 h-14"
                  textClass="text-lg font-bold"
                  bgColor="bg-white"
                  gradient={getColor(secondLocationInfo.offPeak, firstLocationInfo.offPeak)}
                >
                  {secondLocationInfo.offPeak}
                </CircleWithText>
              </div>
            </div>

            <h3 className="text-emerald-900 dark:text-white text-center"
                style={{fontSize: '21px', fontWeight: 'bold', marginLeft: '15px'}}>
              Weekend
            </h3>
            <div className="flex min-w-30 mb-2" style={{height: '56px', width: '100%'}}>
              <div className="-mr-7 z-0">
                <CircleWithText
                  className="pl-3"
                  size="w-14 h-14"
                  textClass="text-lg font-bold"
                  bgColor="bg-white"
                  gradient={getColor(firstLocationInfo.weekend, secondLocationInfo.weekend)}
                >
                  {firstLocationInfo.weekend}
                </CircleWithText>
              </div>
              <div className={getColor(firstLocationInfo.weekend, secondLocationInfo.weekend)}
                   style={{flexGrow: firstLocationInfo.weekend}}></div>
              <div className={getColor(secondLocationInfo.weekend, firstLocationInfo.weekend)}
                   style={{flexGrow: secondLocationInfo.weekend}}></div>
              <div className="-ml-10">
                <CircleWithText
                  className="pl-3"
                  size="w-14 h-14"
                  textClass="text-lg font-bold"
                  bgColor="bg-white"
                  gradient={getColor(secondLocationInfo.weekend, firstLocationInfo.weekend)}
                >
                  {secondLocationInfo.weekend}
                </CircleWithText>
              </div>
            </div>

            <h3 className="text-emerald-900 dark:text-white text-center"
                style={{fontSize: '21px', fontWeight: 'bold', marginLeft: '15px'}}>
              Overnight
            </h3>
            <div className="flex min-w-30 mb-2" style={{height: '56px', width: '100%'}}>
              <div className="-mr-7 z-0">
                <CircleWithText
                  className="pl-3"
                  size="w-14 h-14"
                  textClass="text-lg font-bold"
                  bgColor="bg-white"
                  gradient={getColor(firstLocationInfo.overnight, secondLocationInfo.overnight)}
                >
                  {firstLocationInfo.overnight}
                </CircleWithText>
              </div>
              <div className={getColor(firstLocationInfo.overnight, secondLocationInfo.overnight)}
                   style={{flexGrow: firstLocationInfo.overnight}}></div>
              <div className={getColor(secondLocationInfo.overnight, firstLocationInfo.overnight)}
                   style={{flexGrow: secondLocationInfo.overnight}}></div>
              <div className="-ml-10">
                <CircleWithText
                  className="pl-3"
                  size="w-14 h-14"
                  textClass="text-lg font-bold"
                  bgColor="bg-white"
                  gradient={getColor(secondLocationInfo.overnight, firstLocationInfo.overnight)}
                >
                  {secondLocationInfo.overnight}
                </CircleWithText>
              </div>
            </div>
          </>
        }
      </Dialog>
    </>

  )
}

export default ScoreCompareModal
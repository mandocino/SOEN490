import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from "@headlessui/react";
import CircleWithText from "./custom/CircleWithText";

const ScoreCompareModal = ({ firstLocation, secondLocation, show, onClose }) => {

    let firstLocationInfo = []
    let secondLocationInfo = []
    const setVariables = (firstLocation, secondLocation) => {
        firstLocationInfo = firstLocation.props.loc.scores;
        secondLocationInfo = secondLocation.props.loc.scores;
    }

    const getColor = (objectValue, compareValue) => {
        if (objectValue > compareValue)
            return "bg-green-600"
        if (objectValue === compareValue)
            return "bg-yellow-400"
        return "bg-red-600"
    }

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => onClose()} >
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0  bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="inline-block h-screen align-middle"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        {/* Contents of the modal */}
                        <Dialog.Panel className="inline-block w-full max-w-fit  p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-emerald-50 shadow-xl rounded-2xl">
                            { firstLocation && setVariables(firstLocation, secondLocation) }
                            {
                                firstLocation &&
                                <>
                                    <div className="flex justify-between items-center text-emerald-900 mb-5">
                                        <h2 style={{fontSize: '30px', maxWidth: '40%', marginBottom: '0px'}}>{firstLocation.props.children}</h2>
                                        <div className="bg-emerald-900" style={{minWidth: '3px', height: '40px', marginTop: '8px'}}> </div>
                                        <h2 style={{fontSize: '30px', marginBottom: '0px', maxWidth: '40%'}}>{secondLocation.props.children}</h2>
                                    </div>
                                    <div className="bg-emerald-900" style={{height: '2px', width: '100%', marginBottom: '15px'}}></div>
                                    <h3 className="text-emerald-900" style={{fontSize: '21px', fontWeight: 'bold', marginLeft: '15px'}}>Overall</h3>
                                    <div className="flex min-w-30 mb-2" style={{height: '56px', width: '500px'}}>
                                        <div className="-mr-7 z-0">
                                            <CircleWithText
                                                className="pl-3"
                                                size="w-14 h-14"
                                                textClass="text-lg font-bold"
                                                bgColor="bg-white"
                                                gradient={getColor(firstLocationInfo.overall, secondLocationInfo.overall)}
                                            >
                                                { firstLocationInfo.overall }
                                            </CircleWithText>
                                        </div>
                                        <div className={getColor(firstLocationInfo.overall, secondLocationInfo.overall)} style={{flexGrow: firstLocationInfo.overall}}></div>
                                        <div className={getColor(secondLocationInfo.overall, firstLocationInfo.overall)} style={{flexGrow: secondLocationInfo.overall}}></div>
                                        <div className="-ml-10">
                                            <CircleWithText
                                                className="pl-3"
                                                size="w-14 h-14"
                                                textClass="text-lg font-bold"
                                                bgColor="bg-white"
                                                gradient={getColor(secondLocationInfo.overall, firstLocationInfo.overall)}
                                            >
                                                { secondLocationInfo.overall }
                                            </CircleWithText>
                                        </div>
                                    </div>
                                    <h3 className="text-emerald-900" style={{fontSize: '21px', fontWeight: 'bold', marginLeft: '15px'}}>Rush Hour</h3>
                                    <div className="flex min-w-30 mb-2" style={{height: '56px', width: '500px'}}>
                                        <div className="-mr-7 z-0">
                                            <CircleWithText
                                                className="pl-3"
                                                size="w-14 h-14"
                                                textClass="text-lg font-bold"
                                                bgColor="bg-white"
                                                gradient={getColor(firstLocationInfo.rushHour, secondLocationInfo.rushHour)}
                                            >
                                                { firstLocationInfo.rushHour }
                                            </CircleWithText>
                                        </div>
                                        <div className={getColor(firstLocationInfo.rushHour, secondLocationInfo.rushHour)} style={{flexGrow: firstLocationInfo.rushHour}}></div>
                                        <div className={getColor(secondLocationInfo.rushHour, firstLocationInfo.rushHour)} style={{flexGrow: secondLocationInfo.rushHour}}></div>
                                        <div className="-ml-10">
                                            <CircleWithText
                                                className="pl-3"
                                                size="w-14 h-14"
                                                textClass="text-lg font-bold"
                                                bgColor="bg-white"
                                                gradient={getColor(secondLocationInfo.rushHour, firstLocationInfo.rushHour)}
                                            >
                                                { secondLocationInfo.rushHour }
                                            </CircleWithText>
                                        </div>
                                    </div>
                                    <h3 className="text-emerald-900" style={{fontSize: '21px', fontWeight: 'bold', marginLeft: '15px'}}>Off Peak</h3>
                                    <div className="flex min-w-30 mb-2" style={{height: '56px', width: '500px'}}>
                                        <div className="-mr-7 z-0">
                                            <CircleWithText
                                                className="pl-3"
                                                size="w-14 h-14"
                                                textClass="text-lg font-bold"
                                                bgColor="bg-white"
                                                gradient={getColor(firstLocationInfo.offPeak, secondLocationInfo.offPeak)}
                                            >
                                                { firstLocationInfo.offPeak }
                                            </CircleWithText>
                                        </div>
                                        <div className={getColor(firstLocationInfo.offPeak, secondLocationInfo.offPeak)} style={{flexGrow: firstLocationInfo.offPeak}}></div>
                                        <div className={getColor(secondLocationInfo.offPeak, firstLocationInfo.offPeak)} style={{flexGrow: secondLocationInfo.offPeak}}></div>
                                        <div className="-ml-10">
                                            <CircleWithText
                                                className="pl-3"
                                                size="w-14 h-14"
                                                textClass="text-lg font-bold"
                                                bgColor="bg-white"
                                                gradient={getColor(secondLocationInfo.offPeak, firstLocationInfo.offPeak)}
                                            >
                                                { secondLocationInfo.offPeak }
                                            </CircleWithText>
                                        </div>
                                    </div>
                                    <h3 className="text-emerald-900" style={{fontSize: '21px', fontWeight: 'bold', marginLeft: '15px'}}>Weekend</h3>
                                    <div className="flex min-w-30 mb-2" style={{height: '56px', width: '500px'}}>
                                        <div className="-mr-7 z-0">
                                            <CircleWithText
                                                className="pl-3"
                                                size="w-14 h-14"
                                                textClass="text-lg font-bold"
                                                bgColor="bg-white"
                                                gradient={getColor(firstLocationInfo.weekend, secondLocationInfo.weekend)}
                                            >
                                                { firstLocationInfo.weekend }
                                            </CircleWithText>
                                        </div>
                                        <div className={getColor(firstLocationInfo.weekend, secondLocationInfo.weekend)} style={{flexGrow: firstLocationInfo.weekend}}></div>
                                        <div className={getColor(secondLocationInfo.weekend, firstLocationInfo.weekend)} style={{flexGrow: secondLocationInfo.weekend}}></div>
                                        <div className="-ml-10">
                                            <CircleWithText
                                                className="pl-3"
                                                size="w-14 h-14"
                                                textClass="text-lg font-bold"
                                                bgColor="bg-white"
                                                gradient={getColor(secondLocationInfo.weekend, firstLocationInfo.weekend)}
                                            >
                                                { secondLocationInfo.weekend }
                                            </CircleWithText>
                                        </div>
                                    </div>
                                    <h3 className="text-emerald-900" style={{fontSize: '21px', fontWeight: 'bold', marginLeft: '15px'}}>Overnight</h3>
                                    <div className="flex min-w-30 mb-2" style={{height: '56px', width: '500px'}}>
                                        <div className="-mr-7 z-0">
                                            <CircleWithText
                                                className="pl-3"
                                                size="w-14 h-14"
                                                textClass="text-lg font-bold"
                                                bgColor="bg-white"
                                                gradient={getColor(firstLocationInfo.overnight, secondLocationInfo.overnight)}
                                            >
                                                { firstLocationInfo.overnight }
                                            </CircleWithText>
                                        </div>
                                        <div className={getColor(firstLocationInfo.overnight, secondLocationInfo.overnight)} style={{flexGrow: firstLocationInfo.overnight}}></div>
                                        <div className={getColor(secondLocationInfo.overnight, firstLocationInfo.overnight)} style={{flexGrow: secondLocationInfo.overnight}}></div>
                                        <div className="-ml-10">
                                            <CircleWithText
                                                className="pl-3"
                                                size="w-14 h-14"
                                                textClass="text-lg font-bold"
                                                bgColor="bg-white"
                                                gradient={getColor(secondLocationInfo.overnight, firstLocationInfo.overnight)}
                                            >
                                                { secondLocationInfo.overnight }
                                            </CircleWithText>
                                        </div>
                                    </div>
                                </>
                            }
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}

export default ScoreCompareModal
import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from "@headlessui/react";
import SimpleSearchBar from './SimpleSearchBar';

const ScoreCompareModal = ({ firstLocation, secondLocation, show, onClose }) => {

    const getPercentage = (one, two) => {
        return ((one / (one+two))*100).toFixed(2)
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
                            {firstLocation && console.log(firstLocation.props.loc.scores)}
                            {secondLocation && console.log(secondLocation.props.loc.scores)}
                            <p>{firstLocation && `${firstLocation.props.loc.scores.overall}\tvs\t${secondLocation.props.loc.scores.overall}`}</p>
                            <p>{firstLocation && `${firstLocation.props.loc.scores.rushHour}\tvs\t${secondLocation.props.loc.scores.rushHour}`}</p>
                            <p>{firstLocation && `${firstLocation.props.loc.scores.offPeak}\tvs\t${secondLocation.props.loc.scores.offPeak}`}</p>
                            <p>{firstLocation && `${firstLocation.props.loc.scores.weekend}\tvs\t${secondLocation.props.loc.scores.weekend}`}</p>
                            <p>{firstLocation && `${firstLocation.props.loc.scores.overnight}\tvs\t${secondLocation.props.loc.scores.overnight}`}</p>
                            {
                                firstLocation &&
                                <>
                                    <div className="flex min-w-30" style={{height: '30px', width: '300px'}}>
                                        <div className="bg-green-600" style={{flexGrow: firstLocation.props.loc.scores.overall}}>{`%${getPercentage(firstLocation.props.loc.scores.overall, secondLocation.props.loc.scores.overall)}`}</div>
                                        <div className="bg-red-600" style={{flexGrow: secondLocation.props.loc.scores.overall}}>{`%${getPercentage(secondLocation.props.loc.scores.overall, firstLocation.props.loc.scores.overall)}`}</div>
                                    </div>
                                    <div className="flex min-w-30" style={{height: '30px', width: '300px'}}>
                                        <div className="bg-green-600" style={{flexGrow: firstLocation.props.loc.scores.rushHour}}>{`%${getPercentage(firstLocation.props.loc.scores.rushHour, secondLocation.props.loc.scores.rushHour)}`}</div>
                                        <div className="bg-red-600" style={{flexGrow: secondLocation.props.loc.scores.rushHour}}>{`%${getPercentage(secondLocation.props.loc.scores.rushHour, firstLocation.props.loc.scores.rushHour)}`}</div>
                                    </div>
                                    <div className="flex min-w-30" style={{height: '30px', width: '300px'}}>
                                        <div className="bg-green-600" style={{flexGrow: firstLocation.props.loc.scores.offPeak}}>{`%${getPercentage(firstLocation.props.loc.scores.offPeak, secondLocation.props.loc.scores.offPeak)}`}</div>
                                        <div className="bg-red-600" style={{flexGrow: secondLocation.props.loc.scores.offPeak}}>{`%${getPercentage(secondLocation.props.loc.scores.offPeak, firstLocation.props.loc.scores.offPeak)}`}</div>
                                    </div>
                                    <div className="flex min-w-30" style={{height: '30px', width: '300px'}}>
                                        <div className="bg-green-600" style={{flexGrow: firstLocation.props.loc.scores.weekend}}>{`%${getPercentage(firstLocation.props.loc.scores.weekend, secondLocation.props.loc.scores.weekend)}`}</div>
                                        <div className="bg-red-600" style={{flexGrow: secondLocation.props.loc.scores.weekend}}>{`%${getPercentage(secondLocation.props.loc.scores.weekend, firstLocation.props.loc.scores.weekend)}`}</div>
                                    </div>
                                    <div className="flex min-w-30" style={{height: '30px', width: '300px'}}>
                                        <div className="bg-green-600" style={{flexGrow: firstLocation.props.loc.scores.overnight}}>{`%${getPercentage(firstLocation.props.loc.scores.overnight, secondLocation.props.loc.scores.overnight)}`}</div>
                                        <div className="bg-red-600" style={{flexGrow: secondLocation.props.loc.scores.overnight}}>{`%${getPercentage(secondLocation.props.loc.scores.overnight, firstLocation.props.loc.scores.overnight)}`}</div>
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
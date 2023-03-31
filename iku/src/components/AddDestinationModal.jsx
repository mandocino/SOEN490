import React, { Fragment } from 'react';
import { Dialog, Transition } from "@headlessui/react";

import SimpleSearchBar from './SimpleSearchBar';

const ScoreCompareModal = ({ show, onClose }) => {

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
                        <Dialog.Panel className="inline-block w-full max-w-fit overflow-hidden text-left align-middle transition-all transform bg-emerald-50 shadow-xl rounded-2xl">
                            {
                                <div className='top-4 max-w-md z-10 p-8 transition-transform duration-300 overflow-hidden bg-gradient-to-br from-white to-emerald-50 dark:from-emerald-900 dark:to-emerald-dark p-6 text-left shadow-xl'>
                                    <h2 className='pb-7 text-white' style={{fontSize: '30px', marginBottom: '0px'}}>Add Destination</h2>
                                    <div className='w-96 pb-5'>
                                        <SimpleSearchBar className='w-4/5 text-center' buttonName='Add'/>
                                    </div>
                                </div>
                            }
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}

export default ScoreCompareModal
import React, { useState, useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
        
    function DetailModal({show, closeModal, locationModel}) {
    
        const cancelButtonRef = useRef(null);
   
    
        return (
            <Transition.Root show={show}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={closeModal}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                                <Dialog.Panel className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                                    <div className="w-full bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl p-4 flex flex-col gap-2">
                                        {locationModel.name}
                                        dsfsdf
                                        sdfsdfds
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        );
    }
    
    export default DetailModal;
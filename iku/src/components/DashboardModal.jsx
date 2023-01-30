import React, { useState } from 'react';
import { Switch, Dialog, Transition } from '@headlessui/react';

import SimpleSearchBar from './SimpleSearchBar';

const DashboardModal = ({ isOpen, type,  }) => {

  const [status, setStatus] = useState(isOpen)



  return (
    <Transition appear show={isOpen}>
      <Dialog as="div" className="relative z-10" onClose={() => setStatus(!status)}>
        <h3>{`Add a new ${type}`}</h3>
        <SimpleSearchBar />
      </Dialog>
    </Transition>
  )
}

export default DashboardModal
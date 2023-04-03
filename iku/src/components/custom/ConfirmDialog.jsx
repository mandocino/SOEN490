import {Dialog, DialogActions, DialogContent, DialogContentText} from "@mui/material";
import React from "react";


export function ConfirmDialog({children, open, setOpen, onConfirm}) {
  const handleConfirm = () => {
    setOpen(false);
    onConfirm();
  }

  const handleReject = () => {
    setOpen(false);
  }

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"

      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {children}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 flex items-center gap-2 justify-center transition ease-in-out duration-200 text-white bg-emerald-500 hover:bg-emerald-700 focus:ring-4 focus:outline-none focus:ring-emerald-400 font-semibold rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                 stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Confirm
          </button>
          <button
            type="button"
            onClick={handleReject}
            className="px-4 py-2 flex items-center gap-2 justify-center transition ease-in-out duration-200 text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                 stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Cancel
          </button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
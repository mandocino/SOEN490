import {React} from "react";
import {Dialog, DialogTitle} from "@mui/material";
import SimpleSearchBar from "./SimpleSearchBar";


const isDark = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;


export default function AddDestination({state, setState}) {

  const headerSearch = document.querySelector("#header-search");
  let removedElements = []
  const closeModal = () => {
    window.location.reload();
  }

  if (state) {
    if (headerSearch) {
      removedElements.push(headerSearch)
      console.log(removedElements)
      headerSearch.remove();
    }
  }

  return (
    <Dialog
      open={state}
      onClose={closeModal}
      maxWidth='sm'
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
      {/* Contents of the modal */}
      <div className="w-full flex flex-col">
        <div className="flex justify-between gap-2 pb-1">
          <DialogTitle
            as="h3"
            className="text-3xl font-semibold leading-snug text-transparent bg-clip-text bg-gradient-to-r from-emerald-900 to-emerald-dark dark:from-white dark:to-emerald-100 flex items-center "
            sx={{ p: 0}}
          >
            <div className="flex">
              <div className="inline flex flex-row">Add Destination</div>
            </div>
          </DialogTitle>
        </div>

        <hr className="mb-8 dark:border-emerald-700"></hr>

        <div className="mt-2 text-emerald-darker dark:text-white">
          <SimpleSearchBar asDest={true} />
        </div>
      </div>
    </Dialog>
  )
}
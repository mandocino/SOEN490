import React, { useEffect , useState} from "react";
import BaseLayout from "../components/BaseLayout";
import DashboardCard from "../components/DashboardCard";
import EditLocation from "../components/EditLocation";
import axios from "axios";
import { Link } from "react-router-dom";
import { ReactComponent as DurationIcon } from "./../assets/clock-regular.svg";
import { ReactComponent as FrequencyIcon } from "./../assets/table-solid.svg";
import { ReactComponent as WalkIcon } from "./../assets/person-walking-solid.svg";



export default function Dashboard() {

  const [locations, getLocations] = useState('');

  const fetchLocations = () => {
    const user_id = localStorage.getItem("user_id");
    axios.get(`http://localhost:5000/locations/${user_id}`)
    .then((response) => {
      getLocations(response.data);
    })
    .catch(err => console.error(err));
  }

  useEffect(() => {
    fetchLocations();
  }, []);

  let origins = [];
  let originCards;
  let destinations = [];
  let destinationCards;
  let currentHome = null;

  if (locations.length > 0) {
    currentHome = locations.find(loc => loc.current_home);
    origins = locations.filter(loc => !loc.current_home && loc.origin);
    destinations = locations.filter(loc => !loc.origin);
  }

  if (destinations.length > 0) {
    destinationCards = destinations.map(function(loc){
      return (
        <div class="bg-white text-emerald-500 rounded-2xl px-4 py-2 flex justify-between items-center">
          <span class="font-semibold text-xl text-left line-clamp-2">
            {loc.name}
          </span>
          <div class="flex flex-nowrap gap-2">
            <Link to="/" class="transition ease-in-out duration-200 rounded-lg">
              <button type="button" class="w-8 h-8 flex items-center justify-center transition ease-in-out font-semibold rounded-lg text-md bg-emerald-200 focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-400 text-emerald-600 dark:text-emerald-800 hover:bg-emerald-600 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </Link>
            <EditLocation loc={loc} buttonClass="w-8 h-8 flex items-center justify-center transition ease-in-out font-semibold rounded-lg text-md bg-emerald-200 focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-400 text-emerald-600 dark:text-emerald-800 hover:bg-white"/>
          </div>
        </div>
      );
    })
  } else {
    destinationCards =
    <div class="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl p-4 flex flex-col items-center gap-2">
      <div class="flex justify-between items-center gap-2 drop-shadow-lg">
        <span class="font-bold text-2xl text-center text-white">
          No saved destinations yet.
        </span>
      </div>
    </div>;
  }
  
  if (origins.length > 0) {
    originCards = origins.map(function(loc){
      return <DashboardCard loc={loc} destinations={destinations}>{loc.name}</DashboardCard>;
    })
  } else {
    originCards =
    <div class="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl p-4 flex flex-col items-center gap-2">
      <div class="flex justify-between items-center gap-2 drop-shadow-lg">
        <span class="font-bold text-2xl text-center text-white">
          No saved locations yet.
        </span>
      </div>
    </div>;
  }

  return (
    <>
      <BaseLayout class="flex flex-col">
        <div class="w-full grow flex flex-col items-center p-8 bg-cover bg-center bg-fixed bg-[url('/src/assets/dashboard_bg.jpg')]">
          <div class="w-full flex flex-col justify-center">
            <div class="flex gap-8">
              <div class="w-96 flex flex-col gap-8 items-center">
                <div class="w-full flex flex-col items-center p-4 rounded-3xl backdrop-blur backdrop-brightness-50 p-4 gap-4">
                  <p class="text-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-50 to-emerald-200">
                    Current Home
                  </p>
                  {
                    currentHome ?
                      <>
                        <DashboardCard loc={currentHome} destinations={destinations} invert>{currentHome.name}</DashboardCard>
                      </>
                      :
                      <div class="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl p-4 flex flex-col items-center gap-2 w-64">
                        <div class="flex justify-between items-center gap-2 drop-shadow-lg">
                          <span class="font-bold text-2xl text-center text-white">
                            No specified current home.
                          </span>
                        </div>
                      </div>
                  }
                </div>
                
                <div class="w-96 h-fit flex flex-col items-center rounded-3xl backdrop-blur backdrop-brightness-50 p-4 gap-4">
                  <span class="flex items-center gap-2">
                    <p class="text-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-50 to-emerald-200">
                      Priorities List
                    </p>
                  </span>

                  <div class="w-full bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl p-4 flex flex-col gap-2">
                    <div class="bg-white font-semibold text-2xl text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                      <span>1. Frequency</span>
                      <FrequencyIcon class="fill-emerald-500 w-6 h-6"/>
                    </div>

                    <div class="bg-white font-semibold text-2xl text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                      <span>2. Duration</span>
                      <DurationIcon class="fill-emerald-500 w-6 h-6"/>
                    </div>

                    <div class="bg-white font-semibold text-2xl text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                      <span>3. Walk Time</span>
                      <WalkIcon class="fill-emerald-500 w-6 h-6"/>
                    </div>
                  </div>

                  <Link to="/" class="transition ease-in-out duration-200 rounded-lg font-bold text-2xl">
                    <button type="button" class="w-full flex items-center justify-start gap-2 transition ease-in-out font-semibold rounded-2xl text-md bg-emerald-200 focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-400 text-emerald-600 dark:text-emerald-800 hover:bg-white px-4 py-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                      Edit Frequencies
                    </button>
                  </Link>
                </div>
                
              </div>
              <div class="grow h-fit flex flex-col rounded-3xl backdrop-blur backdrop-brightness-50 p-4 gap-4">
                <p class="text-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-50 to-emerald-200">
                  Added Homes
                </p>
                <div class="grid grid-cols-[repeat(auto-fit,16rem)] justify-center gap-8 h-fit">
                  {originCards}
                </div>
              </div>
              
              <div class="w-96 h-fit flex flex-col items-center rounded-3xl backdrop-blur backdrop-brightness-50 p-4 gap-4">
                <p class="text-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-50 to-emerald-200">
                  Added Destinations
                </p>
                <div class="w-full bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl p-4 flex flex-col gap-2">
                  {destinationCards}
                </div>

                <Link to="/" class="transition ease-in-out duration-200 rounded-lg font-bold text-2xl">
                  <button type="button" class="w-full flex items-center justify-start gap-2 transition ease-in-out font-semibold rounded-2xl text-md bg-emerald-200 focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-400 text-emerald-600 dark:text-emerald-800 hover:bg-white px-4 py-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Add Destination
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    </>
  );
}

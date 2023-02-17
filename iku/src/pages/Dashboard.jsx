import React, {useEffect, useState, useRef} from "react";
import BaseLayout from "../components/BaseLayout";
import DashboardCard from "../components/DashboardCard";
import EditLocation from "../components/EditLocation";
import axios from "axios";
import {Link} from "react-router-dom";
import {ReactComponent as DurationIcon} from "./../assets/clock-regular.svg";
import {ReactComponent as FrequencyIcon} from "./../assets/table-solid.svg";
import {ReactComponent as WalkIcon} from "./../assets/person-walking-solid.svg";
import {getNonLoggedInUsersScores, loadScores} from "../backend/utils/scoring";
import EditScoringFactors from "../components/EditScoringFactors";
import mongoose from "mongoose";


export default function Dashboard() {

  const user_id = localStorage.getItem("user_id");
  const [locations, getLocations] = useState([]);
  const [rawOrigins, setRawOrigins] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [rawCurrentHome, setRawCurrentHome] = useState([]);
  const [currentHome, setCurrentHome] = useState(false);
  const [destinations, setDestinations] = useState([]);

  const [frequency, setFrequency] = useState(80);
  const [duration, setDuration] = useState(15);
  const [walkTime, setWalkTime] = useState(5);

  const locationsLoaded = useRef(false);
  const locationsSplit = useRef(false);

  const frequencyColor = {bgGradient: 'bg-gradient-to-br from-sky-500 to-sky-400', text: 'text-sky-400', hex: '#38bdf8'};
  const durationColor = {bgGradient: 'bg-gradient-to-br from-purple-500 to-purple-400', text: 'text-purple-400', hex: '#c084fc'};
  const walkTimeColor = {bgGradient: 'bg-gradient-to-br from-pink-500 to-pink-400', text: 'text-pink-400', hex: '#f472b6'};

  const dashboardElementClass = "rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-500 dark:from-emerald-900 dark:to-emerald-dark p-4";
  const dashboardElementButtonClass = "w-full flex items-center justify-start gap-2 transition ease-in-out duration-200 rounded-lg text-2xl font-semibold rounded-2xl text-md bg-emerald-200 focus:ring-4 focus:ring-emerald-300 dark:focus:ring-emerald-400 text-emerald-800 dark:text-emerald-dark hover:bg-white px-4 py-2";
  const dashboardElementButtonClass2 = "w-8 h-8 flex items-center justify-center transition ease-in-out font-semibold rounded-lg text-md bg-emerald-500 dark:bg-emerald-200 focus:ring-4 focus:ring-emerald-300 dark:focus:ring-emerald-400 text-white dark:text-emerald-dark hover:bg-emerald-700 dark:hover:bg-white";
  const dashboardInnerElementGradientClass = "bg-gradient-to-br from-emerald-900 to-emerald-darker dark:from-emerald-darker dark:to-black rounded-3xl";

  let originCards;
  let destinationCards;

  // Fetch user's preferred scoring priorities
  const fetchScoringFactors = async () => {

    // Get the weighted average scores
    const response = await axios.get(`http://localhost:5000/userById/${user_id}`);
    const userData = response.data[0];

    let userFrequency = userData.frequency_priority;
    let userDuration = userData.duration_priority;
    let userWalkTime = userData.walk_priority;

    if (userFrequency + userDuration + userWalkTime !== 100) {
      const currentDate = Date.now();

      await axios
        .post("http://localhost:5000/modifyUserByID", {
          _id: mongoose.Types.ObjectId(user_id),
          duration_priority: 20,
          frequency_priority: 70,
          walk_priority: 10,
          lastPrefChangeTime: currentDate
        })
        .catch((error) => {
          console.log(error.message);
        });

      setFrequency(70);
      setDuration(20);
      setWalkTime(10);
    } else {
      setFrequency(userFrequency);
      setDuration(userDuration);
      setWalkTime(userWalkTime);
    }
  }

  // Fetch all locations from the DB
  const fetchLocations = () => {
    const user_id = localStorage.getItem("user_id");

    if (user_id == null) {
      let locationStringArray = sessionStorage.getItem('location')
      if (locationStringArray != null) {
        let locationArray = JSON.parse(locationStringArray);
        getLocations(locationArray);
      }
    } else {
      axios.get(`http://localhost:5000/locations/${user_id}`)
        .then((response) => {
          getLocations(response.data);
        })
        .catch(err => console.error(err));
    }
    locationsLoaded.current = true;
  }

  // Split the fetched locations into three: the current home, the other origins, and the destinations
  const splitLocations = () => {
    if (locations.length > 0) {
      setRawCurrentHome(locations.find(loc => loc.current_home));
      setRawOrigins(locations.filter(loc => !loc.current_home && loc.origin));
      setDestinations(locations.filter(loc => !loc.origin));
    }
    locationsSplit.current = true;
  }

  // Fetch the scores for all origins except the current home
  const fetchScores = async () => {

    // Get the weighted average scores
    async function getScores(origin) {
      return await loadScores(origin, null, user_id);
    }

    // Get the individual scores related to each destination
    function getDetailedScores(origin) {
      let detailedScores = [];

      if(user_id != null) {
        for (const d of destinations) {
          loadScores(origin, d, user_id).then((r) => {
            detailedScores.push(r)
          });
        }
      } else {
        let score;
        for (const d of destinations) {
          score = getNonLoggedInUsersScores(origin, d);
          detailedScores.push(score);
        }
      }

      return detailedScores;
    }

    let originsWithScores;
    // Map all scores and set `origins` to it
    if(user_id != null) {
      originsWithScores = await Promise.all(rawOrigins.map(async o => ({
        ...o, scores: await getScores(o), detailedScores: getDetailedScores(o)
      })));
    } else {
      originsWithScores = rawOrigins.map(o => ({
        ...o, scores: getNonLoggedInUsersScores(o), detailedScores: getDetailedScores(o)
      }))
    }
    // Set origins to include the scores
    setOrigins(originsWithScores);

    // Map scores to current home
    setCurrentHome({
      ...rawCurrentHome, scores: await getScores(rawCurrentHome), detailedScores: getDetailedScores(rawCurrentHome)
    });
  }

  // Fetch the locations from the DB
  useEffect(() => {
    fetchLocations();
  }, []);

  // Split the fetched locations
  useEffect(() => {
    if (locationsLoaded.current) {
      splitLocations();
    }
  }, [locations]);

  // Fetch the origins' scores from the DB
  useEffect(() => {
    if (locationsSplit.current) {
      fetchScores();
    }
  }, [rawOrigins, rawCurrentHome, destinations]);

  useEffect(() => {
    fetchScoringFactors();
  }, []);

  // Create card with the scoring factors
  const frequencyIcon = <FrequencyIcon className="fill-white w-6 h-6"/>;
  const durationIcon = <DurationIcon className="fill-white w-6 h-6"/>;
  const walkIcon = <WalkIcon className="fill-white w-6 h-6"/>
  const factorCardsArray = [{
    name: "Frequency", bg: frequencyColor.bgGradient, value: frequency
  }, {
    name: "Duration", bg: durationColor.bgGradient, value: duration
  }, {
    name: "Walk Time", bg: walkTimeColor.bgGradient, value: walkTime
  }];

  // Create an array with the three scoring factors
  // Sort it (mutate in-place)
  // Create divs with the position (1, 2, 3), name, value, and icon
  const factorCards = [].concat(factorCardsArray)
    .sort((a, b) => a.value < b.value ? 1 : -1)
    .map((item, i) =>
      <div key={i} className={`${item.bg} font-semibold text-2xl text-white rounded-2xl px-4 py-2 flex gap-2 justify-start items-center`}>
        <span>{i + 1}.</span>
        {item.name === "Frequency" ? frequencyIcon : item.name === "Duration" ? durationIcon : walkIcon}
        <span>{item.name}: {item.value}%</span>
      </div>);

  // Create origins' scorecards, except for the currentHome
  if (origins.length > 0) {
    originCards = origins.map(function (loc) {
      return <DashboardCard className={dashboardInnerElementGradientClass} loc={loc} destinations={destinations} key={loc._id}>{loc.name}</DashboardCard>;
    })
  } else {
    originCards = <div
      className={`${dashboardInnerElementGradientClass} rounded-3xl p-4 flex flex-col items-center gap-2`}>
      <div className="flex justify-between items-center gap-2 drop-shadow-lg">
        <span className="font-bold text-2xl text-center text-white">
          No saved locations yet.
        </span>
      </div>
    </div>;
  }

  // Create card with the list of destinations
  if (destinations.length > 0) {
    destinationCards = destinations.map(function (loc) {
      return (<div className="bg-gradient-to-br from-white to-emerald-100 text-emerald-800 dark:from-emerald-500 dark:to-emerald-700 dark:text-white rounded-2xl px-4 py-2 flex justify-between items-center"
                   key={loc._id}>
          <span className="font-semibold text-xl text-left line-clamp-2">
            {loc.name}
          </span>
          <div className="flex flex-nowrap gap-2">
            <Link to="/" className="transition ease-in-out duration-200 rounded-lg">
              <button type="button"
                      className={dashboardElementButtonClass2}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                     stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </button>
            </Link>
            <EditLocation loc={loc} buttonClass={dashboardElementButtonClass2}/>
          </div>
        </div>);
    })
  } else {
    destinationCards =
      <div className="flex justify-between items-center gap-2 drop-shadow-lg">
        <span className="font-bold text-2xl text-center text-white">
          No saved destinations yet.
        </span>
      </div>;
  }

  return (<>
      <BaseLayout className="flex flex-col">
        {/*<div className="w-full grow flex flex-col items-center p-8 bg-cover bg-center bg-fixed bg-[url('/src/assets/dashboard_bg.jpg')]">*/}
        <div className="w-full grow flex flex-col items-center p-8">
          <div className="w-full flex flex-col justify-center">
            <div className="flex gap-8">
              <div className="w-96 flex flex-col gap-8 items-center">
                <div
                  className={`w-full flex flex-col items-center gap-4 ${dashboardElementClass}`}>
                  <p
                    className="text-center text-4xl font-bold leading-snug text-transparent bg-clip-text bg-clip-text bg-gradient-to-r from-white to-emerald-100">
                    Current Home
                  </p>
                  {currentHome ? <>
                    <DashboardCard className={dashboardInnerElementGradientClass} loc={currentHome} destinations={destinations} invert>{currentHome.name}</DashboardCard>
                  </> : <div
                    className={`${dashboardInnerElementGradientClass} rounded-3xl p-4 flex flex-col items-center gap-2 w-64`}>
                    <div className="flex justify-between items-center gap-2 drop-shadow-lg">
                          <span className="font-bold text-2xl text-center text-white">
                            No specified current home.
                          </span>
                    </div>
                  </div>}
                </div>

                <div
                  className={`w-96 h-fit flex flex-col items-center gap-4 ${dashboardElementClass}`}>
                  <span className="flex items-center gap-2">
                    <span
                      className="text-center text-4xl font-bold leading-snug text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-100">
                      Scoring Factors
                    </span>
                  </span>

                  <div
                    className={`${dashboardInnerElementGradientClass} w-full rounded-3xl p-4 flex flex-col gap-2`}>
                    {factorCards}
                  </div>

                  <EditScoringFactors frequency={frequency} setFrequency={setFrequency} frequencyColor={frequencyColor}
                                      duration={duration} setDuration={setDuration} durationColor={durationColor}
                                      walkTime={walkTime} setWalkTime={setWalkTime} walkTimeColor={walkTimeColor}
                                      buttonClass={dashboardElementButtonClass}/>
                </div>

              </div>
              <div
                className={`grow h-fit flex flex-col gap-4 ${dashboardElementClass}`}>
                <p
                  className="text-center text-4xl font-bold leading-snug text-transparent bg-clip-text bg-clip-text bg-gradient-to-r from-white to-emerald-100">
                  Added Homes
                </p>
                <div className="grid grid-cols-[repeat(auto-fit,16rem)] justify-center gap-8 h-fit">
                  {originCards}
                </div>
              </div>

              <div
                className={`${dashboardElementClass} w-96 h-fit flex flex-col items-center gap-4`}>
                <p
                  className="text-center text-4xl font-bold leading-snug text-transparent bg-clip-text bg-clip-text bg-gradient-to-r from-white to-emerald-100">
                  Added Destinations
                </p>
                <div
                  className={`${dashboardInnerElementGradientClass} w-full rounded-3xl p-4 flex flex-col gap-2`}>
                  {destinationCards}
                </div>

                <Link to="/" className="transition ease-in-out duration-200 rounded-lg font-bold text-2xl">
                  <button type="button"
                          className={dashboardElementButtonClass}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                         stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Add Destination
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    </>);
}

import React, {useEffect, useState, useRef} from "react";
import BaseLayout from "../components/BaseLayout";
import DashboardCard from "../components/DashboardCard";
import EditLocation from "../components/EditLocation";
import axios from "axios";
import {Link} from "react-router-dom";
import {loadScores} from "../backend/utils/scoring";
import EditScoringFactors from "../components/EditScoringFactors";
import ScoreCompareModal from '../components/ScoreCompareModal';
import CompareIcon from '../assets/compare.png';


export default function Dashboard() {
  const user_id = localStorage.getItem("user_id");
  const [locations, getLocations] = useState([]);
  const [rawOrigins, setRawOrigins] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [rawCurrentHome, setRawCurrentHome] = useState([]);
  const [currentHome, setCurrentHome] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [cards, setCards] = useState([])
  const [cardToCompare, setCardToCompare] = useState([]);
  const [compare, setCompare] = useState(false)
  const [compareModal, setCompareModal] = useState(false)

  const addCardToCompare = (count) => {
    cardToCompare.push(count)
    if (cardToCompare.length === 2) setCompareModal(true)
  }

  const closeCompareModal = () => {
    setCompareModal(false)
    setCardToCompare([])
  }

  const locationsLoaded = useRef(false);
  const locationsSplit = useRef(false);

  const dashboardElementClass = "rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-500 dark:from-emerald-900 dark:to-emerald-dark p-4";
  const dashboardElementButtonClass = "w-full flex items-center justify-start gap-2 transition ease-in-out duration-200 rounded-lg text-2xl font-semibold rounded-2xl text-md bg-emerald-200 focus:ring-4 focus:ring-emerald-300 dark:focus:ring-emerald-400 text-emerald-800 dark:text-emerald-dark hover:bg-white px-4 py-2";
  const dashboardElementButtonClass2 = "w-8 h-8 flex items-center justify-center transition ease-in-out font-semibold rounded-lg text-md bg-emerald-500 dark:bg-emerald-200 focus:ring-4 focus:ring-emerald-300 dark:focus:ring-emerald-400 text-white dark:text-emerald-dark hover:bg-emerald-700 dark:hover:bg-white";
  const dashboardInnerElementGradientClass = "bg-gradient-to-br from-emerald-900 to-emerald-darker dark:from-emerald-darker dark:to-black rounded-3xl";

  let originCards;
  let destinationCards;

  // Fetch all locations from the DB
  const fetchLocations = () => {
    const user_id = localStorage.getItem("user_id");

    if (user_id == null) {
      let locationStringArray = sessionStorage.getItem('location')
      if (locationStringArray != null) {
        let locationArray = JSON.parse(locationStringArray);

        // Give unique ID to each location (for locations saved by non-logged in users)
        for(let i = 0; i < locationArray.length; i++) {
          locationArray[i]._id = i;
          // locationArray[i].scores = [];
        }
        sessionStorage.setItem('location', JSON.stringify(locationArray));
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

    let originsWithScores;
    // Map all scores and set `origins` to it
    originsWithScores = await Promise.all(rawOrigins.map(async o => ({
      ...o, scores: await loadScores(o, destinations, user_id)
    })));
    if(rawCurrentHome) {
      setCurrentHome({
        ...rawCurrentHome, scores: await loadScores(rawCurrentHome, destinations, user_id)
      });
    }

    // Set origins to include the scores
    setOrigins(originsWithScores);
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

  // Create origins' scorecards
  let count = -1
  let currentHomeObj = null
  if (origins.length > 0) {
    originCards = origins.map(function(loc) {
      count += 1
      cards[count] = <DashboardCard className={dashboardInnerElementGradientClass} loc={loc} destinations={destinations} key={loc._id} count={count} factorWeights={factorWeights} compare={compare} addCardToCompare={addCardToCompare}>{loc.name}</DashboardCard>;
      return cards[count]
    })
    if (currentHome) {
      count += 1
      currentHomeObj = <DashboardCard className={dashboardInnerElementGradientClass} loc={currentHome} destinations={destinations} invert compare={compare} key={count} count={count} factorWeights={factorWeights} addCardToCompare={addCardToCompare}>{currentHome.name}</DashboardCard>
      cards[count] = currentHomeObj;
    }
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

  return (
    <>
      <BaseLayout className="flex flex-col" ignore={['dashboard']}>
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
                  {
                    currentHomeObj && currentHomeObj.props.children ?
                      <>
                        { currentHomeObj }
                      </>
                      :
                      <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl p-4 flex flex-col items-center gap-2 w-64">
                        <div className="flex justify-between items-center gap-2 drop-shadow-lg">
                          <span className="font-bold text-2xl text-center text-white">
                            No specified current home.
                          </span>
                    </div>
                  </div>}
                </div>

                <ScoreCompareModal firstLocation={cards[cardToCompare[0]]} secondLocation={cards[cardToCompare[1]]} show={compareModal} onClose={closeCompareModal} ></ScoreCompareModal>
                
                <div className={`w-96 h-fit flex flex-col items-center p-4 gap-4 ${dashboardElementClass}`}>
                  <span className="flex items-center gap-2">
                    <span
                      className="text-center text-4xl font-bold leading-snug text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-100">
                      Scoring Factors
                    </span>
                  </span>

                  <EditScoringFactors dashboardInnerElementGradientClass={dashboardInnerElementGradientClass} buttonClass={dashboardElementButtonClass}/>
                </div>

              </div>
              <div className={`grow h-fit flex flex-col gap-4 ${dashboardElementClass}`}>
                <div className="flex flex-row space-between justify-between">
                  <div className="w-16"></div>
                  <p className="text-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-50 to-emerald-200">
                    Added Homes
                  </p>
                  <img src={CompareIcon} className="w-16 cursor-pointer" onClick={() => setCompare(!compare)} />
                </div>
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
    </>
  );
}

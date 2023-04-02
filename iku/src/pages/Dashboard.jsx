import React, {useEffect, useRef, useState} from "react";
import BaseLayout from "../components/BaseLayout";
import DashboardCard from "../components/DashboardCard";
import EditLocation from "../components/EditLocation";
import axios from "axios";
import {Link} from "react-router-dom";
import {loadScores} from "../backend/utils/scoring";
import EditScoringFactors from "../components/EditScoringFactors";
import ScoreCompareModal from '../components/ScoreCompareModal';
import CompareIcon from '../assets/compare.png';
import {
  defaultUserFactorWeights,
  defaultUserNightDayWeights,
  defaultUserNightDirectionWeights,
  defaultUserRoutingPreferences,
  defaultUserScoringPreferences,
  defaultUserTimeSliceWeights,
  defaultUserWeekendWeights
} from "../backend/config/defaultUserPreferences";


const dashboardTitleTextGradient = "text-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-emerald-100 pb-1";

const dashboardElement = "rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-800 dark:to-emerald-900 p-4";
const dashboardInnerElementGradient = "bg-gradient-to-br from-emerald-dark to-emerald-darker dark:from-emerald-darkest dark:to-black rounded-3xl";
const dashboardNestedInnerElementGradient = "bg-gradient-to-br from-white to-emerald-100 text-emerald-dark rounded-lg px-4 py-2 flex justify-between items-center";

const dashboardButtonBase = "transition ease-in-out duration-200 rounded-lg font-semibold rounded-2xl text-md bg-emerald-200 focus:ring-4 focus:ring-emerald-400 text-emerald-dark hover:bg-white drop-shadow-lg"
const dashboardButtonBase2 = "transition ease-in-out duration-200 rounded-lg font-semibold rounded-2xl text-md bg-emerald-500 focus:ring-4 focus:ring-emerald-400 text-white hover:text-emerald-dark hover:bg-white drop-shadow-lg"
const dashboardElementButton = "w-full flex items-center justify-start gap-2  px-4 py-2 text-2xl " + dashboardButtonBase;
const dashboardSmallButton = "h-8 p-2 gap-2 flex items-center justify-center " + dashboardButtonBase;
export const dashboardSquareButton = "h-8 w-8 flex items-center justify-center " + dashboardButtonBase;
const dashboardSquareButton2 = "h-8 w-8 flex items-center justify-center " + dashboardButtonBase2;

export default function Dashboard() {
  const user_id = localStorage.getItem("user_id");
  const [locations, getLocations] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [scores, setScores] = useState({});
  const [destinations, setDestinations] = useState([]);
  const [cards, setCards] = useState([]);
  const [cardToCompare, setCardToCompare] = useState([]);
  const [compare, setCompare] = useState(false);
  const [compareModal, setCompareModal] = useState(false);
  const [userData, setUserData] = useState(null);

  const addCardToCompare = (count) => {
    cardToCompare.push(count)
    if (cardToCompare.length === 2) setCompareModal(true)
  }

  const closeCompareModal = () => {
    setCompareModal(false)
    setCardToCompare([])
  }

  const userDataLoaded = useRef(false);
  const locationsLoaded = useRef(false);
  const locationsSplit = useRef(false);

  let originCards;
  let destinationCards;

  const fetchUserData = async () => {
    if (user_id != null) {
      const user = await axios.get(`http://localhost:5000/userByID/${user_id}`);
      setUserData(user.data[0]);
    } else {
      if(user_id === null) {
        if(sessionStorage.getItem("preferences") === null) {
          const defaultFactors = {
            factorWeights: defaultUserFactorWeights,
            nightDayWeights: defaultUserNightDayWeights,
            nightDirectionWeights: defaultUserNightDirectionWeights,
            weekendWeights: defaultUserWeekendWeights,
            timeSliceWeights: defaultUserTimeSliceWeights,
            scoringPreferences: defaultUserScoringPreferences,
            routingPreferences: defaultUserRoutingPreferences,
          };
          let preferences = {
            factorWeights: defaultFactors,
            preferencesUpdated: false
          }

          sessionStorage.setItem("preferences", JSON.stringify(preferences));
          setUserData(defaultFactors);
        } else {
          setUserData(JSON.parse(sessionStorage.getItem("preferences")).factorWeights);
        }
      }
    }
    userDataLoaded.current = true;
  }

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
      setOrigins(locations.filter(loc => loc.origin));
      setDestinations(locations.filter(loc => !loc.origin));
    }
    locationsSplit.current = true;
  }

  // Fetch the scores for all origins except the current home
  const fetchScores = async () => {
    // Map all scores and set `origins` to it
    for (let o of origins) {
      const toAppend = await loadScores(o, destinations, user_id, userData);
      setScores((previousScores, props) => ({
        ...previousScores,
        [o._id]: toAppend
      }))
    }
  }

  useEffect(() => {
    fetchUserData();
  }, [])

  useEffect(() => {
    if (userDataLoaded.current) {
      fetchLocations();
    }
  }, [userData])

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
  }, [origins, destinations]);

  // Create origins' scorecards
  let count = -1
  if (origins.length > 0) {
    originCards = origins.map(function(loc) {
      count += 1

      cards[count] =
        <DashboardCard
          key={loc._id}
          className={dashboardInnerElementGradient}
          buttonClass={dashboardSmallButton}
          loc={loc}
          fetchedScores={scores && scores[loc._id]}
          destinations={destinations}
          count={count}
          userData={userData}
          compare={compare}
          addCardToCompare={addCardToCompare}
        />;

      return cards[count]
    })
  } else {
    originCards = <div className="w-full flex justify-center items-center">
      <div className={`${dashboardInnerElementGradient} rounded-3xl p-4 flex flex-col items-center gap-2 w-[26rem]`}>
        <div className="flex justify-between items-center gap-2 drop-shadow-lg">
        <span className="font-bold text-2xl text-center text-white">
          No saved locations yet.
        </span>
        </div>
      </div>
    </div>;
  }

  // Create card with the list of destinations
  if (destinations.length > 0) {
    destinationCards = destinations.map(function (loc) {
      return (<div className={dashboardNestedInnerElementGradient}
                   key={loc._id}>
          <span className="font-semibold text-xl text-left line-clamp-2">
            {loc.name}
          </span>
          <div className="flex flex-nowrap gap-2">
            <EditLocation loc={loc} buttonClass={dashboardSquareButton2} notext />
          </div>
        </div>);
    })
  } else {
    destinationCards =
      <div className="flex justify-center items-center gap-2 drop-shadow-lg">
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
            <div className="w-full flex flex-col items-center gap-8 lg:flex-row lg:items-start">
              <div className="w-full lg:w-fit flex flex-col gap-8 items-center">

                <div
                  className={`${dashboardElement} w-full lg:w-[28rem] h-fit flex flex-col items-center gap-4`}>
                  <p
                    className={dashboardTitleTextGradient}>
                    Added Destinations
                  </p>
                  <div
                    className={`${dashboardInnerElementGradient} w-full rounded-3xl p-4 flex flex-col gap-2`}>
                    {destinationCards}
                  </div>

                  <Link to="/" className="transition ease-in-out duration-200 rounded-lg font-bold text-2xl">
                    <button type="button"
                            className={dashboardElementButton}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                           stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Add Destination
                    </button>
                  </Link>
                </div>

                <ScoreCompareModal
                  firstLocation={cards[cardToCompare[0]]}
                  secondLocation={cards[cardToCompare[1]]}
                  show={compareModal}
                  onClose={closeCompareModal}
                />

                <div className={`w-full lg:w-[28rem] h-fit flex flex-col items-center p-4 gap-4 ${dashboardElement}`}>
                  <span className="flex items-center gap-2">
                    <span
                      className={dashboardTitleTextGradient}>
                      Scoring Factors
                    </span>
                  </span>

                  {
                    userDataLoaded.current
                      ? <EditScoringFactors userData={userData} buttonClass={dashboardElementButton}/>
                      : <></>
                  }

                </div>

              </div>
              <div className={`w-full grow h-fit flex flex-col ${dashboardElement}`}>
                <div className="flex flex-row justify-between">
                  <div className="w-14"></div>
                  <span className={dashboardTitleTextGradient}>
                    Added Homes
                  </span>
                  <img src={CompareIcon} className="w-14 h-14 cursor-pointer" onClick={() => setCompare(!compare)} />
                </div>
                <div className="flex flex-col justify-center gap-4 h-fit">
                  {originCards}
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    </>
  );
}

import React, {Fragment, useEffect, useState} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ReactComponent as RightArrowIcon } from "./../assets/arrow-right.svg";
import CircleWithText from "./custom/CircleWithText";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
import Carousel from "react-material-ui-carousel";
import {ReactComponent as BicycleIcon} from "./../assets/bike.svg";
import {ReactComponent as WalkIcon} from "./../assets/walk.svg";
import {ReactComponent as ElevationIcon} from "./../assets/elevation.svg";
import {ReactComponent as CarIcon} from "./../assets/car.svg";
import {calculateColorForEachScore} from "./DashboardCard";
import {computeRouteMetricsAverages} from "../backend/utils/routingAverages";
import {listOfScores} from "../backend/utils/scoring";


function ScoreDetailModal({ originLocation, destinations, userData }) {

  const defaultSavedScores = {
    overall: 0,
    rushHour: 0,
    offPeak: 0,
    weekend: 0,
    overnight: 0,
  };

  const defaultRouteMetrics = {
    frequencyMin: "-",
    frequencyMax: "-",
    frequencyAvg: "-",
    durationMin: "-",
    durationMax: "-",
    durationAvg: "-",
    walkMin: "-",
    walkMax: "-",
    walkAvg: "-",
  };

  const [isOpen, setIsOpen] = useState(false);
  const [savedScores, setSavedScores] = useState({});
  const [selectedDestination, setSelectedDestination] = useState("default");
  const [allRouteMetrics, setAllRouteMetrics] = useState(null);
  const [currentRouteMetrics, setCurrentRouteMetrics] = useState(defaultRouteMetrics);
  const [alternativeRoutes, setAlternativeRoutes] = useState(null);
  const [selectedScoreTime, setSelectedScoreTime] = useState("Overall");

  const openModal = () => {
    setIsOpen(true);
    fetchOverallSavedScore();
  };

  const closeModal = () => {
    setSelectedDestination("default");
    setCurrentRouteMetrics(defaultRouteMetrics);
    setIsOpen(false);
  };

  const processScores = (allScores) => {
    let scores = {};
    // Deep copy of the scores from the location object
    for (let i of listOfScores) {
      scores[i] = Math.round(allScores[i]);
    }
    scores = calculateColorForEachScore(scores);
    setSavedScores(scores)
  }

  const Trip = ({trip}) => {
    const isGoing = trip.includes('Going');
    const isCar = trip.includes('car')

    return (
      <div className="flex flex-row gap-5">
        <div>
          {isGoing ? 'To destination: ' : 'To origin: '}
          {secondsToMinutes(allRouteMetrics['alternativeModeRoutes'][trip]['duration'])}
        </div>
        {
          isCar ? <> </> :
            <div className="flex flex-row">
              <div>
                <ElevationIcon></ElevationIcon>
              </div>
              <div className="pr-2">
                +{allRouteMetrics['alternativeModeRoutes'][trip]['elevationGained']}m
              </div>
              <div>
                -{allRouteMetrics['alternativeModeRoutes'][trip]['elevationLost']}m
              </div>
            </div>
        }
      </div>
    )
  }

  const processAlternativeRoutes = () => {
    if (!allRouteMetrics) {
      return;
    }
    const trips = {
      'walkTrip': ['walkTripGoing', 'walkTripComing'],
      'bicycleTrip': ['bicycleTripGoing', 'bicycleTripComing'],
      'carTrip': ['carTripGoing', 'carTripComing']
    }

    const icons = {
      'walkTrip': <WalkIcon />,
      'bicycleTrip': <BicycleIcon/>,
      'carTrip': <CarIcon/>
    }

    const routes = [];

    for (let i of Object.entries(trips)) {
      const mode = i[0]
      const goingTrip = i[1][0];
      let comingTrip = i[1][1];

      let goingTripVisual = null
      let comingTripVisual = null

      if (allRouteMetrics['alternativeModeRoutes'][goingTrip]) {
        goingTripVisual = (<Trip trip={goingTrip}></Trip>);
      }

      if (allRouteMetrics['alternativeModeRoutes'][comingTrip]) {
        comingTripVisual = (<Trip trip={comingTrip}></Trip>);
      }

      if (!goingTripVisual && !comingTripVisual) {
        routes.push(
          <div key={mode} className="flex flex-row gap-2">
            <div className="px-2">
              {icons[mode]}
            </div>
            <div className="flex flex-col gap-2">
              No trips found: The available trips may be too long to consider.
            </div>
          </div>
        )
      }

      else {
        routes.push(
          <div key={mode} className="flex flex-row gap-2">
            <div className="px-2">
              {icons[mode]}
            </div>
            <div className="flex flex-col gap-2">
              {goingTripVisual}
              {comingTripVisual}
            </div>
          </div>
        )
      }
    }
    setAlternativeRoutes(routes)
  }

  useEffect(() => {
    processAlternativeRoutes()
  }, [allRouteMetrics]);

  const fetchOverallSavedScore = () => {
    axios
      .get(`http://localhost:5000/savedScores/${originLocation._id}`)
      .then((response) => {
        if (response.data) {
          processScores(response.data);
        } else {
          // Assign 0 to all scores and statistics if values have not been calculated yet
          processScores(defaultSavedScores);
        }
      })
      .catch((err) => console.error(err));
  };

  const onChangeDestinationDropdown = async (event) => {
    const newSelection = event.currentTarget.value
    setSelectedDestination(newSelection);

    // Reset the selected score time to Overall
    setSelectedScoreTime("Overall");

    // Reset the current route metrics
    setCurrentRouteMetrics(defaultRouteMetrics);

    // Case where selected item in dropdown is All destinations
    if (newSelection === "default") {
      fetchOverallSavedScore();
    } else {
      // Fetch the saved scores for a specific destination
      axios
        .get(
          `http://localhost:5000/savedScores/${originLocation._id}/${newSelection}`
        )
        .then((response) => {
          if (response.data) {
            processScores(response.data);
          } else {
            // Assign 0 to all scores and statistics if values have not been calculated yet
            processScores(defaultSavedScores);
          }
        })
        .catch((err) => console.error(err));
      // Fetch the routes metrics
      axios
        .get(
          `http://localhost:5000/savedRoutingData/${originLocation._id}/${newSelection}/`
        )
        .then((response) => {
          if (response.data) {
            const computedMetrics = computeRouteMetricsAverages(response.data.routingData, userData);
            setAllRouteMetrics(computedMetrics);
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const handleSelectedScoreTime = (event) => {
    const newSelection = event.currentTarget.id
    setSelectedScoreTime(newSelection);
    event.stopPropagation();

    if (newSelection !== "default" && allRouteMetrics) {
      const selectedTimeSlice = event.currentTarget.id;
      let currentMetrics = {
        frequencyMin:
          allRouteMetrics[selectedTimeSlice]["frequencyMetrics"]["min"],
        frequencyMax:
          allRouteMetrics[selectedTimeSlice]["frequencyMetrics"]["max"],
        frequencyAvg:
          allRouteMetrics[selectedTimeSlice]["frequencyMetrics"]["average"],
        durationMin:
          allRouteMetrics[selectedTimeSlice]["durationMetrics"]["min"],
        durationMax:
          allRouteMetrics[selectedTimeSlice]["durationMetrics"]["max"],
        durationAvg:
          allRouteMetrics[selectedTimeSlice]["durationMetrics"]["average"],
        walkMin: allRouteMetrics[selectedTimeSlice]["walkMetrics"]["min"],
        walkMax: allRouteMetrics[selectedTimeSlice]["walkMetrics"]["max"],
        walkAvg:
          allRouteMetrics[selectedTimeSlice]["walkMetrics"]["average"],
      };
      setCurrentRouteMetrics(currentMetrics);
    }
  };

  const secondsToMinutes = (seconds) => {
    seconds = Number(seconds);
    let h = Math.floor(seconds / 3600);
    let m = Math.floor(seconds % 3600 / 60);

    let hDisplay = h > 0 ? h + (h === 1 ? " hour " : " hours ") : "";
    let mDisplay = m > 0 ? m + (m === 1 ? " minute " : " minutes ") : "";
    return hDisplay + mDisplay;
  }

  return (
    <>
      <button
        onClick={openModal}
        type="button"
        className="w-8 h-7 flex items-center justify-center transition ease-in-out font-semibold border-b border-emerald-600 rounded-t-lg text-md bg-emerald-200 focus:ring-4 focus:ring-emerald-400 text-emerald-800 dark:text-emerald-dark hover:bg-white"
        on={1}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
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
                <Dialog.Title
                  as="h3"
                  className="text-3xl py-2.5 font-medium leading-6 text-emerald-500 pl-5 "
                >
                  <div className="flex">
                    <div className="inline flex flex-row">Details</div>

                    <Tooltip
                      title={
                        <table className="table-auto border-separate">
                          <thead>
                            <tr>
                              <th>Transit Score Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>90-100</td>
                              <td>Rider's Paradise</td>
                            </tr>
                            <tr>
                              <td>70-89</td>
                              <td>Excellent Transit</td>
                            </tr>
                            <tr>
                              <td>50-69</td>
                              <td>Good Transit</td>
                            </tr>
                            <tr>
                              <td>25-49</td>
                              <td>Some Transit</td>
                            </tr>
                            <tr>
                              <td>0-24</td>
                              <td>Minimal Transit</td>
                            </tr>
                          </tbody>
                        </table>
                      }
                      placement="right"
                      className="pl-3"
                    >
                      <button
                        type="button"
                        className="w-8 h-8 items-center justify-center transition ease-in-out font-semibold rounded-lg text-md  text-emerald-600 dark:text-emerald-800 hover:bg-white"
                        on={1}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="w-6 h-6 inline"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                          />
                        </svg>
                      </button>
                    </Tooltip>
                  </div>

                  <div className="float-right absolute right-4 top-4 ">
                    <button type="button" onClick={closeModal}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="35"
                        height="35"
                        fill="currentColor"
                        viewBox="0 0 512 512"
                      >
                        {" "}
                        <title>ionicons-v5-m</title>{" "}
                        <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-2xl pt-7 font-normal">
                    <div className="pr-3 inline">{originLocation.name}</div>
                    <RightArrowIcon className="inline"></RightArrowIcon>
                    <select
                      className="form-control"
                      onChange={onChangeDestinationDropdown}
                    >
                      <option key="default" value="default" defaultValue>
                        -- All destinations --
                      </option>
                      {destinations.map(function (dest) {
                        return (
                          <option key={dest._id} value={dest._id}>
                            {dest.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </Dialog.Title>

                {/* Table contents */}
                <div className="w-full bg-emerald-400 rounded-3xl p-4 flex flex-col mt-2">
                  <div className="w-full grow flex flex-col items-center p-3">
                    <div className="w-full flex flex-col justify-center">
                      <div className="flex gap-3">
                        {/* First column: Times */}
                        <div className="flex flex-col gap-2 items-center">
                          <div className="invisible bg-emerald-900 font-semibold text-lg text-white rounded-2xl px-3 py-7 h-28 flex flex-col gap-2 justify-between items-center">
                            <span>Placeholder</span>
                          </div>
                          <button
                            type="button"
                            id="overallMetrics"
                            onClick={handleSelectedScoreTime}
                            className={`bg-emerald-900 hover:bg-emerald-600 font-semibold text-lg text-white rounded-2xl px-7 py-2 h-14 flex flex-col gap-2 justify-between items-center ${
                              selectedScoreTime === "Overall"
                                ? "bg-emerald-600"
                                : ""
                            }`}
                          >
                            <span>Overall</span>
                          </button>
                          <button
                            type="button"
                            id="rushHourMetrics"
                            onClick={handleSelectedScoreTime}
                            className={`bg-emerald-900 hover:bg-emerald-600 font-semibold text-lg text-white rounded-2xl px-7 py-2 h-14 flex flex-col gap-2 justify-between items-center ${
                              selectedScoreTime === "Rush-Hour"
                                ? "bg-emerald-600"
                                : ""
                            }`}
                          >
                            <span>Rush-Hour</span>
                          </button>
                          <button
                            type="button"
                            id="offPeakMetrics"
                            onClick={handleSelectedScoreTime}
                            className={`bg-emerald-900 hover:bg-emerald-600 font-semibold text-lg text-white rounded-2xl px-7 py-2 h-14 flex flex-col gap-2 justify-between items-center ${
                              selectedScoreTime === "Off-Peak"
                                ? "bg-emerald-600"
                                : ""
                            }`}
                          >
                            <span>Off-Peak</span>
                          </button>
                          <button
                            type="button"
                            id="weekendMetrics"
                            onClick={handleSelectedScoreTime}
                            className={`bg-emerald-900 hover:bg-emerald-600 font-semibold text-lg text-white rounded-2xl px-7 py-2 h-14 flex flex-col gap-2 justify-between items-center ${
                              selectedScoreTime === "Weekend"
                                ? "bg-emerald-600"
                                : ""
                            }`}
                          >
                            <span>Weekend</span>
                          </button>
                          <button
                            type="button"
                            id="overnightMetrics"
                            onClick={handleSelectedScoreTime}
                            className={`bg-emerald-900 hover:bg-emerald-600 font-semibold text-lg text-white rounded-2xl px-7 py-2 h-14 flex flex-col gap-2 justify-between items-center ${
                              selectedScoreTime === "Overnight"
                                ? "bg-emerald-600"
                                : ""
                            }`}
                          >
                            <span>Overnight</span>
                          </button>
                        </div>
                        {/* Second column: Score */}
                        <div className="flex flex-col gap-2 items-center">
                          <CircleWithText
                            className="pl-3 invisible h-28"
                            size="w-14 h-14"
                            textClass="text-lg font-bold"
                            bgColor="bg-white dark:bg-teal-900"
                            gradient="bg-gradient-to-br from-green-300 to-green-500 dark:from-white dark:to-green-400"
                          >
                            {savedScores.rushHour}
                          </CircleWithText>
                          <CircleWithText
                            className="pl-3"
                            size="w-14 h-14"
                            textClass="text-lg font-bold"
                            borderColor={savedScores.overallColor}
                            textColor={savedScores.overallColor}
                          >
                            {savedScores.overall}
                          </CircleWithText>
                          <CircleWithText
                            className="pl-3"
                            size="w-14 h-14"
                            textClass="text-lg font-bold"
                            borderColor={savedScores.rushHourColor}
                            textColor={savedScores.rushHourColor}
                          >
                            {savedScores.rushHour}
                          </CircleWithText>
                          <CircleWithText
                            className="pl-3"
                            size="w-14 h-14"
                            textClass="text-lg font-bold"
                            borderColor={savedScores.offPeakColor}
                            textColor={savedScores.offPeakColor}
                          >
                            {savedScores.offPeak}
                          </CircleWithText>
                          <CircleWithText
                            className="pl-3"
                            size="w-14 h-14"
                            textClass="text-lg font-bold"
                            borderColor={savedScores.weekendColor}
                            textColor={savedScores.weekendColor}
                          >
                            {savedScores.weekend}
                          </CircleWithText>
                          <CircleWithText
                            className="pl-3"
                            size="w-14 h-14"
                            textClass="text-lg font-bold"
                            borderColor={savedScores.overnightColor}
                            textColor={savedScores.overnightColor}
                          >
                            {savedScores.overnight}
                          </CircleWithText>
                        </div>
                        {/* Third column: Table and caroussel */}
                        <div className="flex flex-col gap-2 items-center">
                          {/* Score statistics */}
                          <table className="border-separate border-spacing-3">
                            <thead>
                              <tr>
                                <th>
                                  <div className="bg-emerald-900 font-semibold text-lg text-white rounded-2xl px-4 py-2 items-center">
                                    <table className="text-center border-separate border-spacing-1">
                                      <tbody>
                                        <tr>
                                          <td colSpan={3} className="border-b">
                                            Frequency
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="border-r px-2">Min</td>
                                          <td className="border-r px-2">Avg</td>
                                          <td className="px-2">Max</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </th>
                                <th>
                                  <div className="bg-emerald-900 font-semibold text-lg text-white rounded-2xl px-4 py-2 items-center">
                                    <table className="text-center border-separate border-spacing-1">
                                      <tbody>
                                        <tr>
                                          <td colSpan={3} className="border-b">
                                            Duration
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="border-r px-2">Min</td>
                                          <td className="border-r px-2">Avg</td>
                                          <td className="px-2">Max</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </th>
                                <th>
                                  <div className="bg-emerald-900 font-semibold text-lg text-white rounded-2xl px-4 py-2 items-center">
                                    <table className="text-center border-separate border-spacing-1">
                                      <tbody>
                                        <tr>
                                          <td colSpan={3} className="border-b">
                                            Walk
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="border-r px-2">Min</td>
                                          <td className="border-r px-2">Avg</td>
                                          <td className="px-2">Max</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  <div className="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                                    <table className="text-center table-fixed border-separate border-spacing-1">
                                      <tbody>
                                        <tr>
                                          <td className="border-r border-emerald-900/30 px-3 w-12">
                                            {currentRouteMetrics.frequencyMin}
                                          </td>
                                          <td className="border-r border-emerald-900/30 px-3 w-12">
                                            {currentRouteMetrics.frequencyAvg}
                                          </td>
                                          <td className="px-3 w-12">
                                            {currentRouteMetrics.frequencyMax}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                                <td>
                                  <div className="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                                    <table className="text-center table-fixed border-separate border-spacing-1">
                                      <tbody>
                                        <tr>
                                          <td className="border-r border-emerald-900/30 px-3 w-12">
                                            {currentRouteMetrics.durationMin}
                                          </td>
                                          <td className="border-r border-emerald-900/30 px-3 w-12">
                                            {currentRouteMetrics.durationAvg}
                                          </td>
                                          <td className="px-3 w-12">
                                            {currentRouteMetrics.durationMax}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                                <td>
                                  <div className="bg-white font-semibold text-lg text-emerald-500 rounded-2xl px-4 py-2 flex gap-2 justify-start items-center">
                                    <table className="text-center table-fixed border-separate border-spacing-1">
                                      <tbody>
                                        <tr>
                                          <td className="border-r border-emerald-900/30 px-3 w-12">
                                            {currentRouteMetrics.walkMin}
                                          </td>
                                          <td className="border-r border-emerald-900/30 px-3 w-12">
                                            {currentRouteMetrics.walkAvg}
                                          </td>
                                          <td className="px-3 w-12">
                                            {currentRouteMetrics.walkMax}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          {/* Caroussel */}
                          <Carousel
                            autoPlay={false}
                            animation="slide"
                            cycleNavigation={false}
                            navButtonsAlwaysVisible={true}
                            indicators={false}
                            className="grow rounded-3xl bg-emerald-50 flex flex-col  px-7 py-2 h-full w-full "
                            sx={{
                              button: {
                                "&:hover": {
                                  opacity: "1 !important",
                                },
                              },
                              buttonWrapper: {
                                "&:hover": {
                                  "& $button": {
                                    backgroundColor: "black",
                                    filter: "brightness(120%)",
                                    opacity: "1",
                                  },
                                },
                              },
                            }}
                          >
                            <div className="flex flex-col  px-7 py-2 h-full w-full ">
                              <span>Route 1</span>
                              <span>Route 2</span>
                              <span>Route 3</span>
                              <span>Route 4</span>
                            </div>

                            <div className="grow rounded-3xl bg-emerald-50 flex flex-col  px-8 py-2 h-full w-full ">
                              <div className="text-lg font-semibold ">
                                Alternative modes of transport
                              </div>
                              {/* Don't display alternative modes of transport if destination is not selected */}
                              <div className={selectedDestination === "default" ? "" : "hidden"}>
                                Please select a destination to view the alternative modes of transport route information
                              </div>
                              {/* Display alternative modes of transport if destination is selected */}
                              {
                                allRouteMetrics ?
                                  <>
                                    <div
                                      className={`flex flex-col py-3 gap-2 items-left ${selectedDestination !== "default" ? "" : "hidden"}`}>
                                      {alternativeRoutes}
                                      {/*<div className="flex flex-row gap-2">*/}
                                      {/*  /!* CAR *!/*/}
                                      {/*  <div className="px-2">*/}
                                      {/*    <CarIcon></CarIcon>*/}
                                      {/*  </div>*/}
                                      {/*  <div className="flex flex-col gap-2">*/}
                                      {/*    <div className="flex flex-row gap-5">*/}
                                      {/*      <div>*/}
                                      {/*        To*/}
                                      {/*        destination: {secondsToMinutes(allRouteMetrics['alternativeModeRoutes']['carTripGoing']['duration'])}*/}
                                      {/*      </div>*/}
                                      {/*      <div className="flex flex-row">*/}
                                      {/*        <div>*/}
                                      {/*          <ElevationIcon></ElevationIcon>*/}
                                      {/*        </div>*/}
                                      {/*        <div className="pr-2">*/}
                                      {/*          +{allRouteMetrics['alternativeModeRoutes']['carTripGoing']['elevationGained']}m*/}
                                      {/*        </div>*/}
                                      {/*        <div>*/}
                                      {/*          -{allRouteMetrics['alternativeModeRoutes']['carTripGoing']['elevationLost']}m*/}
                                      {/*        </div>*/}
                                      {/*      </div>*/}
                                      {/*    </div>*/}
                                      {/*    <div className="flex flex-row gap-5">*/}
                                      {/*      <div>*/}
                                      {/*        To*/}
                                      {/*        origin: {secondsToMinutes(allRouteMetrics['alternativeModeRoutes']['carTripComing']['duration'])}*/}
                                      {/*      </div>*/}
                                      {/*      <div className="flex flex-row">*/}
                                      {/*        <div>*/}
                                      {/*          <ElevationIcon></ElevationIcon>*/}
                                      {/*        </div>*/}
                                      {/*        <div className="pr-2">*/}
                                      {/*          +{allRouteMetrics['alternativeModeRoutes']['carTripComing']['elevationGained']}m*/}
                                      {/*        </div>*/}
                                      {/*        <div>*/}
                                      {/*          -{allRouteMetrics['alternativeModeRoutes']['carTripComing']['elevationLost']}m*/}
                                      {/*        </div>*/}
                                      {/*      </div>*/}
                                      {/*    </div>*/}
                                      {/*  </div>*/}
                                      {/*</div>*/}
                                      {/*/!* BICYCLE *!/*/}
                                      {/*<div className="flex flex-row gap-2 pt-3">*/}
                                      {/*  <div className="px-2">*/}
                                      {/*    <BicycleIcon></BicycleIcon>*/}
                                      {/*  </div>*/}
                                      {/*  <div className="flex flex-col gap-2">*/}

                                      {/*    <div className="flex flex-row gap-5">*/}
                                      {/*      <div>*/}
                                      {/*        To*/}
                                      {/*        origin: {secondsToMinutes(allRouteMetrics['alternativeModeRoutes']['bicycleTripComing']['duration'])}*/}
                                      {/*      </div>*/}
                                      {/*      <div className="flex flex-row">*/}
                                      {/*        <div>*/}
                                      {/*          <ElevationIcon></ElevationIcon>*/}
                                      {/*        </div>*/}
                                      {/*        <div className="pr-2">*/}
                                      {/*          +{allRouteMetrics['alternativeModeRoutes']['bicycleTripComing']['elevationGained']}m*/}
                                      {/*        </div>*/}
                                      {/*        <div>*/}
                                      {/*          -{allRouteMetrics['alternativeModeRoutes']['bicycleTripComing']['elevationLost']}m*/}
                                      {/*        </div>*/}
                                      {/*      </div>*/}
                                      {/*    </div>*/}
                                      {/*  </div>*/}
                                      {/*</div>*/}
                                      {/*/!* WALK *!/*/}
                                      {/*<div className="flex flex-row gap-2 pt-3">*/}
                                      {/*  <div className="px-2">*/}
                                      {/*    <WalkIcon></WalkIcon>*/}
                                      {/*  </div>*/}
                                      {/*  <div className="flex flex-col gap-2">*/}
                                      {/*    <div className="flex flex-row gap-5">*/}
                                      {/*      <div>*/}
                                      {/*        To*/}
                                      {/*        destination: {secondsToMinutes(allRouteMetrics['alternativeModeRoutes']['walkTripGoing']['duration'])}*/}
                                      {/*      </div>*/}
                                      {/*      <div className="flex flex-row">*/}
                                      {/*        <div>*/}
                                      {/*          <ElevationIcon></ElevationIcon>*/}
                                      {/*        </div>*/}
                                      {/*        <div className="pr-2">*/}
                                      {/*          +{allRouteMetrics['alternativeModeRoutes']['walkTripGoing']['elevationGained']}m*/}
                                      {/*        </div>*/}
                                      {/*        <div>*/}
                                      {/*          -{allRouteMetrics['alternativeModeRoutes']['walkTripGoing']['elevationLost']}m*/}
                                      {/*        </div>*/}
                                      {/*      </div>*/}
                                      {/*    </div>*/}
                                      {/*    <div className="flex flex-row gap-5">*/}
                                      {/*      <div>*/}
                                      {/*        To*/}
                                      {/*        origin: {secondsToMinutes(allRouteMetrics['alternativeModeRoutes']['walkTripComing']['duration'])}*/}
                                      {/*      </div>*/}
                                      {/*      <div className="flex flex-row">*/}
                                      {/*        <div>*/}
                                      {/*          <ElevationIcon></ElevationIcon>*/}
                                      {/*        </div>*/}
                                      {/*        <div className="pr-2">*/}
                                      {/*          +{allRouteMetrics['alternativeModeRoutes']['walkTripComing']['elevationGained']}m*/}
                                      {/*        </div>*/}
                                      {/*        <div>*/}
                                      {/*          -{allRouteMetrics['alternativeModeRoutes']['walkTripComing']['elevationLost']}m*/}
                                      {/*        </div>*/}
                                      {/*      </div>*/}
                                      {/*    </div>*/}
                                      {/*  </div>*/}
                                      {/*</div>*/}
                                    </div>
                                  </>
                                  :
                                  <>
                                  </>
                              }
                            </div>
                          </Carousel>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default ScoreDetailModal;

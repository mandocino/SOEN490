import React, {Fragment, useEffect, useState} from "react";
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
import {
  Dialog,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";
import {styled} from "@mui/material/styles";


const isDark = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;

let navButtonBackgroundColor = isDark ? "#10b981" : "#000";

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
  const [selectedDestination, setSelectedDestination] = useState("");
  const [allRouteMetrics, setAllRouteMetrics] = useState(null);
  const [currentRouteMetrics, setCurrentRouteMetrics] = useState(defaultRouteMetrics);
  const [alternativeRoutes, setAlternativeRoutes] = useState(null);
  const [selectedScoreTime, setSelectedScoreTime] = useState("Overall");

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: isDark
        ? "#0e3331"
        : "#059669",
      color: "white",
    },
  }))

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    height: '1/3',
    '&:nth-of-type(odd)': {
      backgroundColor: "white",
    },
    '&.MuiTableRow-head': {
      backgroundColor: '#0000'
    },
    '&:nth-of-type(even)': {
      backgroundColor: "lightgrey",
    },
  }));


  const openModal = () => {
    setIsOpen(true);
    fetchOverallSavedScore();
  };

  const closeModal = () => {
    setSelectedDestination("");
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
      <div className="flex flex-row items-center gap-5">
        <div className="my-1">
          {isGoing ? 'To destination: ' : 'To origin: '}
          {secondsToMinutes(allRouteMetrics['alternativeModeRoutes'][trip]['duration'])}
        </div>
        {
          isCar ? <> </> :
            <div className="flex flex-row gap-2 items-center">
              <div>
                <ElevationIcon className="fill-emerald-dark dark:fill-white mt-1 h-6 w-6" ></ElevationIcon>
              </div>
              <div className="flex flex-col text-xs">
                <div className="pr-2">
                  +{allRouteMetrics['alternativeModeRoutes'][trip]['elevationGained']}m
                </div>
                <div>
                  -{allRouteMetrics['alternativeModeRoutes'][trip]['elevationLost']}m
                </div>
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
      'walkTrip': <WalkIcon className="fill-emerald-dark dark:fill-white" />,
      'bicycleTrip': <BicycleIcon className="fill-emerald-dark dark:fill-white" />,
      'carTrip': <CarIcon className="fill-emerald-dark dark:fill-white" />
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
          <div key={mode} className="flex flex-row gap-2 items-center">
            <div className="px-2">
              {icons[mode]}
            </div>
            <div className="flex flex-col">
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
    const newSelection = event.target.value
    setSelectedDestination(newSelection);

    // Reset the selected score time to Overall
    setSelectedScoreTime("Overall");

    // Reset the current route metrics
    setCurrentRouteMetrics(defaultRouteMetrics);

    // Case where selected item in dropdown is All destinations
    if (newSelection === "") {
      fetchOverallSavedScore();
      setAllRouteMetrics(null);
      setSavedScores({});
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

  const handleSelectedScoreTime = (event, selectedTimeSlice) => {
    if (selectedTimeSlice !== null) {
      setSelectedScoreTime(selectedTimeSlice);

      if (selectedTimeSlice !== "" && allRouteMetrics) {
        let currentMetrics = {
          frequencyMin:
            `${allRouteMetrics[selectedTimeSlice]["trueFrequencyMetrics"]["min"]} minutes`,
          frequencyMax:
            `${allRouteMetrics[selectedTimeSlice]["trueFrequencyMetrics"]["max"]} minutes`,
          frequencyAvg:
            `${allRouteMetrics[selectedTimeSlice]["trueFrequencyMetrics"]["average"]} minutes`,
          durationMin:
            `${allRouteMetrics[selectedTimeSlice]["durationMetrics"]["min"]} minutes`,
          durationMax:
            `${allRouteMetrics[selectedTimeSlice]["durationMetrics"]["max"]} minutes`,
          durationAvg:
            `${allRouteMetrics[selectedTimeSlice]["durationMetrics"]["average"]} minutes`,
          walkMin:
            `${allRouteMetrics[selectedTimeSlice]["walkMetrics"]["min"]} minutes`,
          walkMax:
            `${allRouteMetrics[selectedTimeSlice]["walkMetrics"]["max"]} minutes`,
          walkAvg:
            `${allRouteMetrics[selectedTimeSlice]["walkMetrics"]["average"]} minutes`,
        };
        setCurrentRouteMetrics(currentMetrics);
      }
    }
  }

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

      <Dialog
        open={isOpen}
        onClose={closeModal}
        maxWidth='lg'
        fullWidth
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(8px)'
          },
          '& .MuiDialog-paper': {
            borderRadius: '1rem',
            padding: '1.5rem',
            background: isDark
              ? 'linear-gradient(to bottom right, #0a1e1d, #0c2927)'
              : 'linear-gradient(to bottom right, #fff, #d1fae5)',
            color: isDark
              ? '#fff'
              : '#0a1e1d'
          }
        }}
      >
        {/* Contents of the modal */}
        {/*  className="rounded-2xl bg-gradient-to-br from-white to-emerald-50 dark:from-emerald-900 dark:to-emerald-dark p-6 text-left align-middle shadow-xl" */}
        <div className="w-full flex flex-col">
          <DialogTitle
            as="h3"
            className="text-3xl font-semibold leading-snug text-transparent bg-clip-text bg-gradient-to-r from-emerald-900 to-emerald-dark dark:from-white dark:to-emerald-100 flex items-center "
            sx={{ p: 0}}
          >
            <div className="flex">
              <div className="inline flex flex-row">Details</div>
              <Tooltip
                title={
                  <div>
                    <span>Transit Score Description</span>
                    <div className="grid grid-cols-2">
                      <div>90-100</div>
                      <div>Rider's Paradise</div>
                      <div>70-89</div>
                      <div>Excellent Transit</div>
                      <div>50-69</div>
                      <div>Good Transit</div>
                      <div>25-49</div>
                      <div>Some Transit</div>
                      <div>0-24</div>
                      <div>Minimal Transit</div>
                    </div>
                  </div>
                }
                placement="right"
                className="pl-3"
              >
                <span className="flex items-center justify-center transition duration-300 text-emerald-dark dark:text-white hover:text-emerald-400 cursor-help">
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
                </span>
              </Tooltip>
            </div>
          </DialogTitle>

          <hr className="mb-4 border-emerald-900"></hr>
          <div className="mb-1">
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
            <div className="flex w-full items-center gap-2">
              <div className="text-2xl inline">{originLocation.name}</div>
              <RightArrowIcon className="inline"></RightArrowIcon>
              <FormControl className="grow">
                <InputLabel
                  id="destination-select-label"
                  sx={{
                    color: isDark
                      ? 'white !important'
                      : '#0a1e1d !important',
                  }}
                >
                  Destination
                </InputLabel>
                <Select
                  labelId="destination-select-label"
                  id="destination-select"
                  value={selectedDestination}
                  label="Destination"
                  onChange={onChangeDestinationDropdown}
                  sx={{
                    '& fieldset': {
                      borderColor: isDark
                        ? 'white !important'
                        : '#0a1e1d !important',
                    },
                    '& svg': {
                      color: isDark
                        ? 'white !important'
                        : '#0a1e1d !important',
                    },
                    color: isDark
                      ? 'white'
                      : '#0e3331'
                  }}
                >

                  <MenuItem key={0} value={""}>
                    <em>None</em>
                  </MenuItem>
                  {destinations.map(function (dest) {
                    return (
                      <MenuItem key={dest._id} value={dest._id}>
                        {dest.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
          </div>



          {/* Table contents */}
          <div className="w-full border dark:border-none border-emerald-50 bg-white dark:bg-black rounded-3xl p-4 flex shadow-xl flex-col mt-2">
                <div className="w-full flex gap-3 p-3">
                  {/* First column: Times */}
                  <div className="flex flex-col gap-2 items-center">
                    <ToggleButtonGroup
                      value={selectedScoreTime}
                      orientation="vertical"
                      exclusive
                      onChange={handleSelectedScoreTime}
                      aria-label="consistency importance"
                      sx={{
                        '& .MuiToggleButtonGroup-root': {
                          width: '100%',
                        },
                        '& .MuiToggleButtonGroup-grouped': {
                          height: '4rem',
                          margin: "0.125rem 0.125rem",
                          color: 'white',
                          lineHeight: 1.15,
                          backgroundColor: isDark
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(2, 44, 34, 0.8)',
                          '&.Mui-selected': {
                            backgroundColor: isDark
                              ? '#059669'
                              : '#10b981',
                            '&:hover, & .Mui-active': {
                              backgroundColor: "#34d399"
                            },
                          },
                          '&:hover, & .Mui-active': {
                            backgroundColor: "#34d399"
                          },
                          '& .MuiTouchRipple-child': {
                            backgroundColor: '#fff'
                          },
                        },
                        '& .Mui-disabled': {
                          color: 'gray !important'
                        }
                      }}
                    >
                      <ToggleButton value="overallMetrics" aria-label="left aligned" disabled>
                        <div className="w-full flex justify-between items-center gap-4">
                          <span>Overall</span>
                          <CircleWithText
                            size="w-12 h-12"
                            textClass="text-lg font-bold"
                            borderColor={savedScores.overallColor}
                            textColor={savedScores.overallColor}
                          >
                            {savedScores.overall}
                          </CircleWithText>
                        </div>
                      </ToggleButton>

                      <ToggleButton value="rushHourMetrics" aria-label="centered">
                        <div className="w-full flex justify-between items-center gap-4">
                          <span>Rush Hour</span>
                          <CircleWithText
                            size="w-12 h-12"
                            textClass="text-lg font-bold"
                            borderColor={savedScores.rushHourColor}
                            textColor={savedScores.rushHourColor}
                          >
                            {savedScores.rushHour}
                          </CircleWithText>
                        </div>
                      </ToggleButton>

                      <ToggleButton value="offPeakMetrics" aria-label="right aligned">
                        <div className="w-full flex justify-between items-center gap-4">
                          <span>Off Peak</span>
                          <CircleWithText
                            size="w-12 h-12"
                            textClass="text-lg font-bold"
                            borderColor={savedScores.offPeakColor}
                            textColor={savedScores.offPeakColor}
                          >
                            {savedScores.offPeak}
                          </CircleWithText>
                        </div>
                      </ToggleButton>

                      <ToggleButton value="weekendMetrics" aria-label="right aligned">
                        <div className="w-full flex justify-between items-center gap-4">
                          <span>Weekend</span>
                          <CircleWithText
                            size="w-12 h-12"
                            textClass="text-lg font-bold"
                            borderColor={savedScores.weekendColor}
                            textColor={savedScores.weekendColor}
                          >
                            {savedScores.weekend}
                          </CircleWithText>
                        </div>
                      </ToggleButton>

                      <ToggleButton value="overnightMetrics" aria-label="right aligned">
                        <div className="w-full flex justify-between items-center gap-4">
                          <span>Overnight</span>
                          <CircleWithText
                            size="w-12 h-12"
                            textClass="text-lg font-bold"
                            borderColor={savedScores.overnightColor}
                            textColor={savedScores.overnightColor}
                          >
                            {savedScores.overnight}
                          </CircleWithText>
                        </div>
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </div>

                  <div className="w-full h-full grow">
                    {/* Caroussel */}
                    <Carousel
                      autoPlay={false}
                      cycleNavigation={false}
                      duration={350}
                      swipe={false}
                      height={'18rem'}
                      navButtonsAlwaysVisible
                      className="text-emerald-darker dark:text-white drop-shadow-xl"
                      navButtonsProps={{
                        style: {
                          backgroundColor: navButtonBackgroundColor,
                        }
                      }}
                      sx={{
                        button: {
                          '&:hover': {
                            opacity: '1 !important'
                          },
                        }, buttonWrapper: {
                          '&:hover': {
                            '& $button': {
                              backgroundColor: "black", filter: "brightness(120%)", opacity: "1"
                            }
                          }
                        },
                      }}
                    >
                      {/* Routes List */}
                      <div className="flex flex-col  px-7 py-2 h-full w-full ">
                        <span>Route 1</span>
                        <span>Route 2</span>
                        <span>Route 3</span>
                        <span>Route 4</span>
                      </div>

                      {/* Alternative Modes */}
                      <div className="h-full rounded-3xl text-emerald-dark border border-emerald-50 dark:border-emerald-darkest dark:text-white bg-gradient-to-br from-white to-emerald-50 dark:from-emerald-darkest dark:to-black flex items-center justify-center p-2">
                        <div className="flex flex-col h-full">
                          <div className="text-lg font-semibold ">
                            Alternative modes of transport
                          </div>
                          {
                            selectedDestination === "" ?
                              /* Don't display alternative modes of transport if destination is not selected */
                              <div className={selectedDestination === "" ? "" : "hidden"}>
                                Please select a destination to view the alternative modes of transport route information
                              </div>
                              :
                              /* Display alternative modes of transport if destination is selected */
                              <div
                                className={`flex flex-col py-3 gap-2 items-left ${selectedDestination !== "" ? "" : "hidden"}`}>
                                {alternativeRoutes}
                              </div>
                          }
                        </div>


                      </div>

                      {/* Stats (min, max, avg...) */}
                      <div className="h-full w-full rounded-xl dark:border dark:border-emerald-darkest flex items-center justify-center">
                        <TableContainer sx={{height: '100%', borderRadius: '0.75rem'}}>
                          <Table aria-label="metrics table"
                          sx={{
                            height: '100%',
                            maxHeight: '100%',
                          }}>
                            <TableHead sx={{
                              height: '25%'
                            }}>
                              <StyledTableRow>
                                <StyledTableCell align="center">Metric</StyledTableCell>
                                <StyledTableCell align="center">Minimum</StyledTableCell>
                                <StyledTableCell align="center">Average</StyledTableCell>
                                <StyledTableCell align="center">Maximum</StyledTableCell>
                              </StyledTableRow>
                            </TableHead>
                            <TableBody sx={{height: '75%'}}>
                                <StyledTableRow
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                  <StyledTableCell align="center" component="th" scope="row">
                                    Frequency
                                  </StyledTableCell>
                                  <StyledTableCell align="center">{currentRouteMetrics.frequencyMin}</StyledTableCell>
                                  <StyledTableCell align="center">{currentRouteMetrics.frequencyAvg}</StyledTableCell>
                                  <StyledTableCell align="center">{currentRouteMetrics.frequencyMax}</StyledTableCell>
                                </StyledTableRow>

                                <StyledTableRow
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                  <StyledTableCell align="center" component="th" scope="row">
                                    Duration
                                  </StyledTableCell>
                                  <StyledTableCell align="center">{currentRouteMetrics.durationMin}</StyledTableCell>
                                  <StyledTableCell align="center">{currentRouteMetrics.durationAvg}</StyledTableCell>
                                  <StyledTableCell align="center">{currentRouteMetrics.durationMax}</StyledTableCell>
                                </StyledTableRow>

                                <StyledTableRow
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                  <StyledTableCell align="center" component="th" scope="row">
                                    Walk Time
                                  </StyledTableCell>
                                  <StyledTableCell align="center">{currentRouteMetrics.walkMin}</StyledTableCell>
                                  <StyledTableCell align="center">{currentRouteMetrics.walkAvg}</StyledTableCell>
                                  <StyledTableCell align="center">{currentRouteMetrics.walkMax}</StyledTableCell>
                                </StyledTableRow>

                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                    </Carousel>
                  </div>
                </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default ScoreDetailModal;

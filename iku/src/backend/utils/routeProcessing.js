import {
  getDurationMetrics,
  getFrequencyMetrics,
  getWaitTimeMetrics,
  getWalkTimeMetrics,
  handleGetAllRoutesOTP,
  removeBadRoutes,
  sliceRoutesList
} from './openTripPlanner.js';
import axios from "axios";
import * as thisModule from "./routeProcessing.js";


const defaultStartTime = "1:00am";
const defaultTimeWindow = 24 * 3600 + 900; // 24 hours, plus 15 minutes


export async function getRoutingData(
    origin,
    destination,
    startDates,
    routingPreferences,
    lastRoutingPrefChangeTime,
    loggedIn = false,
    searchStartTime = defaultStartTime,
    searchTimeWindow = defaultTimeWindow
) {

  const optionalParams = {
    searchWindow: searchTimeWindow,
    numItineraries: 0,
    walkReluctance: routingPreferences.walkReluctance
  };

  return await thisModule.handleGetRoutingData(origin, destination, startDates, searchStartTime, lastRoutingPrefChangeTime, loggedIn, optionalParams, routingPreferences.isWheelChair);
}

export async function handleGetRoutingData(
    origin,
    destination,
    startDates,
    time,
    lastRoutingPrefChangeTime,
    loggedIn=false,
    optionalParams=null,
    isWheelchair=false
){
  // Attempt to fetch the routes data from the db
  let fetchedData;
  let response;
  let routingData;

  if(typeof origin._id != "number" && typeof destination._id != "number" ) {
    fetchedData = await thisModule.fetchRoutingData(origin, destination);
  }

  // Grab the last time the system was updated (changes to algorithm, transit schedules update, etc...)
  const timeValues = await axios.get('http://localhost:5000/global/');
  const lastRoutingUpdateTime = timeValues.data.lastRoutingUpdateTime;

  // Compute metrics for scoring if there are none saved.
  // Or, re-compute them if the routing algorithm was updated.
  if (!fetchedData || fetchedData.generatedTime < lastRoutingUpdateTime || fetchedData.generatedTime < lastRoutingPrefChangeTime) {
    const generatedTime = Date.now();
    response = await generateMetricsSubroutine(origin, destination, startDates, time, loggedIn, optionalParams, isWheelchair);
    routingData = response.metrics;

    // Save the scores if the user is logged in
    if (loggedIn) {
      await thisModule.saveRoutingData(origin, destination, response, generatedTime)
    }
  } else {
    routingData = fetchedData.routingData;
  }
  return routingData;
}

/**
 * Fetch the scores for a defined origin, destination pair.
 * @param origin
 * @param destination
 * @returns {Promise<AxiosResponse<any>|void>}
 */
export async function fetchRoutingData(origin, destination) {
  // If a destination is specified, load scores for the specific origin/destination pair, else load for origin only
  const url =`http://localhost:5000/savedRoutingData/${origin._id}/${destination._id}`;
  return await axios.get(url, {
    params:
      {
        origin: origin,
        destination: destination
      }
  }).then((response) => {
    return response.data;
  }).catch(err => console.log(err));
}

/**
 * Saves the scores of a specific (origin, dstination) pair to the DB, or the weighted average scores of a specific
 * origin (in which case there is no destination).
 * @param origin
 * @param destination
 * @param routingData
 * @param generatedTime
 * @returns {Promise<void>}
 */
export async function saveRoutingData(origin, destination, routingData, generatedTime) {
  let routingDataParams =
    {
      origin: origin,
      destination: destination,
      generatedTime: generatedTime,
      routingData: routingData.metrics
    };

  await axios.post(`http://localhost:5000/editRoutingData/${origin._id}/${destination._id}`, routingDataParams);

  let itinerariesParams =
    {
      origin: origin,
      destination: destination,
      generatedTime: generatedTime,
      itineraries: routingData.itineraries
    };

  await axios.post(`http://localhost:5000/editItineraries/${origin._id}/${destination._id}`, itinerariesParams);
}


async function generateMetricsSubroutine(
    origin,
    destination,
    startDates,
    searchStartTime,
    loggedIn=false,
    optionalParams=null,
    isWheelchair=false
){
  const originCoords = `${origin.latitude},${origin.longitude}`;
  const destinationCoords = `${destination.latitude},${destination.longitude}`;

  const weekdayStartDate = startDates.weekdayStartDate;
  const saturdayStartDate = startDates.saturdayStartDate;
  const sundayStartDate = startDates.sundayStartDate;

  const weekdayToDestItineraries = await handleGetAllRoutesOTP(originCoords, destinationCoords, weekdayStartDate, searchStartTime, optionalParams, isWheelchair);
  const weekdayFromDestItineraries = await handleGetAllRoutesOTP(destinationCoords, originCoords, weekdayStartDate, searchStartTime, optionalParams, isWheelchair);
  const saturdayToDestItineraries = await handleGetAllRoutesOTP(originCoords, destinationCoords, saturdayStartDate, searchStartTime, optionalParams, isWheelchair);
  const saturdayFromDestItineraries = await handleGetAllRoutesOTP(destinationCoords, originCoords, saturdayStartDate, searchStartTime, optionalParams, isWheelchair);
  const sundayToDestItineraries = await handleGetAllRoutesOTP(originCoords, destinationCoords, sundayStartDate, searchStartTime, optionalParams, isWheelchair);
  const sundayFromDestItineraries = await handleGetAllRoutesOTP(destinationCoords, originCoords, sundayStartDate, searchStartTime, optionalParams, isWheelchair);

  // The day of the week for this search doesn't matter.
  const walkTripGoing = await handleGetAllRoutesOTP(originCoords, destinationCoords, weekdayStartDate, searchStartTime, null, isWheelchair, "WALK");
  const walkTripComing = await handleGetAllRoutesOTP(destinationCoords, originCoords, weekdayStartDate, searchStartTime, null, isWheelchair, "WALK");
  const bicycleTripGoing = await handleGetAllRoutesOTP(originCoords, destinationCoords, weekdayStartDate, searchStartTime, null, isWheelchair, "BICYCLE");
  const bicycleTripComing = await handleGetAllRoutesOTP(destinationCoords, originCoords, weekdayStartDate, searchStartTime, null, isWheelchair, "BICYCLE");
  const carTripGoing = await handleGetAllRoutesOTP(originCoords, destinationCoords, weekdayStartDate, searchStartTime, null, isWheelchair, "CAR");
  const carTripComing = await handleGetAllRoutesOTP(destinationCoords, originCoords, weekdayStartDate, searchStartTime, null, isWheelchair, "CAR");

  const alternativeModeRoutes = {
    name: `${origin.name}-${destination.name}-alternativeModeRoutes`,
    walkTripGoing: walkTripGoing[0],
    walkTripComing: walkTripComing[0],
    bicycleTripGoing: bicycleTripGoing[0],
    bicycleTripComing: bicycleTripComing[0],
    carTripGoing: carTripGoing[0],
    carTripComing: carTripComing[0]
  }

  let trimmedItineraries = {}
  const itineraries = {
    weekdayToDestItineraries: weekdayToDestItineraries,
    weekdayFromDestItineraries: weekdayFromDestItineraries,
    saturdayToDestItineraries: saturdayToDestItineraries,
    saturdayFromDestItineraries: saturdayFromDestItineraries,
    sundayToDestItineraries: sundayToDestItineraries,
    sundayFromDestItineraries: sundayFromDestItineraries
  }

  for (const [key, value] of Object.entries(itineraries)) {
    let trimmed = [];
    for (let i of value) {
      let itinerary = {...i}
      let legs = [];
      for (let j of i.legs) {
        const numIntermediateStops = j.hasOwnProperty('intermediateStops') ? j.intermediateStops.length : null;
        legs.push({
          startTime: j.startTime || null,
          endTime: j.endTime || null,
          agencyName: j.agencyName || null,
          distance: j.distance || null,
          duration: j.duration || null,
          headsign: j.headsign || null,
          mode: j.mode || null,
          numIntermediateStops: numIntermediateStops,
          route: j.route || null,
          routeColor: j.routeColor || null,
          routeId: j.routeId || null,
          routeLongName: j.routeLongName || null,
          routeShortName: j.routeShortName || null,
          from: {
            name: j.from.name || null,
            stopCode: j.from.stopCode || null,
            lon: j.from.lon || null,
            lat: j.from.lat || null
          },
          to: {
            name: j.to.name || null,
            stopCode: j.to.stopCode || null,
            lon: j.to.lon || null,
            lat: j.to.lat || null
          }
        });
      }
      itinerary.legs = legs;
      trimmed.push(itinerary)
    }
    trimmedItineraries[key] = trimmed;
  }


  const rushHourMetrics = processRushHourItineraries(
      weekdayToDestItineraries,
      weekdayFromDestItineraries
  );
  const offPeakMetrics = processOffPeakItineraries(
      weekdayToDestItineraries,
      weekdayFromDestItineraries
  );
  const overnightMetrics = processOvernightItineraries(
      weekdayToDestItineraries,
      weekdayFromDestItineraries,
      saturdayToDestItineraries,
      saturdayFromDestItineraries,
      sundayToDestItineraries,
      sundayFromDestItineraries
  );
  const weekendMetrics = processWeekendItineraries(
      saturdayToDestItineraries,
      saturdayFromDestItineraries,
      sundayToDestItineraries,
      sundayFromDestItineraries
  );

  return {
    metrics: {
      rushHourMetrics: rushHourMetrics,
      offPeakMetrics: offPeakMetrics,
      overnightMetrics: overnightMetrics,
      weekendMetrics: weekendMetrics,
      alternativeModeRoutes: alternativeModeRoutes,
    },
    itineraries: trimmedItineraries
  }
}

function processRushHourItineraries(
    weekdayToDestItineraries,
    weekdayFromDestItineraries
) {
  const toDestStartDate = new Date("2023-03-27T06:00:00.000-04:00").getTime();
  const toDestEndDate = new Date("2023-03-27T10:15:00.000-04:00").getTime();
  const fromDestStartDate = new Date("2023-03-27T15:00:00.000-04:00").getTime();
  const fromDestEndDate = new Date("2023-03-27T19:15:00.000-04:00").getTime();

  const processedToDestItineraries = processItineraries(weekdayToDestItineraries, toDestStartDate, toDestEndDate);
  const processedFromDestItineraries = processItineraries(weekdayFromDestItineraries, fromDestStartDate, fromDestEndDate);

  const processedItineraries = [processedToDestItineraries, processedFromDestItineraries];
  return computeMetricsFromList(processedItineraries);
}

function processOffPeakItineraries(
    weekdayToDestItineraries,
    weekdayFromDestItineraries
) {
  const toDestStartDate = new Date("2023-03-27T10:00:00.000-04:00").getTime();
  const toDestEndDate = new Date("2023-03-28T01:15:00.000-04:00").getTime();
  const fromDestStartDate1 = new Date("2023-03-27T06:00:00.000-04:00").getTime();
  const fromDestEndDate1 = new Date("2023-03-27T15:15:00.000-04:00").getTime();
  const fromDestStartDate2 = new Date("2023-03-27T19:00:00.000-04:00").getTime();
  const fromDestEndDate2 = new Date("2023-03-28T01:15:00.000-04:00").getTime();

  const processedToDestItineraries = processItineraries(weekdayToDestItineraries, toDestStartDate, toDestEndDate);
  const processedFromDestItineraries1 = processItineraries(weekdayFromDestItineraries, fromDestStartDate1, fromDestEndDate1);
  const processedFromDestItineraries2 = processItineraries(weekdayFromDestItineraries, fromDestStartDate2, fromDestEndDate2);

  const processedItineraries = [processedToDestItineraries, processedFromDestItineraries1, processedFromDestItineraries2];
  return computeMetricsFromList(processedItineraries);
}

function processOvernightItineraries(
    weekdayToDestItineraries,
    weekdayFromDestItineraries,
    saturdayToDestItineraries,
    saturdayFromDestItineraries,
    sundayToDestItineraries,
    sundayFromDestItineraries
) {
  // Recall: Friday night is saturday AM, saturday night is sunday AM.
  // Renaming these variables will help with readability.
  const fridayNightToDestItineraries = saturdayToDestItineraries;
  const fridayNightFromDestItineraries = saturdayFromDestItineraries;
  const saturdayNightToDestItineraries = sundayToDestItineraries;
  const saturdayNightFromDestItineraries = sundayFromDestItineraries;

  const weeknightStartDate = new Date("2023-03-27T01:00:00.000-04:00").getTime();
  const weeknightEndDate = new Date("2023-03-27T05:15:00.000-04:00").getTime();

  // Recall: Friday night is saturday AM
  const fridayStartDate = new Date("2023-04-01T01:00:00.000-04:00").getTime();
  const fridayEndDate = new Date("2023-04-01T05:15:00.000-04:00").getTime();

  // Recall: Saturday night is sunday AM
  const saturdayStartDate = new Date("2023-04-02T01:00:00.000-04:00").getTime();
  const saturdayEndDate = new Date("2023-04-02T05:15:00.000-04:00").getTime();

  const processedToDestItineraries = processItineraries(weekdayToDestItineraries, weeknightStartDate, weeknightEndDate);
  const processedFromDestItineraries = processItineraries(weekdayFromDestItineraries, weeknightStartDate, weeknightEndDate);
  const processedFridayToDestItineraries = processItineraries(fridayNightToDestItineraries, fridayStartDate, fridayEndDate);
  const processedFridayFromDestItineraries = processItineraries(fridayNightFromDestItineraries, fridayStartDate, fridayEndDate);
  const processedSaturdayToDestItineraries = processItineraries(saturdayNightToDestItineraries, saturdayStartDate, saturdayEndDate);
  const processedSaturdayFromDestItineraries = processItineraries(saturdayNightFromDestItineraries, saturdayStartDate, saturdayEndDate);

  const processedItineraries = [
    processedToDestItineraries,
    processedFromDestItineraries,
    processedFridayToDestItineraries,
    processedFridayFromDestItineraries,
    processedSaturdayToDestItineraries,
    processedSaturdayFromDestItineraries
  ];

  return computeMetricsFromList(processedItineraries);
}

function processWeekendItineraries(
    saturdayToDestItineraries,
    saturdayFromDestItineraries,
    sundayToDestItineraries,
    sundayFromDestItineraries
) {
  const saturdayStartDate = new Date("2023-04-01T05:00:00.000-04:00").getTime();
  const saturdayEndDate = new Date("2023-04-02T01:15:00.000-04:00").getTime();
  const sundayStartDate = new Date("2023-04-02T05:00:00.000-04:00").getTime();
  const sundayEndDate = new Date("2023-04-03T01:15:00.000-04:00").getTime();

  const processedSaturdayToDestItineraries = processItineraries(saturdayToDestItineraries, saturdayStartDate, saturdayEndDate);
  const processedSaturdayFromDestItineraries = processItineraries(saturdayFromDestItineraries, saturdayStartDate, saturdayEndDate);
  const processedSundayToDestItineraries = processItineraries(sundayToDestItineraries, sundayStartDate, sundayEndDate);
  const processedSundayFromDestItineraries = processItineraries(sundayFromDestItineraries, sundayStartDate, sundayEndDate);

  const processedItineraries = [
    processedSaturdayToDestItineraries,
    processedSaturdayFromDestItineraries,
    processedSundayToDestItineraries,
    processedSundayFromDestItineraries
  ];
  return computeMetricsFromList(processedItineraries);
}


/**
 * Function to process a list of itineraries by cleaning it and computing metrics based off of the resulting list.
 * @param itineraries The list of itineraries to process
 * @param startDate Any routes that start before this date (in ms) will be ignored
 * @param endDate Any routes that start after this date (in ms) will be ignored
 * @param considerGap Whether or not to consider if there is an excessive gap between startTime and the first route (or
 * between the last route and endTime) and attempt to mitigate for it accordingly.
 * @returns {{waitMetrics: {minWaitTime: number, averageWaitTime: number, maxWaitTime: number, standardDeviationWaitTime: number}, endCutoff: null, durationMetrics: {averageDurationTime: number, maxDurationTime: number, standardDeviationDurationTime: number, minDurationTime: number}, startCutoff: null, walkMetrics: {minWalkTime: number, averageWalkTime: number, maxWalkTime: number, standardDeviationWalkTime: number}, frequencyMetrics: {standardDeviationGap: number, averageGap: number, maxGap: number, minGap: number}}}
 */
export function processItineraries(itineraries, startDate, endDate, considerGap = true) {

  const slicedItineraries = sliceRoutesList(itineraries, startDate, endDate, "START_MODE");
  const cleanedItineraries = removeBadRoutes(slicedItineraries);

  const trueFrequencyMetrics = getFrequencyMetrics(cleanedItineraries);
  let frequencyMetrics = getFrequencyMetrics(cleanedItineraries);
  const durationMetrics = getDurationMetrics(cleanedItineraries);
  const walkMetrics = getWalkTimeMetrics(cleanedItineraries);
  const waitMetrics = getWaitTimeMetrics(cleanedItineraries);

  let startCutoff = null;
  let endCutoff = null;

  if (cleanedItineraries.length >= 1) {
    startCutoff = cleanedItineraries[0].startTime;
    endCutoff = cleanedItineraries[cleanedItineraries.length - 1].startTime;

    if (cleanedItineraries.length >= 2) {
      let modifiedItineraries = null;
      const minimumGapToConsider = frequencyMetrics.averageGap + frequencyMetrics.standardDeviationGap;

      if (considerGap && startCutoff - startDate >= minimumGapToConsider) {
        modifiedItineraries = structuredClone(cleanedItineraries);
        modifiedItineraries.unshift({startTime: startDate});
      }

      if (considerGap && endDate - endCutoff >= minimumGapToConsider) {
        if (modifiedItineraries === null) {
          modifiedItineraries = structuredClone(cleanedItineraries);
        }
        modifiedItineraries.push({startTime: endDate});
      }

      if (modifiedItineraries !== null) {
        frequencyMetrics = getFrequencyMetrics(modifiedItineraries);
      }
    }
  }

  return {
    startCutoff: startCutoff,
    endCutoff: endCutoff,
    trueFrequencyMetrics: trueFrequencyMetrics,
    frequencyMetrics: frequencyMetrics,
    durationMetrics: durationMetrics,
    walkMetrics: walkMetrics,
    waitMetrics: waitMetrics
  };
}


function computeMetricsFromList(processedItineraries) {
  let metrics = []

  for (let i of processedItineraries) {
    let currentFrequencyMetrics;
    let currentTrueFrequencyMetrics;
    let currentDurationMetrics;
    let currentWalkMetrics;

    if (i.frequencyMetrics == null) {
      currentFrequencyMetrics = null;
    } else {
      // Normalize metrics from milliseconds to minutes, and provide them in the format expected by calculateScore()
      currentFrequencyMetrics = {
        max: i.frequencyMetrics.maxGap/60000,
        min: i.frequencyMetrics.minGap/60000,
        average: i.frequencyMetrics.averageGap/60000,
        standardDeviation: i.frequencyMetrics.standardDeviationGap/60000
      };
    }

    if (i.trueFrequencyMetrics == null) {
      currentTrueFrequencyMetrics = null;
    } else {
      // Normalize metrics from milliseconds to minutes, and provide them in the format expected by calculateScore()
      currentTrueFrequencyMetrics = {
        max: i.trueFrequencyMetrics.maxGap/60000,
        min: i.trueFrequencyMetrics.minGap/60000,
        average: i.trueFrequencyMetrics.averageGap/60000,
        standardDeviation: i.trueFrequencyMetrics.standardDeviationGap/60000
      };
    }

    if (i.durationMetrics == null) {
      currentDurationMetrics = null;
    } else {
      // Normalize metrics from seconds to minutes, and provide them in the format expected by calculateScore()
      currentDurationMetrics = {
        max: i.durationMetrics.maxDurationTime/60,
        min: i.durationMetrics.minDurationTime/60,
        average: i.durationMetrics.averageDurationTime/60,
        standardDeviation: i.durationMetrics.standardDeviationDurationTime/60
      }
    }

    if (i.walkMetrics == null) {
      currentWalkMetrics = null;
    } else {
      // Normalize metrics from seconds to minutes, and provide them in the format expected by calculateScore()
      currentWalkMetrics = {
        max: i.walkMetrics.maxWalkTime/60,
        min: i.walkMetrics.minWalkTime/60,
        average: i.walkMetrics.averageWalkTime/60,
        standardDeviation: i.walkMetrics.standardDeviationWalkTime/60
      };
    }
    metrics.push({
      frequencyMetrics: currentFrequencyMetrics,
      trueFrequencyMetrics: currentTrueFrequencyMetrics,
      durationMetrics: currentDurationMetrics,
      walkMetrics: currentWalkMetrics
    })
  }

  return metrics;
}

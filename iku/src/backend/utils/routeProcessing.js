import {
  getDurationMetrics,
  getFrequencyMetrics,
  getWaitTimeMetrics,
  getWalkTimeMetrics,
  handleGetAllRoutesOTP,
  removeBadRoutes,
  sliceRoutesList
} from './openTripPlanner.js';


const defaultStartTime = "1:00am";
const defaultTimeWindow = 24 * 3600 + 900; // 24 hours, plus 15 minutes


export async function getItinerariesFromOTP(origin, destination, startDates, searchStartTime = defaultStartTime, searchTimeWindow = defaultTimeWindow) {
  const originCoords = `${origin.latitude},${origin.longitude}`;
  const destinationCoords = `${destination.latitude},${destination.longitude}`;

  const weekdayStartDate = startDates.weekdayStartDate;
  const saturdayStartDate = startDates.saturdayStartDate;
  const sundayStartDate = startDates.sundayStartDate;
  const optionalParams = {
    searchWindow: searchTimeWindow, numItineraries: 0, walkReluctance: 2
  };

  const weekdayToDestItineraries = await handleGetAllRoutesOTP(originCoords, destinationCoords, weekdayStartDate, searchStartTime, optionalParams);
  const weekdayFromDestItineraries = await handleGetAllRoutesOTP(destinationCoords, originCoords, weekdayStartDate, searchStartTime, optionalParams);
  const saturdayToDestItineraries = await handleGetAllRoutesOTP(originCoords, destinationCoords, saturdayStartDate, searchStartTime, optionalParams);
  const saturdayFromDestItineraries = await handleGetAllRoutesOTP(destinationCoords, originCoords, saturdayStartDate, searchStartTime, optionalParams);
  const sundayToDestItineraries = await handleGetAllRoutesOTP(originCoords, destinationCoords, sundayStartDate, searchStartTime, optionalParams);
  const sundayFromDestItineraries = await handleGetAllRoutesOTP(destinationCoords, originCoords, sundayStartDate, searchStartTime, optionalParams);

  // The day of the week for this search doesn't matter.
  const walkTripGoing = await handleGetAllRoutesOTP(originCoords, destinationCoords, weekdayStartDate, searchStartTime, null, "WALK");
  const walkTripComing = await handleGetAllRoutesOTP(destinationCoords, originCoords, weekdayStartDate, searchStartTime, null, "WALK");
  const bicycleTripGoing = await handleGetAllRoutesOTP(originCoords, destinationCoords, weekdayStartDate, searchStartTime, null, "BICYCLE");
  const bicycleTripComing = await handleGetAllRoutesOTP(destinationCoords, originCoords, weekdayStartDate, searchStartTime, null, "BICYCLE");

  const walkBikeRoutes = {
    name: `${origin.name}-${destination.name}-walkBikeRoutes`,
    walkTripGoing: walkTripGoing[0],
    walkTripComing: walkTripComing[0],
    bicycleTripGoing: bicycleTripGoing[0],
    bicycleTripComing: bicycleTripComing[0]
  }

  return {
    weekdayToDestItineraries: weekdayToDestItineraries,
    weekdayFromDestItineraries: weekdayFromDestItineraries,
    saturdayToDestItineraries: saturdayToDestItineraries,
    saturdayFromDestItineraries: saturdayFromDestItineraries,
    sundayToDestItineraries: sundayToDestItineraries,
    sundayFromDestItineraries: sundayFromDestItineraries,
    walkBikeRoutes: walkBikeRoutes
  };
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
    frequencyMetrics: frequencyMetrics,
    durationMetrics: durationMetrics,
    walkMetrics: walkMetrics,
    waitMetrics: waitMetrics
  };
}

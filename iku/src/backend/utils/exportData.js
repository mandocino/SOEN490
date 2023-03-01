import {
    getDurationMetrics,
    getFrequencyMetrics,
    getWaitTimeMetrics,
    getWalkTimeMetrics,
    handleGetAllRoutesOTP,
    removeBadRoutes,
    sliceRoutesList
} from "./openTripPlanner.js";


export async function generateJsonData(origin, destination, exportDownloadableFile=true) {
  // IMPORTANT
  // Coords must be a string of the format "latitude,longitude"
  const originCoords = `${origin.latitude},${origin.longitude}`;
  const destinationCoords = `${destination.latitude},${destination.longitude}`;
  const weekdayStartDate = "2023-02-20";
  const saturdayStartDate = "2023-02-25";
  const sundayStartDate = "2023-02-26";
  const searchStartTime = "1:00am";
  const searchTimeWindow = 24*3600+900; // 24 hours, plus 15 minutes
  const optionalParams = {
    searchWindow: searchTimeWindow,
    numItineraries: 0,
    walkReluctance: 2
  };

  const weekdayToDestItineraries = await handleGetAllRoutesOTP(originCoords, destinationCoords, weekdayStartDate, searchStartTime, optionalParams);
  const weekdayFromDestItineraries = await handleGetAllRoutesOTP(destinationCoords, originCoords, weekdayStartDate, searchStartTime, optionalParams);
  const saturdayToDestItineraries = await handleGetAllRoutesOTP(originCoords, destinationCoords, saturdayStartDate, searchStartTime, optionalParams);
  const saturdayFromDestItineraries = await handleGetAllRoutesOTP(destinationCoords, originCoords, saturdayStartDate, searchStartTime, optionalParams);
  const sundayToDestItineraries = await handleGetAllRoutesOTP(originCoords, destinationCoords, sundayStartDate, searchStartTime, optionalParams);
  const sundayFromDestItineraries = await handleGetAllRoutesOTP(destinationCoords, originCoords, sundayStartDate, searchStartTime, optionalParams);

  let toDestStartDate;
  let toDestEndDate;
  let fromDestStartDate;
  let fromDestEndDate;
  let sliceName;

  let toDestItineraries;
  let fromDestItineraries;

  let jsonArr = [];

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

  jsonArr.push(walkBikeRoutes);


  /**
   * The time slices are as such:
   * Rush hour: 6am-10am weekday to dest, 3pm-7pm weekday from dest
   * Off-peak:  6am-1am both directions except when not rush hour.
   * Overnight: 1am-5am both directions (friday and/or saturday night service is SOMETIMES enhanced)
   * Weekend:   5am-1am both directions saturday and sunday
   *
   * Corresponding cases:
   * case 0: Rush hour:       weekday 6-10am origin->dest + 3-7pm dest->origin
   * case 1: Off peak:        weekday 10am-1am origin->dest + 6am->3pm dest->origin
   * case 2: Off peak (cont): weekday 7pm-1am dest->origin
   * case 3: Weeknight:       weeknight 1am-5am both directions
   * case 4: Friday night:    saturday 1am-5am both directions (friday night is saturday AM)
   * case 5: Saturday:        saturday 5am-1am both directions
   * case 6: Saturday night:  sunday 1am-5am both directions (saturday night is sunday AM)
   * case 7: Sunday:          sunday 5am-1am both directions
   */
  for (let i=0; i<8; i++) {
    // No need for a default case in this switch.
    // eslint-disable-next-line
    switch(i) {
      case 0: // rush hour
        toDestStartDate = new Date("2023-02-20T06:00:00.000-05:00").getTime();
        toDestEndDate = new Date("2023-02-20T10:15:00.000-05:00").getTime();
        fromDestStartDate = new Date("2023-02-20T15:00:00.000-05:00").getTime();
        fromDestEndDate = new Date("2023-02-20T19:15:00.000-05:00").getTime();
        sliceName = "rushHour";
        break;
      case 1: // off-peak 1
        toDestStartDate = new Date("2023-02-20T10:00:00.000-05:00").getTime();
        toDestEndDate = new Date("2023-02-21T01:15:00.000-05:00").getTime();
        fromDestStartDate = new Date("2023-02-20T06:00:00.000-05:00").getTime();
        fromDestEndDate = new Date("2023-02-20T15:15:00.000-05:00").getTime();
        sliceName = "offPeak1";
        break;
      case 2: // off-peak 2
        toDestStartDate = null
        toDestEndDate = null
        fromDestStartDate = new Date("2023-02-20T19:00:00.000-05:00").getTime();
        fromDestEndDate = new Date("2023-02-21T01:15:00.000-05:00").getTime();
        sliceName = "offPeak2";
        break;
      case 3: // weeknight
        toDestStartDate = new Date("2023-02-20T01:00:00.000-05:00").getTime();
        toDestEndDate = new Date("2023-02-20T05:15:00.000-05:00").getTime();
        fromDestStartDate = new Date("2023-02-20T01:00:00.000-05:00").getTime();
        fromDestEndDate = new Date("2023-02-20T05:15:00.000-05:00").getTime();
        sliceName = "night1";
        break;
      case 4: // friday night
        toDestStartDate = new Date("2023-02-25T01:00:00.000-05:00").getTime();
        toDestEndDate = new Date("2023-02-25T05:15:00.000-05:00").getTime();
        fromDestStartDate = new Date("2023-02-25T01:00:00.000-05:00").getTime();
        fromDestEndDate = new Date("2023-02-25T05:15:00.000-05:00").getTime();
        sliceName = "night2";
        break;
      case 5: // saturday
        toDestStartDate = new Date("2023-02-25T05:00:00.000-05:00").getTime();
        toDestEndDate = new Date("2023-02-26T01:15:00.000-05:00").getTime();
        fromDestStartDate = new Date("2023-02-25T05:00:00.000-05:00").getTime();
        fromDestEndDate = new Date("2023-02-26T01:15:00.000-05:00").getTime();
        sliceName = "weekend1";
        break;
      case 6: // saturday night
        toDestStartDate = new Date("2023-02-26T01:00:00.000-05:00").getTime();
        toDestEndDate = new Date("2023-02-26T05:15:00.000-05:00").getTime();
        fromDestStartDate = new Date("2023-02-26T01:00:00.000-05:00").getTime();
        fromDestEndDate = new Date("2023-02-26T05:15:00.000-05:00").getTime();
        sliceName = "night3";
        break;
      case 7: // sunday
        toDestStartDate = new Date("2023-02-26T05:00:00.000-05:00").getTime();
        toDestEndDate = new Date("2023-02-27T01:15:00.000-05:00").getTime();
        fromDestStartDate = new Date("2023-02-26T05:00:00.000-05:00").getTime();
        fromDestEndDate = new Date("2023-02-27T01:15:00.000-05:00").getTime();
        sliceName = "weekend2";
        break;
    }

    // Saturday itineraries
    if (i === 4 || i === 5) {
      toDestItineraries = saturdayToDestItineraries;
      fromDestItineraries = saturdayFromDestItineraries;
    }

    // Sunday itineraries
    else if (i === 6 || i === 7) {
      toDestItineraries = sundayToDestItineraries;
      fromDestItineraries = sundayFromDestItineraries;
    }

    // Weekday itineraries
    else {
      toDestItineraries = weekdayToDestItineraries;
      fromDestItineraries = weekdayFromDestItineraries;
    }

    const slicedToDestItineraries = sliceRoutesList(toDestItineraries, toDestStartDate, toDestEndDate, "START_MODE");
    const slicedFromDestItineraries = sliceRoutesList(fromDestItineraries, fromDestStartDate, fromDestEndDate, "START_MODE");

    const cleanedToDestItineraries = removeBadRoutes(slicedToDestItineraries);
    const cleanedFromDestItineraries = removeBadRoutes(slicedFromDestItineraries);

    const itineraries = i !== 2 ? [cleanedToDestItineraries, cleanedFromDestItineraries] : [cleanedFromDestItineraries];

    for (let j of itineraries) {
      let direction;
      let startDate;
      let endDate;

      if (j === cleanedFromDestItineraries) {
        direction = "fromDest";
        startDate = fromDestStartDate;
        endDate = fromDestEndDate;
      } else {
        direction = "toDest";
        startDate = toDestStartDate;
        endDate = toDestEndDate;
      }


      let frequencyMetrics = getFrequencyMetrics(j);
      const durationMetrics = getDurationMetrics(j);
      const walkMetrics = getWalkTimeMetrics(j);
      const waitMetrics = getWaitTimeMetrics(j);

      let startCutoff = null;
      let endCutoff = null;

      if (j.length >= 1) {
        startCutoff = j[0].startTime;
        endCutoff = j[j.length - 1].startTime;

        if (j.length >= 2) {
          let modifiedItineraries = null;
          const minimumGapToConsider = frequencyMetrics.averageGap + frequencyMetrics.standardDeviationGap;

          if (startCutoff-startDate >= minimumGapToConsider) {
            modifiedItineraries = structuredClone(j);
            modifiedItineraries.unshift({startTime: startDate});
          }

          if (endDate-endCutoff >= minimumGapToConsider) {
            if (modifiedItineraries === null) {
              modifiedItineraries = structuredClone(j);
            }
            modifiedItineraries.push({startTime: endDate});
          }

          if (modifiedItineraries !== null) {
            frequencyMetrics = getFrequencyMetrics(modifiedItineraries);
          }
        }
      }

      const json = {
        name: `${origin.name}-${destination.name}-${sliceName}-${direction}`,
        route: `${origin.name} --> ${destination.name} (${originCoords} --> ${destinationCoords})`,
        direction: direction,
        sliceName: sliceName,
        startCutoff: startCutoff,
        endCutoff: endCutoff,
        itineraries: j,
        frequencyMetrics: frequencyMetrics,
        durationMetrics: durationMetrics,
        walkMetrics: walkMetrics,
        waitMetrics: waitMetrics
      }

      jsonArr.push(json);
    }
  }

  if (exportDownloadableFile) {
      let blob = new Blob([JSON.stringify(jsonArr)], { type: 'application/json' })

      let elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = `${origin.name}-${destination.name}-routes.json`;
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
  }

  return jsonArr;
}

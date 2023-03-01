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
  const weekdayStartTime = "1:00am";
  const timeWindow = 24*3600+900; // 24 hours, plus 15 minutes
  const optionalParams = {
    searchWindow: timeWindow,
    numItineraries: 0,
    walkReluctance: 2
  };

  const toDestItineraries = await handleGetAllRoutesOTP(originCoords, destinationCoords, weekdayStartDate, weekdayStartTime, optionalParams);
  const fromDestItineraries = await handleGetAllRoutesOTP(destinationCoords, originCoords, weekdayStartDate, weekdayStartTime, optionalParams);

  let toDestStartDate;
  let toDestEndDate;
  let fromDestStartDate;
  let fromDestEndDate;
  let sliceName;

  let jsonArr = [];

  for (let i=0; i<4; i++) {
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
      case 3: // overnight
        toDestStartDate = new Date("2023-02-20T01:00:00.000-05:00").getTime();
        toDestEndDate = new Date("2023-02-20T04:30:00.000-05:00").getTime();
        fromDestStartDate = new Date("2023-02-20T01:00:00.000-05:00").getTime();
        fromDestEndDate = new Date("2023-02-20T04:30:00.000-05:00").getTime();
        sliceName = "night";
        break;
    }

    const rushHourToDestItineraries = sliceRoutesList(toDestItineraries, toDestStartDate, toDestEndDate, "START_MODE");
    const rushHourFromDestItineraries = sliceRoutesList(fromDestItineraries, fromDestStartDate, fromDestEndDate, "START_MODE");

    const rushHourToDestCleanedItineraries = removeBadRoutes(rushHourToDestItineraries);
    const rushHourFromDestCleanedItineraries = removeBadRoutes(rushHourFromDestItineraries);

    const itineraries = i !== 2 ? [rushHourToDestCleanedItineraries, rushHourFromDestCleanedItineraries] : [rushHourFromDestCleanedItineraries];

    for (let j of itineraries) {
      let direction;
      let startDate;
      let endDate;

      if (j === rushHourFromDestCleanedItineraries) {
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

      const walkTripGoing = await handleGetAllRoutesOTP(originCoords, destinationCoords, weekdayStartDate, weekdayStartTime, null, "WALK");
      const walkTripComing = await handleGetAllRoutesOTP(destinationCoords, originCoords, weekdayStartDate, weekdayStartTime, null, "WALK");
      const bicycleTripGoing = await handleGetAllRoutesOTP(originCoords, destinationCoords, weekdayStartDate, weekdayStartTime, null, "BICYCLE");
      const bicycleTripComing = await handleGetAllRoutesOTP(destinationCoords, originCoords, weekdayStartDate, weekdayStartTime, null, "BICYCLE");

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
        waitMetrics: waitMetrics,
        walkTripGoing: walkTripGoing[0],
        walkTripComing: walkTripComing[0],
        bicycleTripGoing: bicycleTripGoing[0],
        bicycleTripComing: bicycleTripComing[0]
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

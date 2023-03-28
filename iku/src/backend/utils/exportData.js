import {sliceRoutesList} from "./openTripPlanner.js";
import {getItinerariesFromOTP, processItineraries} from "./routeProcessing.js";


export async function generateJsonData(origin, destination, exportDownloadableFile=true) {
  // IMPORTANT
  // Coords must be a string of the format "latitude,longitude"
  const originCoords = `${origin.latitude},${origin.longitude}`;
  const destinationCoords = `${destination.latitude},${destination.longitude}`;
  const startDates = {
    weekdayStartDate: "2023-03-27",
    saturdayStartDate: "2023-04-01",
    sundayStartDate: "2023-04-02"
  }

  const itineraries = await getItinerariesFromOTP(origin, destination, startDates);

  const weekdayToDestItineraries = itineraries.weekdayToDestItineraries;
  const weekdayFromDestItineraries = itineraries.weekdayFromDestItineraries;
  const saturdayToDestItineraries = itineraries.saturdayToDestItineraries;
  const saturdayFromDestItineraries = itineraries.saturdayFromDestItineraries;
  const sundayToDestItineraries = itineraries.sundayToDestItineraries;
  const sundayFromDestItineraries = itineraries.sundayFromDestItineraries;

  let toDestStartDate;
  let toDestEndDate;
  let fromDestStartDate;
  let fromDestEndDate;
  let sliceName;

  let toDestItineraries;
  let fromDestItineraries;

  let jsonArr = [];

  jsonArr.push(itineraries.alternativeModeRoutes);


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
        toDestStartDate = new Date("2023-03-27T06:00:00.000-05:00").getTime();
        toDestEndDate = new Date("2023-03-27T10:15:00.000-05:00").getTime();
        fromDestStartDate = new Date("2023-03-27T15:00:00.000-05:00").getTime();
        fromDestEndDate = new Date("2023-03-27T19:15:00.000-05:00").getTime();
        sliceName = "rushHour";
        break;
      case 1: // off-peak 1
        toDestStartDate = new Date("2023-03-27T10:00:00.000-05:00").getTime();
        toDestEndDate = new Date("2023-03-28T01:15:00.000-05:00").getTime();
        fromDestStartDate = new Date("2023-03-27T06:00:00.000-05:00").getTime();
        fromDestEndDate = new Date("2023-03-27T15:15:00.000-05:00").getTime();
        sliceName = "offPeak1";
        break;
      case 2: // off-peak 2
        toDestStartDate = null
        toDestEndDate = null
        fromDestStartDate = new Date("2023-03-27T19:00:00.000-05:00").getTime();
        fromDestEndDate = new Date("2023-03-28T01:15:00.000-05:00").getTime();
        sliceName = "offPeak2";
        break;
      case 3: // weeknight
        toDestStartDate = new Date("2023-03-27T01:00:00.000-05:00").getTime();
        toDestEndDate = new Date("2023-03-27T05:15:00.000-05:00").getTime();
        fromDestStartDate = new Date("2023-03-27T01:00:00.000-05:00").getTime();
        fromDestEndDate = new Date("2023-03-27T05:15:00.000-05:00").getTime();
        sliceName = "night1";
        break;
      case 4: // friday night
        toDestStartDate = new Date("2023-04-01T01:00:00.000-05:00").getTime();
        toDestEndDate = new Date("2023-04-01T05:15:00.000-05:00").getTime();
        fromDestStartDate = new Date("2023-04-01T01:00:00.000-05:00").getTime();
        fromDestEndDate = new Date("2023-04-01T05:15:00.000-05:00").getTime();
        sliceName = "night2";
        break;
      case 5: // saturday
        toDestStartDate = new Date("2023-04-01T05:00:00.000-05:00").getTime();
        toDestEndDate = new Date("2023-04-02T01:15:00.000-05:00").getTime();
        fromDestStartDate = new Date("2023-04-01T05:00:00.000-05:00").getTime();
        fromDestEndDate = new Date("2023-04-02T01:15:00.000-05:00").getTime();
        sliceName = "weekend1";
        break;
      case 6: // saturday night
        toDestStartDate = new Date("2023-04-02T01:00:00.000-05:00").getTime();
        toDestEndDate = new Date("2023-04-02T05:15:00.000-05:00").getTime();
        fromDestStartDate = new Date("2023-04-02T01:00:00.000-05:00").getTime();
        fromDestEndDate = new Date("2023-04-02T05:15:00.000-05:00").getTime();
        sliceName = "night3";
        break;
      case 7: // sunday
        toDestStartDate = new Date("2023-04-02T05:00:00.000-05:00").getTime();
        toDestEndDate = new Date("2023-04-03T01:15:00.000-05:00").getTime();
        fromDestStartDate = new Date("2023-04-02T05:00:00.000-05:00").getTime();
        fromDestEndDate = new Date("2023-04-03T01:15:00.000-05:00").getTime();
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

    let processedToDestItineraries;
    const processedFromDestItineraries = processItineraries(fromDestItineraries, fromDestStartDate, fromDestEndDate);
    if (i !== 2) {
      processedToDestItineraries = processItineraries(toDestItineraries, toDestStartDate, toDestEndDate);
    }

    const processedItineraries = i !== 2 ? [processedToDestItineraries, processedFromDestItineraries] : [processedFromDestItineraries];

    for (let j of processedItineraries) {
      let direction;
      let itineraries;

      if (j === processedFromDestItineraries) {
        direction = "fromDest";
        itineraries = sliceRoutesList(fromDestItineraries, fromDestStartDate, fromDestEndDate, "START_MODE");
      } else {
        direction = "toDest";
        itineraries = sliceRoutesList(toDestItineraries, toDestStartDate, toDestEndDate, "START_MODE");
      }

      const json = {
        name: `${origin.name}-${destination.name}-${sliceName}-${direction}`,
        route: `${origin.name} --> ${destination.name} (${originCoords} --> ${destinationCoords})`,
        direction: direction,
        sliceName: sliceName,
        startCutoff: j.startCutoff,
        endCutoff: j.endCutoff,
        itineraries: itineraries,
        frequencyMetrics: j.frequencyMetrics,
        durationMetrics: j.durationMetrics,
        walkMetrics: j.walkMetrics,
        waitMetrics: j.waitMetrics
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

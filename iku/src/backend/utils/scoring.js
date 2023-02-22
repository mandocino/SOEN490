import axios from "axios";
import * as thisModule from './scoring.js';
import {
  getDurationMetrics, getFrequencyMetrics, getWaitTimeMetrics, getWalkTimeMetrics,
  getWalkWaitComponents,
  handleGetAllRoutesOTP,
  removeBadRoutes,
  sliceRoutesList
} from './openTripPlanner.js';


/**
 * Saves the scores of a specific (origin, dstination) pair to the DB, or the weighted average scores of a specific
 * origin (in which case there is no destination).
 * @param origin
 * @param destination
 * @param scores
 * @param date
 * @returns {Promise<void>}
 */
export async function saveScores(origin, destination, scores, date) {
  let params =
    {
      origin: origin,
      generatedTime: date,
      overall: scores.overall,
      rushHour: scores.rushHour,
      offPeak: scores.offPeak,
      weekend: scores.weekend,
      overnight: scores.overnight
    };
  // If destination is specified then save the scores for the origin/destination pair, else save the scores with no
  // destination specified (weighted average)
  if (destination) {
    params.destination = destination;
    await axios.post(`http://localhost:5000/editSavedScore/${origin._id}/${destination._id}`, params);
  } else {
    await axios.post(`http://localhost:5000/editSavedScore/${origin._id}`, params);
  }
}

/**
 * Generates scores between a specific origin and all destinations by repeatedly invoking the
 * `generateNewScoresForOnePair` function. Also computes the weighted average of all scores for this specific origin.
 * @param origin
 * @param destinations
 * @param loggedIn
 * @returns {Promise<{overnight: number, generatedTime: number, rushHour: number, origin, weekend: number, overall: number, detailedScores: *[], offPeak: number}>}
 */
export async function generateNewScores(origin, destinations, loggedIn=true) {
  // The new scores that were generated
  let newScores = [];

  // The denominator for the average weighted scores calculation
  let denominator = 0;

  let overall = 0;
  let rushHour = 0;
  let offPeak = 0;
  let weekend = 0;
  let overnight = 0;

  // Get the current date and time
  // const date = Date.now();
  // TODO: Change this back to Date.now(). This is a hack to always regenerate the origin.
  const date = new Date(0);

  for (const destination of destinations) {
    const individualNewScore = await generateNewScoresForOnePair(origin, destination, loggedIn);
    newScores.push(individualNewScore);
  }

  for (const score of newScores) {
    let priority = score.priority;

    if (priority == null || priority < 1) {
      priority = 1
    }


    overall += score.overall*priority;
    rushHour += score.rushHour*priority;
    offPeak += score.offPeak*priority;
    weekend += score.weekend*priority;
    overnight += score.overnight*priority;
    denominator += priority;
  }

  let scores = {
    overall: Math.round(overall/denominator),
    rushHour: Math.round(rushHour/denominator),
    offPeak: Math.round(offPeak/denominator),
    weekend: Math.round(weekend/denominator),
    overnight: Math.round(overnight/denominator)
  };

  if (loggedIn) {
    await thisModule.saveScores(origin, null, scores, date);
  }

  return {
    origin: origin,
    generatedTime: date,
    overall: scores.overall,
    rushHour: scores.rushHour,
    offPeak: scores.offPeak,
    weekend: scores.weekend,
    overnight: scores.overnight,
    detailedScores: newScores
  };
}

/**
 * Generates scores for a specific (origin, destination) pair
 * @param origin
 * @param destination
 * @param loggedIn
 * @returns {Promise<{overnight: number, generatedTime: number, rushHour: number, origin, weekend: number, destination, overall: number, offPeak: number, priority}>}
 */
export async function generateNewScoresForOnePair(origin, destination, loggedIn=true) {
  console.log(`${origin.name} --> ${destination.name}`);

  // IMPORTANT
  // Coords must be a string of the format "latitude,longitude"
  const originCoords = `${origin.latitude},${origin.longitude}`;
  const destinationCoords = `${destination.latitude},${destination.longitude}`;
  const weekdayStartDate = "2023-02-20";
  const weekdayStartTime = "1:00am";
  const timeWindow = 24*3600+900; // 24 hours, plus 15 minutes
  const optionalParams = {
    searchWindow: timeWindow,
    numItineraries: 0
  };

  console.log(originCoords);
  console.log(destinationCoords);

  const toDestItineraries = await handleGetAllRoutesOTP(originCoords, destinationCoords, weekdayStartDate, weekdayStartTime, optionalParams);
  const fromDestItineraries = await handleGetAllRoutesOTP(destinationCoords, originCoords, weekdayStartDate, weekdayStartTime, optionalParams);
  const toDestStartDate = new Date("2023-02-20T06:00:00.000-05:00") .getTime();
  const toDestEndDate = new Date("2023-02-20T10:15:00.000-05:00").getTime();
  const fromDestStartDate = new Date("2023-02-20T15:00:00.000-05:00").getTime();
  const fromDestEndDate = new Date("2023-02-20T19:15:00.000-05:00").getTime();

  const rushHourToDestItineraries = sliceRoutesList(toDestItineraries, toDestStartDate, toDestEndDate, "START_MODE");
  const rushHourFromDestItineraries = sliceRoutesList(fromDestItineraries, fromDestStartDate, fromDestEndDate, "START_MODE");
  // TODO: Save the slices to DB (or process then save, whichever)
  console.log(rushHourToDestItineraries)

  const rushHourToDestCleanedItineraries = removeBadRoutes(rushHourToDestItineraries);
  const rushHourFromDestCleanedItineraries = removeBadRoutes(rushHourFromDestItineraries);

  const frequencyMetrics = getFrequencyMetrics(rushHourToDestCleanedItineraries);
  const durationMetrics = getDurationMetrics(rushHourToDestCleanedItineraries);
  const walkMetrics = getWalkTimeMetrics(rushHourToDestCleanedItineraries);
  const waitMetrics = getWaitTimeMetrics(rushHourToDestCleanedItineraries);

  console.log(rushHourToDestCleanedItineraries);
  console.log(frequencyMetrics);
  console.log(durationMetrics);
  console.log(walkMetrics);
  console.log(waitMetrics);

  // For now, generate random scores
  let rushHour = (Math.random() * 100) + 1;
  rushHour = Math.floor(rushHour);

  let offPeak = (Math.random() * 100) + 1;
  offPeak = Math.floor(offPeak);

  let weekend = (Math.random() * 100) + 1;
  weekend = Math.floor(weekend);

  let night = (Math.random() * 100) + 1;
  night = Math.floor(night);

  let overall = (Math.random() * 100) + 1;
  overall = Math.floor(night);

  // Get the current date and time
  let date = Date.now();

  // Save the scores, making sure to keep track of the time of generation
  let scores =
    {
      overall: overall,
      rushHour: rushHour,
      offPeak: offPeak,
      weekend: weekend,
      overnight: night
    };

  if (loggedIn) {
    await thisModule.saveScores(origin, destination, scores, date);
  }

  return {
    origin: origin,
    destination: destination,
    priority: destination.priority,
    generatedTime: date,
    overall: scores.overall,
    rushHour: scores.rushHour,
    offPeak: scores.offPeak,
    weekend: scores.weekend,
    overnight: scores.overnight
  };
}

/**
 * Fetch the scores for a defined origin, destination pair.
 * @param origin
 * @param destination
 * @returns {Promise<AxiosResponse<any>|void>}
 */
export async function fetchScores(origin, destination) {
  // If a destination is specified, load scores for the specific origin/destination pair, else load for irigin only
  const url = destination ? `http://localhost:5000/savedScores/${origin._id}/${destination._id}` : `http://localhost:5000/savedScores/${origin._id}`;
  const result = await axios.get(url, {
    params:
      {
        origin: origin,
        destination: destination,
      }
  }).then((response) => {
    return response.data;
  }).catch(err => console.log(err));
  return result;
}

/**
 * Loads all scores for a given origin (the scores between that origin and all destinations, and the associated
 * weighted average
 * @param origin
 * @param destinations
 * @param userID
 * @returns {Promise<AxiosResponse<*>|{overnight: number, generatedTime: number, rushHour: number, origin: *, weekend: number, overall: number, detailedScores: [], offPeak: number}|null>}
 */
export async function loadScores(origin, destinations, userID) {
  if (origin && origin.length === 0) {
    return null;
  }

  const loggedIn = (userID != null);

  let savedScores;
  let lastPrefChangeTime;
  let lastAlgoUpdateTime;

  if (loggedIn) {
    // Grab the last time the system was updated (changes to algorithm, transit schedules update, etc...)
    const timeValues = await axios.get('http://localhost:5000/global/');
    lastAlgoUpdateTime = timeValues.data.lastAlgoUpdateTime;

    // Grab the last time the user updated their preferences
    const user = await axios.get(`http://localhost:5000/userByID/${userID}`);
    lastPrefChangeTime = user.data[0].lastPrefChangeTime;

    // Get the latest scores for the origin only
    savedScores = await thisModule.fetchScores(origin, null);
  } else {
    // For non logged in users, set both times to 1970 to force re-generation
    const aLongTimeAgo = new Date(0);
    lastPrefChangeTime = aLongTimeAgo;
    lastAlgoUpdateTime = aLongTimeAgo
  }

  // Generate the scores if there are no saved scores.
  // Or, re-generate the scores if the system was updated, or the user preferences changed since last generation
  if (!savedScores || savedScores.generatedTime < lastPrefChangeTime || savedScores.generatedTime < lastAlgoUpdateTime) {
    savedScores = await thisModule.generateNewScores(origin, destinations, loggedIn);
  }
  // Get the latest scores for each origin/destination pair
  else {
    let scores = []
    for (const destination of destinations) {
      let score;
      if (userID != null) {
        // Fetch scores for a single origin/destination pair
        score = await thisModule.fetchScores(origin, destination);
      }

      // If scores for any origin/destination pair are outdated, regenerate everything.
      // This is so that the weighted average score gets regenerated as well.
      // TODO: We can make this more efficient by only regenerating the scores that need to be, and updating the
      //  weighted average accordingly
      if (!score || score.generatedTime < lastPrefChangeTime || score.generatedTime < lastAlgoUpdateTime) {
        savedScores = await thisModule.generateNewScores(origin, destinations, loggedIn);
        break;
      }
      scores.push(score);
    }
    savedScores.detailedScores = scores;
  }

  return savedScores;
}

/**
 * Function to set the global `lastAlgoUpdateTime` to the current time
 * @returns {Promise<void>}
 */
export async function updateAlgorithmTime() {
  // Update the record for when the system was updated to match the current time
  let params =
    {
      lastAlgoUpdateTime: Date.now()
    };

  await axios.post('http://localhost:5000/modifyGlobal/', params);
}
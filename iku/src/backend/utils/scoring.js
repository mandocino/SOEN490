import axios from "axios";
import * as thisModule from './scoring.js';
import {getItinerariesFromOTP, processItineraries} from "./routeProcessing.js";


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
 * Fetch the scores for a defined origin, destination pair.
 * @param origin
 * @param destination
 * @returns {Promise<AxiosResponse<any>|void>}
 */
export async function fetchScores(origin, destination) {
  // If a destination is specified, load scores for the specific origin/destination pair, else load for irigin only
  const url = destination ? `http://localhost:5000/savedScores/${origin._id}/${destination._id}` : `http://localhost:5000/savedScores/${origin._id}`;
  return await axios.get(url, {
    params:
      {
        origin: origin,
        destination: destination,
      }
  }).then((response) => {
    return response.data;
  }).catch(err => console.log(err));
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
 * Generates scores between a specific origin and all destinations by repeatedly invoking the
 * `generateNewScoresForOnePair` function. Also computes the weighted average of all scores for this specific origin.
 * @param origin
 * @param destinations
 * @param loggedIn
 * @returns {Promise<{overnight: number, generatedTime: Date, rushHour: number, origin, weekend: number, overall: number, detailedScores: *[], offPeak: number}>}
 */
export async function generateNewScores(origin, destinations, loggedIn=true) {
  // TODO: fetch user's preferred weights
  const frequencyWeight = 0.7;
  const durationWeight = 0.25;
  const walkWeight = 0.05;

  const weeknightWeight = 1/3;
  const fridayNightWeight = 1/3;
  const saturdayNightWeight = 1/3;

  const saturdayWeight = 0.6;
  const sundayWeight = 0.4;

  const rushHourWeight = 0.4;
  const offPeakWeight = 0.3;
  const nightWeight = 0.1;
  const weekendWeight = 0.2;

  const scoringWeights = {
    factorWeights: {
      frequencyWeight: frequencyWeight,
      durationWeight: durationWeight,
      walkWeight: walkWeight
    },
    nightWeights: {
      weeknightWeight: weeknightWeight,
      fridayNightWeight: fridayNightWeight,
      saturdayNightWeight: saturdayNightWeight
    },
    weekendWeights: {
      saturdayWeight: saturdayWeight,
      sundayWeight: sundayWeight
    },
    overallWeights: {
      rushHourWeight: rushHourWeight,
      offPeakWeight: offPeakWeight,
      nightWeight: nightWeight,
      weekendWeight: weekendWeight
    }
  }

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
    const individualNewScore = await generateNewScoresForOnePair(origin, destination, scoringWeights, loggedIn);
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

  // Round to whole numbers
  overall = Math.round(overall/denominator);
  rushHour = Math.round(rushHour/denominator);
  offPeak = Math.round(offPeak/denominator);
  weekend = Math.round(weekend/denominator);
  overnight = Math.round(overnight/denominator);

  // Cap to 100 and floor to 0.
  // See the note at the bottom of calculateScore() for more details.
  let scores = {
    overall: Math.max(Math.min(overall, 100), 0),
    rushHour: Math.max(Math.min(rushHour, 100), 0),
    offPeak: Math.max(Math.min(offPeak, 100), 0),
    weekend: Math.max(Math.min(weekend, 100), 0),
    overnight: Math.max(Math.min(overnight, 100), 0)
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
 * @param scoringWeights
 * @param loggedIn
 * @returns {Promise<{overnight: number, generatedTime: number, rushHour: number, origin, weekend: number, destination, overall: number, offPeak: number, priority}>}
 */
export async function generateNewScoresForOnePair(origin, destination, scoringWeights, loggedIn=true) {
  const frequencyWeight = scoringWeights.factorWeights.frequencyWeight;
  const durationWeight = scoringWeights.factorWeights.durationWeight;
  const walkWeight = scoringWeights.factorWeights.walkWeight

  const startDates = {
    weekdayStartDate: "2023-02-20",
    saturdayStartDate: "2023-02-25",
    sundayStartDate: "2023-02-26"
  }
  const itineraries = await getItinerariesFromOTP(origin, destination, startDates);

  const rushHourScores = generateRushHourScores(itineraries);
  const rushHour = computeWeightedScore(rushHourScores, frequencyWeight, durationWeight, walkWeight);

  const offPeakScores = generateOffPeakScores(itineraries);
  const offPeak = computeWeightedScore(offPeakScores, frequencyWeight, durationWeight, walkWeight);

  const nightScores = generateOvernightScores(itineraries, scoringWeights.nightWeights);
  const night = computeWeightedScore(nightScores, frequencyWeight, durationWeight, walkWeight);

  // For now, generate random scores for the other time periods
  let weekend = (Math.random() * 100) + 1;
  weekend = Math.floor(weekend);

  let overall = (Math.random() * 100) + 1;
  // NOTE: Insert weights for individual slices here
  overall = Math.floor(overall);

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


function generateRushHourScores(itineraries) {
  const toDestStartDate = new Date("2023-02-20T06:00:00.000-05:00").getTime();
  const toDestEndDate = new Date("2023-02-20T10:15:00.000-05:00").getTime();
  const fromDestStartDate = new Date("2023-02-20T15:00:00.000-05:00").getTime();
  const fromDestEndDate = new Date("2023-02-20T19:15:00.000-05:00").getTime();

  const toDestItineraries = itineraries.weekdayToDestItineraries;
  const fromDestItineraries = itineraries.weekdayFromDestItineraries;

  const processedToDestItineraries = processItineraries(toDestItineraries, toDestStartDate, toDestEndDate);
  const processedFromDestItineraries = processItineraries(fromDestItineraries, fromDestStartDate, fromDestEndDate);

  const processedItineraries = [processedToDestItineraries, processedFromDestItineraries];

  const scores = calculateScoresFromList(processedItineraries);

  const frequencyScore = scores.frequencyScores.reduce((a,b) => {return a+b})/2;
  const durationScore = scores.durationScores.reduce((a,b) => {return a+b})/2;
  const walkScore = scores.walkScores.reduce((a,b) => {return a+b})/2;

  return {
    frequencyScore: frequencyScore,
    durationScore: durationScore,
    walkScore: walkScore
  }
}


function generateOffPeakScores(itineraries) {
  const toDestStartDate = new Date("2023-02-20T10:00:00.000-05:00").getTime();
  const toDestEndDate = new Date("2023-02-21T01:15:00.000-05:00").getTime();
  const fromDestStartDate1 = new Date("2023-02-20T06:00:00.000-05:00").getTime();
  const fromDestEndDate1 = new Date("2023-02-20T15:15:00.000-05:00").getTime();
  const fromDestStartDate2 = new Date("2023-02-20T19:00:00.000-05:00").getTime();
  const fromDestEndDate2 = new Date("2023-02-21T01:15:00.000-05:00").getTime();

  const toDestItineraries = itineraries.weekdayToDestItineraries;
  const fromDestItineraries = itineraries.weekdayFromDestItineraries;

  const processedToDestItineraries = processItineraries(toDestItineraries, toDestStartDate, toDestEndDate);
  const processedFromDestItineraries1 = processItineraries(fromDestItineraries, fromDestStartDate1, fromDestEndDate1);
  const processedFromDestItineraries2 = processItineraries(fromDestItineraries, fromDestStartDate2, fromDestEndDate2);

  const processedItineraries = [processedToDestItineraries, processedFromDestItineraries1, processedFromDestItineraries2];

  const scores = calculateScoresFromList(processedItineraries);

  /**
   * Since toDest represents a 15-hour slice (of the 30 hours that constitute the offPeak period), it represents 50%
   * of the total score.
   * Since fromDest1 represents a 9-hour slice and fromDest2 represents a 6-hour slice, they represent 30% and 20% of
   * the total score respectively.
   * @param x Array of [toDest, fromDest1, fromDest2] scores
   * @returns {number} Weighted average of the three scores
   */
  const reduce = (x) => {
    return (x[0]*.5 + x[1]*0.3 + x[2]*0.2);
  }

  const frequencyScore = reduce(scores.frequencyScores);
  const durationScore = reduce(scores.durationScores);
  const walkScore = reduce(scores.walkScores);

  return {
    frequencyScore: frequencyScore,
    durationScore: durationScore,
    walkScore: walkScore
  }
}


function generateOvernightScores(itineraries, scoringWeights) {
  const weeknightWeight = scoringWeights.weeknightWeight;
  const fridayNightWeight = scoringWeights.fridayNightWeight;
  const saturdayNightWeight = scoringWeights.saturdayNightWeight;

  const weeknightStartDate = new Date("2023-02-20T01:00:00.000-05:00").getTime();
  const weeknightEndDate = new Date("2023-02-20T05:15:00.000-05:00").getTime();

  // Recall: Friday night is saturday AM
  const fridayStartDate = new Date("2023-02-25T01:00:00.000-05:00").getTime();
  const fridayEndDate = new Date("2023-02-25T05:15:00.000-05:00").getTime();

  // Recall: Saturday night is sunday AM
  const saturdayStartDate = new Date("2023-02-26T01:00:00.000-05:00").getTime();
  const saturdayEndDate = new Date("2023-02-26T05:15:00.000-05:00").getTime();

  // Recall: Friday night is saturday AM, saturday night is sunday AM.
  const toDestItineraries = itineraries.weekdayToDestItineraries;
  const fromDestItineraries = itineraries.weekdayFromDestItineraries;
  const fridayToDestItineraries = itineraries.saturdayToDestItineraries;
  const fridayFromDestItineraries = itineraries.saturdayFromDestItineraries;
  const saturdayToDestItineraries = itineraries.sundayToDestItineraries;
  const saturdayFromDestItineraries = itineraries.sundayFromDestItineraries;

  const processedToDestItineraries = processItineraries(toDestItineraries, weeknightStartDate, weeknightEndDate);
  const processedFromDestItineraries = processItineraries(fromDestItineraries, weeknightStartDate, weeknightEndDate);
  const processedFridayToDestItineraries = processItineraries(fridayToDestItineraries, fridayStartDate, fridayEndDate);
  const processedFridayFromDestItineraries = processItineraries(fridayFromDestItineraries, fridayStartDate, fridayEndDate);
  const processedSaturdayToDestItineraries = processItineraries(saturdayToDestItineraries, saturdayStartDate, saturdayEndDate);
  const processedSaturdayFromDestItineraries = processItineraries(saturdayFromDestItineraries, saturdayStartDate, saturdayEndDate);

  const processedItineraries = [
    processedToDestItineraries,
    processedFromDestItineraries,
    processedFridayToDestItineraries,
    processedFridayFromDestItineraries,
    processedSaturdayToDestItineraries,
    processedSaturdayFromDestItineraries
  ];

  const scores = calculateScoresFromList(processedItineraries);

  const reduce = (x) => {
    const weeknight = (x[0]+x[1])/2;
    const fridayNight = (x[2]+x[3])/2;
    const saturdayNight = (x[4]+x[5])/2;
    return (weeknight*weeknightWeight + fridayNight*fridayNightWeight + saturdayNight*saturdayNightWeight);
  }

  const frequencyScore = reduce(scores.frequencyScores);
  const durationScore = reduce(scores.durationScores);
  const walkScore = reduce(scores.walkScores);

  return {
    frequencyScore: frequencyScore,
    durationScore: durationScore,
    walkScore: walkScore
  }
}


function calculateScoresFromList(processedItineraries) {
  let frequencyScores = []
  let durationScores = []
  let walkScores = []

  for (let i of processedItineraries) {

    if (i.frequencyMetrics == null) {
      frequencyScores.push(0);
    } else {
      // Normalize metrics from milliseconds to minutes, and provide them in the format expected by calculateScore()
      const frequencyMetrics = {
        max: i.frequencyMetrics.maxGap/60000,
        min: i.frequencyMetrics.minGap/60000,
        average: i.frequencyMetrics.averageGap/60000,
        standardDeviation: i.frequencyMetrics.standardDeviationGap/60000
      }
      const frequencyScore = calculateScore(frequencyMetrics, 120, 0.6, 0.2, 0.8);
      frequencyScores.push(frequencyScore);
    }

    if (i.durationMetrics == null) {
      durationScores.push(0);
    } else {
      // Normalize metrics from seconds to minutes, and provide them in the format expected by calculateScore()
      const durationMetrics = {
        max: i.durationMetrics.maxDurationTime/60,
        min: i.durationMetrics.minDurationTime/60,
        average: i.durationMetrics.averageDurationTime/60,
        standardDeviation: i.durationMetrics.standardDeviationDurationTime/60
      }
      const durationScore = calculateScore(durationMetrics, 180, 0.4, 0.2, 0.8);
      durationScores.push(durationScore);
    }

    if (i.walkMetrics == null) {
      walkScores.push(0);
    } else {
      // Normalize metrics from seconds to minutes, and provide them in the format expected by calculateScore()
      const walkMetrics = {
        max: i.walkMetrics.maxWalkTime/60,
        min: i.walkMetrics.minWalkTime/60,
        average: i.walkMetrics.averageWalkTime/60,
        standardDeviation: i.walkMetrics.standardDeviationWalkTime/60
      }
      const walkScore = calculateScore(walkMetrics, 60, 0.5, 0.2 ,0.8);
      walkScores.push(walkScore);
    }
  }

  return {
    frequencyScores: frequencyScores,
    durationScores: durationScores,
    walkScores: walkScores
  }
}


/**
 * Function to calculate a score based on metrics.
 *
 * @param metrics List of frequency metrics. If a list of all metrics is passed then the frequency metrics will be extracted.
 * @param worst The case that will result in a score of zero. Cases worse than the specified worst case will floor at zero.
 * @param cvBonus A constant value added to the CV (coefficient of variation) to skew the scoring into giving higher numbers
 * @param fmaxWeight The weight of the score computed on the maximum value, relative to the final score
 * @param favgWeight The weight of the score computed on the average value, relative to the final score
 * @returns {number} A number from 0-100 representing the final score
 */
function calculateScore(metrics, worst, cvBonus, fmaxWeight, favgWeight) {
  /**
   * FORMULA FOR DETERMINING BASE SCORE:
   *
   * f(x) = a * log_10(x+10) + b, where...
   *   x is the average or max gap
   *   a and b are constants to ensure f(0) = 100 and f(worst) = 0
   */

  const a = -100/(Math.log10(worst+10)-1);
  const b = 100-a;
  const f = (x) => {
    return a*Math.log10(x+10)+b;
  }

  const f_max = f(metrics.max);
  const f_avg = f(metrics.average);


  let cv;
  if (metrics.average > 0) {
    // CV (coefficient of variation) represents the amount of variability from the mean.
    cv = metrics.standardDeviation / metrics.average;
  } else {
    // If the average is 0 then the data is effectively invalid.
    // Setting the cv to (1+cvBonus) will force the final score to be zero since it is multiplied by (1+cvBonus-cv) later
    cv = 1+cvBonus
  }


  // Using the CV as-is results in very low scores even for conventionally "good" transit (eg metro)
  // Adding a bonus to the CV skews the scores higher, making it easier to "understand" the scores at the expense of
  // the accuracy of the scores.
  return (f_max * fmaxWeight + f_avg * favgWeight) * (1 - cv + cvBonus);

  // NOTE:
  //
  // By adding a bonus to the CV, the multiplier could be >1 resulting in scores above 100.
  // In such cases, cap it to 100
  //
  // Furthermore, f(x) may return a negative value, if the max/average is worse than the "worst" case
  // For example, an average case of 150min when the worst case is defined as 120min will yield a negative number
  // In such cases, the floor should be 0 (service "too bad to bother measuring")
  //
  // For now the scores will be left as-is and will be capped/floored in the generateNewScores() function.
}


/**
 * Function to take an object containing the frequency, duration, and walk scores, and returns the weighted average of
 * the three using specified weights
 * @param scores Object containing frequencyScore, durationScore, and walkScore
 * @param frequencyWeight Weight of the frequency score
 * @param durationWeight Weight of the duration score
 * @param walkWeight Weight of the walk score
 * @returns {number} Weighted average of the three
 */
function computeWeightedScore(scores, frequencyWeight, durationWeight, walkWeight) {
  const frequencyScore = scores.frequencyScore*frequencyWeight;
  const durationScore = scores.durationScore*durationWeight;
  const walkScore = scores.walkScore*walkWeight;
  return frequencyScore + durationScore + walkScore;
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
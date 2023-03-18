import axios from "axios";
import * as thisModule from './scoring.js';
import {getRoutingData} from "./routeProcessing.js";
import {
  defaultUserRoutingPreferences,
  defaultUserFactorWeights,
  defaultUserWeekendWeights,
  defaultUserScoringWeights,
  defaultUserNightDayWeights,
  defaultUserNightDirectionWeights, defaultUserScoringPreferences
} from "../config/db.js";


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
    // For non-logged-in users, set both times to 1970 to force re-generation
    const aLongTimeAgo = new Date(0);
    lastPrefChangeTime = aLongTimeAgo;
    lastAlgoUpdateTime = aLongTimeAgo
  }

  // Generate the scores if there are no saved scores.
  // Or, re-generate the scores if the system was updated, or the user preferences changed since last generation
  if (!savedScores || savedScores.generatedTime < lastPrefChangeTime || savedScores.generatedTime < lastAlgoUpdateTime) {
    savedScores = await thisModule.generateNewScores(origin, destinations, userID);
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
export async function generateNewScores(origin, destinations, userID) {
  const loggedIn = (userID != null);

  // User's scoring and routing preferences
  let userPreferences;
  let factorWeights;
  let nightDayWeights;
  let nightDirectionWeights;
  let weekendWeights;
  let scoringWeights;
  let scoringPreferences;
  let routingPreferences;

  // The new scores that were generated
  let newScores = [];

  // The denominator for the average weighted scores calculation
  let denominator = 0;

  let overall = 0;
  let rushHour = 0;
  let offPeak = 0;
  let weekend = 0;
  let overnight = 0;

  const user = await axios.get(`http://localhost:5000/userByID/${userID}`);
  const userData = user.data[0];

  // TODO: Either update user document in db to the default preferences or show an alert in frontend
  if (userData.hasOwnProperty('factorWeights')
    && userData.factorWeights.hasOwnProperty('frequencyWeight')
    && userData.factorWeights.hasOwnProperty('durationWeight')
  ) {
    factorWeights = userData.factorWeights;
  } else {
    factorWeights = defaultUserFactorWeights;
  }

  if (userData.hasOwnProperty('nightDayWeights')
    && userData.factorWeights.hasOwnProperty('weeknightWeight')
    && userData.factorWeights.hasOwnProperty('fridayNightWeight')
    && userData.factorWeights.hasOwnProperty('saturdayNightWeight')
  ) {
    nightDayWeights = userData.nightDayWeights;
  } else {
    nightDayWeights = defaultUserNightDayWeights;
  }

  if (userData.hasOwnProperty('nightDirectionWeights')
    && userData.factorWeights.hasOwnProperty('toDestWeight')
    && userData.factorWeights.hasOwnProperty('fromDestWeight')
  ) {
    nightDirectionWeights = userData.nightDirectionWeights;
  } else {
    nightDirectionWeights = defaultUserNightDirectionWeights;
  }

  if (userData.hasOwnProperty('weekendWeights')
    && userData.factorWeights.hasOwnProperty('saturdayWeight')
    && userData.factorWeights.hasOwnProperty('sundayWeight')
  ) {
    weekendWeights = userData.weekendWeights;
  } else {
    weekendWeights = defaultUserWeekendWeights;
  }

  if (userData.hasOwnProperty('scoringWeights')
    && userData.factorWeights.hasOwnProperty('rushHourWeight')
    && userData.factorWeights.hasOwnProperty('offPeakWeight')
    && userData.factorWeights.hasOwnProperty('nightWeight')
    && userData.factorWeights.hasOwnProperty('weekendWeight')
  ) {
    scoringWeights = userData.scoringWeights;
  } else {
    scoringWeights = defaultUserScoringWeights;
  }

  if (userData.hasOwnProperty('scoringPreferences')
    && userData.factorWeights.hasOwnProperty('consistencyImportance')
    && userData.factorWeights.hasOwnProperty('worstAcceptableFrequency')
    && userData.factorWeights.hasOwnProperty('worstAcceptableDuration')
    && userData.factorWeights.hasOwnProperty('worstAcceptableWalk')
  ) {
    scoringPreferences = userData.scoringPreferences;
  } else {
    scoringPreferences = defaultUserScoringPreferences;
  }

  if (userData.hasOwnProperty('routingPreferences')
    && userData.factorWeights.hasOwnProperty('walkReluctance')
    && userData.factorWeights.hasOwnProperty('isWheelChair')
  ) {
    routingPreferences = userData.routingPreferences;
  } else {
    routingPreferences = defaultUserRoutingPreferences;
  }

  userPreferences = {
    factorWeights: factorWeights,
    nightDayWeights: nightDayWeights,
    nightDirectionWeights: nightDirectionWeights,
    weekendWeights: weekendWeights,
    scoringWeights: scoringWeights,
    scoringPreferences: scoringPreferences,
    routingPreferences: routingPreferences
  }

  // Get the current date and time
  const date = Date.now();

  for (const destination of destinations) {
    const individualNewScore = await generateNewScoresForOnePair(origin, destination, userPreferences, loggedIn);
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
 * @param userPreferences
 * @param loggedIn
 * @returns {Promise<{overnight: number, generatedTime: number, rushHour: number, origin, weekend: number, destination, overall: number, offPeak: number, priority}>}
 */
export async function generateNewScoresForOnePair(origin, destination, userPreferences, loggedIn=false) {
  const frequencyWeight = userPreferences.factorWeights.frequencyWeight;
  const durationWeight = userPreferences.factorWeights.durationWeight;

  const startDates = {
    weekdayStartDate: "2023-02-20",
    saturdayStartDate: "2023-02-25",
    sundayStartDate: "2023-02-26"
  };

  const cvRatioBase = 8

  let cvParams = {
    minRatio: 1/cvRatioBase,
    maxRatio: cvRatioBase
  };

  const cvParamIndex = userPreferences.scoringPreferences.consistencyImportance;

  switch (cvParamIndex) {
    case 1:
      cvParams.offset = 2.4;
      cvParams.ratio = 0.125;
      break;
    case 2:
      cvParams.offset = 1.4;
      cvParams.ratio = 0.5;
      break;
    case 3:
      cvParams.offset = 0.8;
      cvParams.ratio = 8;
      break;
  }

  const scoringParams = {
    cvParams: cvParams,
    worstAcceptableFrequency: userPreferences.scoringPreferences.worstAcceptableFrequency,
    worstAcceptableDuration: userPreferences.scoringPreferences.worstAcceptableDuration,
    worstAcceptableWalk: userPreferences.scoringPreferences.worstAcceptableWalk
  }

  const metrics = await getRoutingData(origin, destination, startDates, userPreferences.routingPreferences, loggedIn);

  const rushHourScores = generateRushHourScores(metrics.rushHourMetrics, scoringParams);
  const rushHour = computeWeightedScore(rushHourScores, frequencyWeight, durationWeight);

  const offPeakScores = generateOffPeakScores(metrics.offPeakMetrics, scoringParams);
  const offPeak = computeWeightedScore(offPeakScores, frequencyWeight, durationWeight);

  const nightScores = generateOvernightScores(metrics.overnightMetrics, scoringParams, userPreferences.nightDayWeights, userPreferences.nightDirectionWeights);
  const night = computeWeightedScore(nightScores, frequencyWeight, durationWeight);

  const weekendScores = generateWeekendScores(metrics.weekendMetrics, scoringParams, userPreferences.weekendWeights);
  const weekend = computeWeightedScore(weekendScores, frequencyWeight, durationWeight);

  const weightedRushHour = rushHour * userPreferences.scoringWeights.rushHourWeight;
  const weightedOffPeak = offPeak * userPreferences.scoringWeights.offPeakWeight;
  const weightedNight = night * userPreferences.scoringWeights.nightWeight;
  const weightedWeekend = weekend * userPreferences.scoringWeights.weekendWeight;
  const overall = weightedRushHour + weightedOffPeak + weightedNight + weightedWeekend;

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


function generateRushHourScores(metrics, scoringParams) {
  const scores = calculateScoresFromMetrics(metrics, scoringParams);

  const frequencyScore = scores.frequencyScores.reduce((a,b) => {return a+b})/2;
  const durationScore = scores.durationScores.reduce((a,b) => {return a+b})/2;
  const walkScore = scores.walkScores.reduce((a,b) => {return a+b})/2;

  return {
    frequencyScore: frequencyScore,
    durationScore: durationScore,
    walkScore: walkScore
  }
}


function generateOffPeakScores(metrics, scoringParams) {
  const scores = calculateScoresFromMetrics(metrics, scoringParams);

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


function generateOvernightScores(metrics, scoringParams, dayScoringWeights, directionScoringWeights) {
  const weeknightWeight = dayScoringWeights.weeknightWeight;
  const fridayNightWeight = dayScoringWeights.fridayNightWeight;
  const saturdayNightWeight = dayScoringWeights.saturdayNightWeight;

  const toDestWeight = directionScoringWeights.toDestWeight;
  const fromDestWeight = directionScoringWeights.fromDestWeight;

  const scores = calculateScoresFromMetrics(metrics, scoringParams);

  const reduce = (x) => {
    const weeknight = (x[0]*toDestWeight+x[1]*fromDestWeight);
    const fridayNight = (x[2]*toDestWeight+x[3]*fromDestWeight);
    const saturdayNight = (x[4]*toDestWeight+x[5]*fromDestWeight);
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


function generateWeekendScores(metrics, scoringParams, scoringWeights) {
  const saturdayWeight = scoringWeights.saturdayWeight;
  const sundayWeight = scoringWeights.sundayWeight;

  const scores = calculateScoresFromMetrics(metrics, scoringParams);

  const reduce = (x) => {
    const saturday = (x[0]+x[1])/2;
    const sunday = (x[2]+x[3])/2;
    return (saturday*saturdayWeight + sunday*sundayWeight);
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


function calculateScoresFromMetrics(metrics, scoringParams) {
  const worstFreq = scoringParams.worstAcceptableFrequency;
  const worstDur = scoringParams.worstAcceptableDuration;
  const worstWalk = scoringParams.worstAcceptableWalk;
  const cvParams = scoringParams.cvParams;

  let frequencyScores = []
  let durationScores = []
  let walkScores = []

  for (let i of metrics) {
    const frequencyScore = calculateScore(i.frequencyMetrics, worstFreq, cvParams, 0.2, 0.8);
    frequencyScores.push(frequencyScore);

    const durationScore = calculateScore(i.durationMetrics, worstDur, cvParams,0.2, 0.8);
    durationScores.push(durationScore);

    const walkScore = calculateScore(i.walkMetrics, 60, cvParams,0.2, 0.8);
    walkScores.push(walkScore);
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
 * @param cvParams
 * @param fmaxWeight The weight of the score computed on the maximum value, relative to the final score
 * @param favgWeight The weight of the score computed on the average value, relative to the final score
 * @returns {number} A number from 0-100 representing the final score
 */
function calculateScore(metrics, worst, cvParams, fmaxWeight, favgWeight) {

  if (metrics == null) {
    return 0;
  }

  /**
   * FORMULA FOR DETERMINING BASE SCORE:
   *
   * f(x) = a * log_10(x+10) + b, where...
   *   x is the average or max gap
   *   a and b are constants to ensure f(0) = 100 and f(worst) = 0
   */

  const a = -100/(Math.log2(worst+2)-1);
  const b = 100-a;
  const f = (x) => {
    return a*Math.log2(x+2)+b;
  }

  const f_max = f(metrics.max);
  const f_avg = f(metrics.average);


  let cv;
  let multiplier;
  const cvOffset = cvParams.offset;
  const cvRatio = cvParams.ratio;
  const minRatio = cvParams.minRatio;
  const maxRatio = cvParams.maxRatio;

  if (metrics.average > 0) {
    // CV (coefficient of variation) represents the amount of variability from the mean.
    cv = metrics.standardDeviation / metrics.average;

    // Using the CV as-is results in very low scores even for conventionally "good" transit (eg metro)
    // Adding a bonus to the CV skews the scores higher, making it easier to "understand" the scores at the expense of
    // the "raw accuracy" of the scores. Note that the scores will still be correct, relative to one another.
    // multiplier = 1-((cv+cvOffset)/cvRatio);
    multiplier = 1 - cv/(minRatio+cvRatio) + cv/(minRatio+maxRatio)+cvOffset;
  } else {
    // If the average is 0 then the data is effectively invalid.
    multiplier = 0;
  }

  return (f_max * fmaxWeight + f_avg * favgWeight) * multiplier;

  // NOTE:
  //
  // By adding an offset to the CV, the multiplier could be >1 resulting in scores above 100.
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
function computeWeightedScore(scores, frequencyWeight, durationWeight, walkWeight=0) {
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
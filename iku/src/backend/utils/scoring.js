import axios from "axios";
import * as thisModule from './scoring.js';

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

export function createNewScores(origin, destination = null) {
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

  let scores =
    {
      overall: overall,
      rushHour: rushHour,
      offPeak: offPeak,
      weekend: weekend,
      overnight: night
    };

  return scores;

}

export async function generateNewScores(origin, destination = null) {
  // Save the scores, making sure to keep track of the time of generation
  const scores = createNewScores(origin, destination);
  // Get the current date and time
  let date = Date.now();
  await thisModule.saveScores(origin, destination, scores, date);
}

/**
 * Handles scores generation for non-logged-in users, with locations and
 * scored not saved to the database.
 * @param {*} origin 
 * @param {*} destination 
 * @returns 
 */
export function getNonLoggedInUsersScores (origin, destination) {
  if(origin && origin.length === 0) {
    return null;
  }
  let scores = createNewScores(origin, destination);

  if(destination) {
    scores.destination = destination;
  }
  return scores
}

export async function getScores(origin, destination) {
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

export async function loadScores(origin, destination, userID) {
  if (origin && origin.length === 0) {
    return null;
  }

  let savedScores;
  // Grab the last time the system was updated (changes to algorithm, transit schedules update, etc...)
  const timeValues = await axios.get('http://localhost:5000/global/');
  const lastAlgoUpdateTime = timeValues.data.lastAlgoUpdateTime;

  // Grab the last time the user updated their preferences
  const user = await axios.get(`http://localhost:5000/userByID/${userID}`);
  const lastPrefChangeTime = user.data[0].lastPrefChangeTime;

  // Get the latest scores for the origin/destination pair (or origin only if destination is null)
  savedScores = await thisModule.getScores(origin, destination);

  // Generate the scores if there are no saved scores.
  // Or, re-generate the scores if the system was updated, or the user preferences changed since last generation
  if (!savedScores || savedScores.generatedTime < lastPrefChangeTime || savedScores.generatedTime < lastAlgoUpdateTime) {
    await thisModule.generateNewScores(origin, destination);
    savedScores = await thisModule.getScores(origin, destination);
  }

  let scores = {
    overall: savedScores.overall,
    rushHour: savedScores.rushHour,
    offPeak: savedScores.offPeak,
    weekend: savedScores.weekend,
    overnight: savedScores.overnight
  }

  if (destination) {
    scores.destination = destination;
  }
  return scores;
}

export async function updateAlgorithmTime() {
  // Update the record for when the system was updated to match the current time
  let params =
    {
      lastAlgoUpdateTime: Date.now()
    };

  await axios.post('http://localhost:5000/modifyGlobal/', params);
}
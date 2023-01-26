import axios from "axios";
import * as thisModule from './scoring.js';

export async function saveScores(origin, destination, scores, date) {
   await axios.post('http://localhost:5000/newSavedScore', {
    params:
    {
        origin: origin,
        destination: destination,
        generatedTime: date,
        overall: scores.overall,
        rushHour: scores.rushHour,
        offPeak:scores.offPeak,
        weekend:scores.weekend,
        overNight:scores.overNight
    }
   });
}

export function generateNewScores(origin, destination, user){
  let rushHour = (Math.random()*100) + 1;
  rushHour = Math.floor(rushHour);

  let offPeak = (Math.random()*100) + 1;
  offPeak = Math.floor(offPeak);

  let weekend = (Math.random()*100) + 1;
  weekend = Math.floor(weekend);

  let night = (Math.random()*100) + 1;
  night = Math.floor(night);

  let overall = (Math.random()*100) + 1;
  overall = Math.floor(night);

  let date = Date.now();

  let scores =
  {
    overall:overall,
    rushHour:rushHour,
    offPeak:offPeak,
    weekend:weekend,
    overNight:night
  };
    thisModule.saveScores(origin, destination, scores, date);
}

export async function getScores(origin, destination){
    const result = await axios.get(`http://localhost:5000/savedScores/${origin}/${destination}`, {
        params:
        {
            origin:origin,
            destination:destination,
        }
    }).then((response) => {
        return response.data;
    }).catch(err => console.log(err));

    return result;
}

export async function loadScores(origin, destination, userID){
    let savedScores;
    const timeValues = await axios.get('http://localhost:5000/global/');
    const lastUpdateAlgoUpdateTime = timeValues.data[0].lastUpdateAlgoUpdateTime;
    const user = await axios.get(`http://localhost:5000/userByID/${userID}`);
    const lastPrefChangeTime = user.data[0].lastPrefChangeTime;

    savedScores = await thisModule.getScores(origin,destination);

    if (savedScores==null || savedScores.date < lastPrefChangeTime || savedScores.date < lastUpdateAlgoUpdateTime ){
        await thisModule.generateNewScores(origin,destination,user);
        savedScores = await thisModule.getScores(origin,destination);
    }

    return {
        overall: savedScores.overall,
        rushHour: savedScores.rushHour,
        offPeak: savedScores.offPeak,
        weekend: savedScores.weekend,
        overNight: savedScores.overNight
    };
}

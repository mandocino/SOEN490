import axios from "axios";
import { response as savedScores } from "express";
import { Query } from "mongoose";

export async function saveScores(origin, destination, scores, date) {
   await axios.post('http://localhost:5000/newSavedScore', {
    params:
    {
        orgin: origin,
        destination: destination,
        generatedTime: date,
        overall: scores.overall,
        rushHour: scores.rushHour,
        offPeak:scores.offPeak,
        weekend:scores.weekend,
        overNight:scores.overNight
    }
   });
};

export function generateNewScores(origin, destination, user){
  var rushHour = (Math.random()*100) + 1;
  Math.floor(this.rushHour);
  
  var offPeak = (Math.random()*100) + 1;
  Math.floor(this.offPeak);
  
  var weekend = (Math.random()*100) + 1;
  Math.floor(this.weekend);
  
  var night = (Math.random()*100) + 1;
  Math.floor(this.night);
  
  var overall = (Math.random()*100) + 1;
  Math.floor(this.night);

  var date = Date.now();

  var scores = 
  {
    overall:overall,
    rushHour:rushHour,
    offPeak:offPeak,
    weekend:weekend,
    overNight:night
  };
  saveScores(origin, destination, scores, date);
};

export async function getScores(orgin, destination, user){
    await axios.get(`http://localhost:5000/savedScores/${origin}/${destination}`, {
        params:
        {
            origin:origin,
            destination:destination,
        }
    }).then(async (response) => {
        // We need to add the Algorithm update check and the Users preference last udate check
        return response.data;

    }).catch(err => console.log(err));
};

export async function loadScores(origin, destination, user){
    var savedScores;
    var timeValues = await axios.get('http://localhost:5000/global/');
    var lastUpdateAlgoUpdateTime = timeValues.data[0].lastUpdateAlgoUpdateTime;
    var user = await axios.get(`http://localhost:5000/userByID/${user}`);
    var lastPrefChangeTime = user.data[0].lastPrefChangeTime;
    savedScores = getScores(origin,destination,user);
    if (savedScores==null || savedScores.date << lastPrefChangeTime || savedScores.date << lastUpdateAlgoUpdateTime ){
        generateNewScores(origin,destination,user);
        savedScores = getScores(origin,destination,user);
    }
    var scores = {
        overall: savedScores.overall,
        rushHour: savedScores.rushHour,
        offPeak: savedScores.offPeak,
        weekend: savedScores.weekend,
        overNight: savedScores.overNight
    }
    console.log(scores);
    return scores;
};
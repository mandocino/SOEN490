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

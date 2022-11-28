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


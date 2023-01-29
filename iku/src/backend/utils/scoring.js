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
    if (destination) {
        params.destination = destination;
        await axios.post(`http://localhost:5000/editSavedScore/${origin._id}/${destination._id}`, params);
        // console.log(`DELETE ${origin._id} ${destination._id}`);
    } else {
        await axios.post(`http://localhost:5000/editSavedScore/${origin._id}`, params);
        // console.log(`DELETE ${origin._id}`);
    }
    // await axios.post('http://localhost:5000/newSavedScore', params);
}

export async function generateNewScores(origin, destination = null) {
    // if (destination) {
    //     console.log(`GENERATE ${origin._id} ${destination._id}`);
    // } else {
    //     console.log(`GENERATE ${origin._id}`);
    // }

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

    let date = Date.now();

    let scores =
        {
            overall: overall,
            rushHour: rushHour,
            offPeak: offPeak,
            weekend: weekend,
            overnight: night
        };
    await thisModule.saveScores(origin, destination, scores, date);
}

export async function getScores(origin, destination) {
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
    let savedScores;
    const timeValues = await axios.get('http://localhost:5000/global/');
    const lastUpdateAlgoUpdateTime = timeValues.data.lastUpdateAlgoUpdateTime;
    const user = await axios.get(`http://localhost:5000/userByID/${userID}`);
    const lastPrefChangeTime = user.data[0].lastPrefChangeTime;

    savedScores = await thisModule.getScores(origin, destination);

    if (!savedScores || savedScores.length === 0 || savedScores.date < lastPrefChangeTime || savedScores.date < lastUpdateAlgoUpdateTime) {
        await thisModule.generateNewScores(origin, destination);
        savedScores = await thisModule.getScores(origin, destination);
    }

    console.log(`loading for ${origin.name}, ${destination}`)
    console.log(savedScores);

    return {
        overall: savedScores.overall,
        rushHour: savedScores.rushHour,
        offPeak: savedScores.offPeak,
        weekend: savedScores.weekend,
        overnight: savedScores.overnight
    };
}

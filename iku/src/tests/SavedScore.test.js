import '@testing-library/jest-dom';
import axios from 'axios';
import mongoose from "mongoose";

describe("Database tests", () => {
    let scoreID = "";
    let origin = null;
    let destination = null;
    test("Create", async () => {
        const resCreate = await axios.post(`http://localhost:5000/newSavedScore/`, {
            origin: new mongoose.mongo.ObjectId(),
            destination: new mongoose.mongo.ObjectId(),
            generatedTime: new mongoose.mongo.Date(),
            overall: 0,
            rushHour: 0,
            offPeak: 0,
            weekend: 0,
            overnight: 0
        });
        expect(resCreate.data).toHaveProperty('_id');
        scoreID = resCreate.data._id;
        origin = resCreate.data.origin;
        destination = resCreate.data.destination;
    });

    test("Get", async () => {
        const resGet = await axios.get(`http://localhost:5000/savedScores/${origin}/${destination}`);
        expect(Array.isArray(resGet.data)).toBe(true);
        expect(resGet.data.length).toBeGreaterThanOrEqual(1);
        let found = false;
        for(let i = 0;i<resGet.data.length;++i){
            if(resGet.data[i]._id == scoreID){
                found = true;
            }
        }
        expect(found).toBe(true);
    });

    test("Delete", async () => {
        const resDelete = await axios.post(`http://localhost:5000/deleteSavedScore/`, {
            _id: scoreID
        });
        const resGet = await axios.get(`http://localhost:5000/locations/${objectID}`);
        expect(Array.isArray(resGet.data)).toBe(true);
        let found = false;
        for(let i = 0;i<resGet.data.length;++i){
            if(resGet.data[i]._id == locationID){
                found = true;
            }
        }
        expect(found).toBe(false);
    });
});
import '@testing-library/jest-dom';
import axios from 'axios';
import mongoose from "mongoose";

import express from 'express';
import router from '../backend/routes/routes'
import {connectToServer} from "../backend/config/db.js";

const app = express();

jest.setTimeout(10000);

let appServer;

beforeAll((done) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use("/", router);

    connectToServer();
    appServer = app.listen(5000, done);
})


afterAll((done) => {
    appServer.close(done);
})

describe("Database tests", () => {
    let scoreID = "";
    let origin = null;
    let destination = null;
    test("Create", async () => {
        const resCreate = await axios.post(`http://iku.ddns.net:5000/newSavedScore/`, {
            origin: new mongoose.mongo.ObjectId(),
            destination: new mongoose.mongo.ObjectId(),
            generatedTime: new Date(),
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
        const resGet = await axios.get(`http://iku.ddns.net:5000/savedScores/${origin}/${destination}`);
        expect(Array.isArray(resGet.data)).toBe(false);
        expect(resGet.data._id).toBe(scoreID);
    });

    test("Delete", async () => {
        const resDelete = await axios.post(`http://iku.ddns.net:5000/deleteSavedScore/`, {
            _id: scoreID
        });
        const resGet = await axios.get(`http://iku.ddns.net:5000/savedScores/${origin}/${destination}`);
        expect(Array.isArray(resGet.data)).toBe(false);
        expect(resGet.data).toBe(null);
    });
});
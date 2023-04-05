import '@testing-library/jest-dom';
import axios from 'axios';

import express from 'express';
import router from '../backend/routes/routes'
import {connectToServer} from "../backend/config/db.js";
import {hostname} from "../App";

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
    let confirmID = "";
    let codeVal = "";
    test("Create", async () => {
        const resCreate = await axios.post(`http://${hostname}:5000/newEmailConfirmation/`, {
            email: "iku.soen490@gmail.com"
        });
        expect(resCreate.data).toHaveProperty('_id');
        confirmID = resCreate.data._id;
        codeVal = resCreate.data.code;
    });

    test("Get", async () => {
        const resGet = await axios.post(`http://${hostname}:5000/emailConfirmation/`, {
            email: "iku.soen490@gmail.com",
            code: codeVal
        });
        expect(resGet.data[0]).toHaveProperty('_id');
    });

    test("Delete", async () => {
        const resDelete = await axios.post(`http://${hostname}:5000/removeEmailConfirmation/`, {
            email: "iku.soen490@gmail.com",
            code: codeVal
        });
        const resGet = await axios.post(`http://${hostname}:5000/emailConfirmation/`, {
            email: "iku.soen490@gmail.com",
            code: codeVal
        });
        expect(Array.isArray(resGet.data)).toBe(true);
        expect(resGet.data.length).toBe(0);
    });
});
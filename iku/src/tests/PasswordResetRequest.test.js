import '@testing-library/jest-dom';
import axios from 'axios';

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
    let resetID = "";
    let codeVal = "";
    test("Create", async () => {
        const resCreate = await axios.post(`http://localhost:5000/newPasswordResetRequest/`, {
            email: "iku.soen490@gmail.com"
        });
        expect(resCreate.data).toHaveProperty('_id');
        resetID = resCreate.data._id;
        expect(resCreate.data).toHaveProperty('code');
        codeVal = resCreate.data.code;
    });

    test("Get", async () => {
        const resGet = await axios.post(`http://localhost:5000/passwordResetRequest/`, {
            user_id: "6334936ea7e4368f95ec50c9",
            code: codeVal
        });
        expect(resGet.data[0]).toHaveProperty('_id');
    });

    test("Modify", async () => {
        const resGet = await axios.post(`http://localhost:5000/updatePasswordResetRequest/`, {
            user_id: "6334936ea7e4368f95ec50c9",
            email: "iku.soen490@gmail.com"
        });
        expect(resGet.data.code).not.toBe(codeVal);
        codeVal = resGet.data.code;
    });

    test("Delete", async () => {
        const resDelete = await axios.post(`http://localhost:5000/removePasswordResetRequest/`, {
            _id: resetID
        });
        const resGet = await axios.post(`http://localhost:5000/passwordResetRequest/`, {
            user_id: "6334936ea7e4368f95ec50c9",
            code: codeVal
        });
        expect(Array.isArray(resGet.data)).toBe(true);
        expect(resGet.data.length).toBe(0);
    });
});
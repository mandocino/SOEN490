import '@testing-library/jest-dom';
import axios from 'axios';
import mongoose from "mongoose";

describe("Database tests", () => {
    let confirmID = "";
    let codeVal = "";
    test("Create", async () => {
        const resCreate = await axios.post(`http://localhost:5000/newEmailConfirmation/`, {
            email: "iku.soen490@gmail.com"
        });
        expect(resCreate.data).toHaveProperty('_id');
        confirmID = resCreate.data._id;
        codeVal = resCreate.data.code;
    });

    test("Get", async () => {
        const resGet = await axios.post(`http://localhost:5000/emailConfirmation/`, {
            email: "iku.soen490@gmail.com",
            code: codeVal
        });
        expect(resGet.data[0]).toHaveProperty('_id');
    });

    test("Delete", async () => {
        const resDelete = await axios.post(`http://localhost:5000/removeEmailConfirmation/`, {
            email: "iku.soen490@gmail.com",
            code: codeVal
        });
        const resGet = await axios.post(`http://localhost:5000/emailConfirmation/`, {
            email: "iku.soen490@gmail.com",
            code: codeVal
        });
        expect(Array.isArray(resGet.data)).toBe(true);
        expect(resGet.data.length).toBe(0);
    });
});
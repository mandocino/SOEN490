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

const getUsers = async () => {
    const res = await axios.get('http://localhost:5000/users');
    expect(Array.isArray(res.data)).toBe(true)
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data[0]).toHaveProperty('_id');
    return res;
}

describe("Default test", () => {
    test("Default", () => {
        expect(true);
    });
});

// USER
describe("User tests", () => {
    test("Get all users", async () => {
        await getUsers();
    });

    let testUserID;
    test("Signup", async () => {
        const resSignup = await axios.post(`http://localhost:5000/signup/`, {
            email: "userSignUpTestTemp@test.com",
            first_name: "TestFirstName",
            last_name: "TestLastName",
            password: "TestPassword",
            lastScoringPrefChangeTime: 0,
            lastRoutingPrefChangeTime: 0
        });
        expect(resSignup.data).toHaveProperty('_id');
        testUserID = resSignup.data._id;
    });

    test("Get user by ID", async () => {
        const res = await getUsers();

        const resID = await axios.get(`http://localhost:5000/userByID/${res.data[0]._id}`);
        expect(Array.isArray(resID.data)).toBe(true)
        expect(resID.data.length).toBeGreaterThan(0);
        expect(resID.data[0]).toHaveProperty('email');
        expect(resID.data[0].email).toEqual(res.data[0].email);
    });

    test("Get user by email", async () => {
        const res = await getUsers();

        const resEmail = await axios.get(`http://localhost:5000/userByEmail/${res.data[0].email}`);
        expect(Array.isArray(resEmail.data)).toBe(true)
        expect(resEmail.data.length).toBeGreaterThan(0);
        expect(resEmail.data[0]).toHaveProperty('_id');
        expect(resEmail.data[0]._id).toEqual(res.data[0]._id);
    });

    test("Login", async () => {
        const resLogin = await axios.post(`http://localhost:5000/login/`, {
            email: "userSignUpTestTemp@test.com",
            password: "TestPassword"
        });
        expect(Array.isArray(resLogin.data)).toBe(true)
        expect(resLogin.data.length).toBeGreaterThan(0);
        expect(resLogin.data[0]).toHaveProperty('_id');
        expect(resLogin.data[0]._id).toEqual(testUserID);
    });

    test("Modify a user", async () => {
        await axios.post(`http://localhost:5000/modifyUserByEmail/`, {
            email: "userSignUpTestTemp@test.com",
            first_name: "modifiedTestFirstName"
        });
        const resModifyID = await axios.get(`http://localhost:5000/userByEmail/${"userSignUpTestTemp@test.com"}`);
        expect(Array.isArray(resModifyID.data)).toBe(true)
        expect(resModifyID.data.length).toBeGreaterThan(0);
        expect(resModifyID.data[0]).toHaveProperty('_id');
        const resModify = await axios.get(`http://localhost:5000/userByID/${resModifyID.data[0]._id}`);
        expect(Array.isArray(resModify.data)).toBe(true)
        expect(resModify.data.length).toBeGreaterThan(0);
        expect(resModify.data[0]).toHaveProperty('first_name');
        expect(resModify.data[0].first_name).toEqual("modifiedTestFirstName");
    });

    test("Delete a user", async () => {
        await axios.post(`http://localhost:5000/deleteUser/`, {
            email: "userSignUpTestTemp@test.com"
        });
        const resModifyID = await axios.get(`http://localhost:5000/userByEmail/${"userSignUpTestTemp@test.com"}`);
        expect(Array.isArray(resModifyID.data)).toBe(true)
        expect(resModifyID.data.length).toEqual(0);
    });
});

import '@testing-library/jest-dom';
import {jest} from '@jest/globals';
import axios from 'axios';
import {userDBModel} from "../backend/config/db";

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

    test("Signup", async () => {
        const resSignup = await axios.post(`http://localhost:5000/signup/`, {
            email: "userSignUpTestTemp@test.com",
            first_name: "TestFirstName",
            last_name: "TestLastName",
            password: "TestPassword"
        });
        expect(resSignup.data).toHaveProperty('_id');
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
        const res = await getUsers();

        const resLogin = await axios.post(`http://localhost:5000/login/`, {
            email: res.data[0].email,
            password: res.data[0].password // TODO: This will need to be rewritten when we implement password hashing
        });
        expect(Array.isArray(resLogin.data)).toBe(true)
        expect(resLogin.data.length).toBeGreaterThan(0);
        expect(resLogin.data[0]).toHaveProperty('_id');
        expect(resLogin.data[0]._id).toEqual(res.data[0]._id);
    });

    test("Modify a user", async () => {
        await axios.post(`http://localhost:5000/modifyUser/`, {
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

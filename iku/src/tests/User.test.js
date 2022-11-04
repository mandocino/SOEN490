import '@testing-library/jest-dom';
import {jest} from '@jest/globals';
import axios from 'axios';

describe("Default test", () => {
    test("Default", () => {
        expect(true);
    });
});

// USER
describe("User tests", () => {
    test("Get all users", async () => {
        const res = await axios.get('http://localhost:5000/users');
        expect(Array.isArray(res.data)).toBe(true)
        expect(res.data.length).toBeGreaterThan(0);
        expect(res.data[0]).toHaveProperty('_id');
    });

    test("Get user by ID", async () => {
        const res = await axios.get('http://localhost:5000/users');
        expect(Array.isArray(res.data)).toBe(true)
        expect(res.data.length).toBeGreaterThan(0);
        expect(res.data[0]).toHaveProperty('_id');

        const resID = await axios.get(`http://localhost:5000/userByID/${res.data[0]._id}`);
        expect(Array.isArray(resID.data)).toBe(true)
        expect(resID.data.length).toBeGreaterThan(0);
        expect(resID.data[0]).toHaveProperty('email');
        expect(resID.data[0].email).toEqual(res.data[0].email);
    });
});

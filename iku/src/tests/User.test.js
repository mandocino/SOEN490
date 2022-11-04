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
    test("Get all users", () => {
        axios.get('http://localhost:5000/users')
            .then(function (response) {
                expect(Array.isArray(response.data)).toBe(true)
                expect(response.data.length).toBeGreaterThan(0);
                expect(response.data[0]).toHaveProperty('_id');
            })
            .catch(function (error) {
                throw new Error('Failed to get users')
            });
    });
});

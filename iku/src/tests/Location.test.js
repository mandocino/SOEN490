import '@testing-library/jest-dom';
import request from 'supertest';
import express from 'express';
import router from '../backend/routes/routes'
const app = express();

import axios from 'axios';
import mongoose from "mongoose";
import { getSuggestions, getAddressByCoordinates, getCoordinatesByAddress } from '../backend/controllers/location';

jest.setTimeout(10000);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", router);

describe("Google Geocoding API tests", () => {
    // Test geocoding with valid coordinates
    // test("Get address from coordinates", async() => {

    //     const concordiaLatitude = 45.497109;
    //     const concordiaLongitude = -73.578734;
    //     const geocodedAddress = await axios.get('http://localhost:5000/address/', {
    //         params:{
    //           lat: concordiaLatitude,
    //           lng: concordiaLongitude
    //         }
    //     });
    //     const address = geocodedAddress.data.address;
    //     expect(address).toContain("1455");
    //     expect(address).toContain("Maisonneuve");
    // });
    
    test("Get address from coordinates", async() => {
        const concordiaLatitude = 45.497109;
        const concordiaLongitude = -73.578734;

        const geocodedAddress = await request(app)
            .get('/address/')
            .query({
                    lat: concordiaLatitude,
                    lng: concordiaLongitude
                });
        
        const address = geocodedAddress.body.address;
        expect(address).toContain("1455");
        expect(address).toContain("Maisonneuve");
    });
    
    // Test geocoding with valid address
    // test("Get coordinates from a valid address", async() => {
    //     const address = 'Concordia University, Boulevard de Maisonneuve Ouest';
    //     const geocodedCoordinates = await axios.get('http://localhost:5000/coordinates', {
    //         params: {
    //             address: address
    //         }
    //     });
    //     const coordinates = geocodedCoordinates.data.coordinates;
    //     expect(coordinates.lat).toBe(45.4948363);
    //     expect(coordinates.lng).toBe(-73.5779128);
    // })

    test("Get coordinates from a valid address", async() => {
        const address = 'Concordia University, Boulevard de Maisonneuve Ouest';
        const geocodedCoordinates = await request(app)
            .get('/coordinates/')
            .query({
                address: address
            });
        const coordinates = geocodedCoordinates.body.coordinates;
        expect(coordinates.lat).toBe(45.4948363);
        expect(coordinates.lng).toBe(-73.5779128);
    })
});


describe("Google Places Autocomplete API test", () => {

    // Test to check that an Non empty array is returned
    // test("Get suggestions for a given input", async () => {
    //     const input = 'montreal';
    //     console.log(process.env.GEOCODING_KEY)
    //     const suggestionsResponse = await axios.get('http://localhost:5000/suggestions', {
    //         params: {
    //             input: input
    //         }
    //     });
    //     const suggestions = suggestionsResponse.data.predictions;
    //     expect(suggestionsResponse.status).toBe(200); // 200 --> successful request
    //     expect(suggestions[0]).toBe("Montreal, QC, Canada");
    // })

    test("Get suggestions for a given input", async () => {
        const input = 'montreal';
        const suggestionsResponse = await request(app)
            .get('/suggestions/')
            .query({
                input: input
            });

        const suggestions = suggestionsResponse.body.predictions;
        expect(suggestionsResponse.status).toBe(200); // 200 --> successful request
        expect(suggestions[0]).toBe("Montreal, QC, Canada");
    })
});

// describe("Database tests", () => {
//     let locationID = "";
//     const objectID = new mongoose.mongo.ObjectId('6334936ea7e4368f95ec50c9');

    // test("Create", async () => {
    //     const resSignup = await axios.post(`http://localhost:5000/newlocation/`, {
    //         user_id: new mongoose.mongo.ObjectId('6334936ea7e4368f95ec50c9'),
    //         latitude: 0,
    //         longitude: 0,
    //         name: "Test",
    //         origin: true,
    //         current_home: true
    //     });
    //     expect(resSignup.data).toHaveProperty('_id');
    //     locationID = resSignup.data._id;
    // });

    // test("Get", async () => {
    //     const resGet = await axios.get(`http://localhost:5000/locations/${objectID}`);
    //     expect(Array.isArray(resGet.data)).toBe(true);
    //     expect(resGet.data.length).toBeGreaterThanOrEqual(1);
    //     let found = false;
    //     for(let i = 0;i<resGet.data.length;++i){
    //         if(resGet.data[i]._id == locationID){
    //             found = true;
    //         }
    //     }
    //     expect(found).toBe(true);
    // });

    // test("Modify", async () => {
    //     const resModify = await axios.post(`http://localhost:5000/updateLocation/`, {
    //         _id: locationID,
    //         name: "ModifiedTest"
    //     });
    //     expect(resModify.data.name).toBe("ModifiedTest");
    // });

    // test("Delete", async () => {
    //     const resModify = await axios.post(`http://localhost:5000/deleteLocation/`, {
    //         _id: locationID
    //     });
    //     const resGet = await axios.get(`http://localhost:5000/locations/${objectID}`);
    //     expect(Array.isArray(resGet.data)).toBe(true);
    //     let found = false;
    //     for(let i = 0;i<resGet.data.length;++i){
    //         if(resGet.data[i]._id == locationID){
    //             found = true;
    //         }
    //     }
    //     expect(found).toBe(false);
    // });

// });
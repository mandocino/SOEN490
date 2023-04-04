import '@testing-library/jest-dom';
import axios from 'axios';
import express from 'express';
import router from '../backend/routes/routes'
import {connectToServer} from "../backend/config/db.js";

import mongoose from "mongoose";

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

describe("Google Geocoding API tests", () => {
    // Test geocoding with valid coordinates (Address from coordinates)
    test("Get address from coordinates", async() => {

        const concordiaLatitude = 45.497109;
        const concordiaLongitude = -73.578734;
        const geocodedAddress = await axios.get('http://iku.ddns.net:5000/address/', {
            params:{
              lat: concordiaLatitude,
              lng: concordiaLongitude
            }
        });
        const address = geocodedAddress.data.address;
        expect(address).toContain("1455");
        expect(address).toContain("Maisonneuve");
    });

    // Test for bad request (Address from coordinates)
    test("Failed request for /address/", async () => {
        const response = await axios.get('http://iku.ddns.net:5000/address/', {
            params: null
        });
        expect(response.data.status).toBe(400);
    })
    

    // Test geocoding with valid address (coordinates from address)
    test("Get coordinates from a valid address", async() => {
        const address = 'Concordia University, Boulevard de Maisonneuve Ouest';
        const geocodedCoordinates = await axios.get('http://iku.ddns.net:5000/coordinates', {
            params: {
                address: address
            }
        });
        const coordinates = geocodedCoordinates.data.coordinates;
        expect(coordinates.lat).toBe(45.4948363);
        expect(coordinates.lng).toBe(-73.5779128);
    })

     // Test for bad request (coordinates from address)
    test("Failed request for /coordinates/", async () => {
        const response = await axios.get('http://iku.ddns.net:5000/coordinates', {
            params: {
                address: null
            }
        });
        expect(response.data.status).toBe(400);

    })
});


describe("Google Places Autocomplete API test", () => {

    // Test valid request to Google autocomplete Api
    test("Get suggestions for a given input", async () => {
        const input = 'montreal';
        const suggestionsResponse = await axios.get('http://iku.ddns.net:5000/suggestions', {
            params: {
                input: input
            }
        });
        const suggestions = suggestionsResponse.data.predictions;
        expect(suggestionsResponse.status).toBe(200); // 200 --> successful request
        expect(suggestions[0]).toBe("Montreal, QC, Canada");
    })


    //Test for invalid request to Google autocomplete API
    test("Failed request for /suggestions/", async () => {
        const response = await axios.get('http://iku.ddns.net:5000/suggestions', {
            params: {
                input: null
            }
        });
        console.log(response);
        expect(response.data.status).toBe(400); //400 --> Invalid request
    })
});

describe("Database tests", () => {
    let locationID = "";
    const objectID = new mongoose.mongo.ObjectId('6334936ea7e4368f95ec50c9');

    test("Create", async () => {
        const resSignup = await axios.post(`http://iku.ddns.net:5000/newlocation/`, {
            user_id: new mongoose.mongo.ObjectId('6334936ea7e4368f95ec50c9'),
            latitude: 0,
            longitude: 0,
            name: "Test",
            origin: true,
            current_home: true
        });
        expect(resSignup.data).toHaveProperty('_id');
        locationID = resSignup.data._id;
    });

    test("Create with invalid request", async () => {
        const response = await axios.post(`http://iku.ddns.net:5000/newlocation/`, {
            user_id: null,
            latitude: 0,
            longitude: 0,
            name: "Fail Test",
            origin: true,
            current_home: true
        });
        expect(response.data.message).toContain("Location validation failed");
    })


    test("Get", async () => {
        const resGet = await axios.get(`http://iku.ddns.net:5000/locations/${objectID}`);
        expect(Array.isArray(resGet.data)).toBe(true);
        expect(resGet.data.length).toBeGreaterThanOrEqual(1);
        let found = false;
        for(let i = 0;i<resGet.data.length;++i){
            if(resGet.data[i]._id == locationID){
                found = true;
            }
        }
        expect(found).toBe(true);
    });


    test("Modify", async () => {
        const resModify = await axios.post(`http://iku.ddns.net:5000/updateLocation/`, {
            _id: locationID,
            name: "ModifiedTest"
        });
        expect(resModify.data.name).toBe("ModifiedTest");
    });

    test("Modify with invalid request", async () => {
        const response = await axios.post(`http://iku.ddns.net:5000/updateLocation/`, {
            _id: 'badID',
            name: "ModifiedTest"
        });
        expect(response.data.message).toContain("failed");
    });

    test("Delete", async () => {
        const resModify = await axios.post(`http://iku.ddns.net:5000/deleteLocation/`, {
            _id: locationID
        });
        const resGet = await axios.get(`http://iku.ddns.net:5000/locations/${objectID}`);
        expect(Array.isArray(resGet.data)).toBe(true);
        let found = false;
        for(let i = 0;i<resGet.data.length;++i){
            if(resGet.data[i]._id == locationID){
                found = true;
            }
        }
        expect(found).toBe(false);
    });

    test("Delete with invalid request", async () => {
        const response = await axios.post(`http://iku.ddns.net:5000/deleteLocation/`, {
            _id: 'badID'
        });
        expect(response.data.message).toContain("failed");
    });

});


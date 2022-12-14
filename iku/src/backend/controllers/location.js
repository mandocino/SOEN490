import {Client} from "@googlemaps/google-maps-services-js";

// Import function from location Model
import { createLocation, getLocationsByUserID, modifyLocation, removeLocation } from "../models/locationModel.js";

// Google client for Geocoding API
const geocodingClient = new Client({});

// Create a new location with data
export const addLocation = (req, res) => {
    const data = req.body;
    createLocation(data, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Get locations by user ID
export const showLocationsByUserID = (req, res) => {
    getLocationsByUserID(req.params.id, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Get address by coordinates
export const getAddressByCoordinates = (req, res) => {
    const latlng = req.query.lat + ',' + req.query.lng;
    const key = process.env.GEOCODING_KEY;
    console.log(key);
    const params = {
        key: key,
        latlng: latlng
    };

    console.log("retrieving address for " + req.query.lat + ", " + req.query.lng);
    geocodingClient.geocode({
        params:params
    })
    .then((response) => {
        const address = response.data.results[0].formatted_address;
        res.json({'address': address});
    })
    .catch((error)=>{
        console.log(error);
    });
}

// Get places suggestions given user input
export const getSuggestions = async (req, res) => {
    const key = process.env.GEOCODING_KEY;
    const input = req.query.input;
    const params = {
        key: key,
        input: input
    }
    geocodingClient.placeAutocomplete({
        params: params
    })
    .then((response) => {
        const predictions = response.data.predictions.map(prediction => (
            prediction.description
        ));
        res.json({'predictions': predictions});
    })
    .catch((error) => {
        console.log(error.message);
    });
}

//Get Coordinates of specified address
export const getCoordinatesByAddress = (req, res) => {
    const key = process.env.GEOCODING_KEY;
    const address = req.query.address;
    const params = {
        key: key,
        address: address
    }
    geocodingClient.geocode({
        params: params
    })
    .then(response => {
        const coordinates = response.data.results[0].geometry.location;
        res.json({'coordinates': coordinates});
    })
    .catch(error => {
        console.log(error.message);
    })
}
    
// Update a location by its object ID
export const updateLocation = (req, res) => {
    modifyLocation(req.body, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Delete a location by its object ID
export const deleteLocation = (req, res) => {
    removeLocation(req.body._id, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}
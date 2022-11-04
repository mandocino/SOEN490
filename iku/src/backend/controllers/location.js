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
    var latlng = req.query.lat + ',' + req.query.lng;
    const key = process.env.GEOCODING_KEY;
    console.log(key);
    var params = {
        key: key,
        latlng: latlng
    };

    console.log("retrieving address for " + req.query.lat + ", " + req.query.lng);
    geocodingClient.geocode({
        params:params
    })
    .then((response) => {
        var address = response.data.results[0].formatted_address;
        res.json({'address': address});
    })
    .catch((error)=>{
        console.log(error);
    });
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
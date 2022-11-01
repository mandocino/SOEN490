// Import function from location Model
import { createLocation, getLocationsByUserID, modifyLocation, removeLocation } from "../models/locationModel.js";

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
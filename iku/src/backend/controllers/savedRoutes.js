// Import function from saved routes Model
import {
    getSavedRoutingDataByLocations,
    createSavedRoutingData,
    removeSavedRoutingData,
    removeSavedRoutingDataByLocations,
    updateSavedRoutingDataByLocations
} from "../models/savedRoutesModel.js";

// Get saved Routes by origin and destination
export const showSavedRoutingDataByLocations = (req, res) => {
    getSavedRoutingDataByLocations(req.params.origin, req.params.destination, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Create a new set of saved routes with data
export const addSavedRoutingData = (req, res) => {
    const data = req.body;
    createSavedRoutingData(data, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Update/Upsert a set of saved routes with data
export const editSavedRoutingDataByLocations = (req, res) => {
    const updateData = req.body;
    updateSavedRoutingDataByLocations(req.params.origin, req.params.destination, updateData, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Delete a SavedRoutes by its object ID
export const deleteSavedRoutingData = (req, res) => {
    removeSavedRoutingData(req.body._id, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Delete a SavedRoutes by origin and destination
export const deleteSavedRoutingDataByLocations = (req, res) => {
    removeSavedRoutingDataByLocations(req.params.origin, req.params.destination, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

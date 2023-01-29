// Import function from saved score Model
import {
    getSavedScoresByLocations,
    getSavedScoresByOrigin,
    createSavedScore,
    removeSavedScore,
    removeSavedScoresByLocations,
    removeSavedScoresByOrigin,
    updateSavedScoreByOrigin,
    updateSavedScoreByLocations
} from "../models/savedScoreModel.js";

// Get saved scores by origin and destination
export const showSavedScoresByLocations = (req, res) => {
    getSavedScoresByLocations(req.params.origin, req.params.destination, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Get saved scores by origin only
export const showSavedScoresByOrigin = (req, res) => {
    getSavedScoresByOrigin(req.params.origin, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Create a new saved score with data
export const addSavedScore = (req, res) => {
    const data = req.body;
    createSavedScore(data, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Update/Upsert a saved score with data
export const editSavedScoreByLocations = (req, res) => {
    const updateData = req.body;
    updateSavedScoreByLocations(req.params.origin, req.params.destination, updateData, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Update/Upsert a saved score with data
export const editSavedScoreByOrigin = (req, res) => {
    const updateData = req.body;
    updateSavedScoreByOrigin(req.params.origin, updateData, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Delete a SavedScore by its object ID
export const deleteSavedScore = (req, res) => {
    removeSavedScore(req.body._id, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Delete a SavedScore by origin and destination
export const deleteSavedScoreByLocations = (req, res) => {
    removeSavedScoresByLocations(req.params.origin, req.params.destination, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Delete a SavedScore by its object ID
export const deleteSavedScoreByOrigin = (req, res) => {
    removeSavedScoresByOrigin(req.params.origin, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}
// Import function from saved score Model
import { getSavedScoresByLocations, getSavedScoresByOrigin, createSavedScore, removeSavedScore } from "../models/savedScoreModel.js";

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
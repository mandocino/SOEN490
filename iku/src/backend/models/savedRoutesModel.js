// import connection
import {savedItinerariesDBModel, savedRoutingDataDBModel} from "../config/db.js";

// Get saved routes by origin and destination
export const getSavedRoutingDataByLocations = (originID, destID, result) => {
    savedRoutingDataDBModel.findOne({'origin':originID, 'destination':destID},(err, data) => {
        if (err){
            console.log(err);
        }
        else{
            if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
                console.log(data);
            }
            result(null, data);
        }
    });
}

// Get saved itineraries by origin and destination
export const getSavedItinerariesByLocations = (originID, destID, result) => {
    savedItinerariesDBModel.findOne({'origin':originID, 'destination':destID},(err, data) => {
        if (err){
            console.log(err);
        }
        else{
            if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
                console.log(data);
            }
            result(null, data);
        }
    });
}

// Creates a new location using given data
export const createSavedRoutingData = (data, result) => {
    savedRoutingDataDBModel.create(data, (err, data) => {
        if (err){
            console.log(err);
        }
        else{
            if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
                console.log(data);
            }
            result(null, data);
        }
    });
}

// Updates or upserts an existing origin/destination set of saved routes using given data
export const updateSavedRoutingDataByLocations = (originID, destID, updateData, result) => {
    savedRoutingDataDBModel.findOneAndUpdate({'origin': originID, 'destination': destID}, updateData, {
        new: true,
        upsert: true
    }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
                console.log(data);
            }
            result(null, data);
        }
    });
}

// Updates or upserts an existing origin/destination set of saved itineraries using given data
export const updateSavedItinerariesByLocations = (originID, destID, updateData, result) => {
    savedItinerariesDBModel.findOneAndUpdate({'origin': originID, 'destination': destID}, updateData, {
        new: true,
        upsert: true
    }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
                console.log(data);
            }
            result(null, data);
        }
    });
}

// Remove a SavedRoutes by its Object ID
export const removeSavedRoutingData = (_id, result) => {
    savedRoutingDataDBModel.findOneAndDelete({_id:_id},(err, data) => {
        if (err){
            console.log(err);
        }
        else{
            if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
                console.log(data);
            }
            result(null, data);
        }
    });
}

// Remove a SavedItineraries by its Object ID
export const removeSavedItineraries = (_id, result) => {
    savedItinerariesDBModel.findOneAndDelete({_id:_id},(err, data) => {
        if (err){
            console.log(err);
        }
        else{
            if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
                console.log(data);
            }
            result(null, data);
        }
    });
}

// Remove saved routes by origin and destination
export const removeSavedRoutingDataByLocations = (originID, destID, result) => {
    savedRoutingDataDBModel.deleteMany({'origin': originID, 'destination': destID},(err, data) => {
        if (err){
            console.log(err);
        }
        else{
            if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
                console.log(data);
            }
            result(null, data);
        }
    });
}

// Remove saved itineraries by origin and destination
export const removeSavedItinerariesByLocations = (originID, destID, result) => {
    savedItinerariesDBModel.deleteMany({'origin': originID, 'destination': destID},(err, data) => {
        if (err){
            console.log(err);
        }
        else{
            if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
                console.log(data);
            }
            result(null, data);
        }
    });
}

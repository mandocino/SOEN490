// import connection
import {savedRoutesDBModel} from "../config/db.js";

// Get saved routes by origin and destination
export const getSavedRoutingDataByLocations = (originID, destID, result) => {
    savedRoutesDBModel.findOne({'origin':originID, 'destination':destID},(err, data) => {
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
    savedRoutesDBModel.create(data, (err, data) => {
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
    savedRoutesDBModel.findOneAndUpdate({'origin': originID, 'destination': destID}, updateData, {
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
    savedRoutesDBModel.findOneAndDelete({_id:_id},(err, data) => {
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
    savedRoutesDBModel.deleteMany({'origin': originID, 'destination': destID},(err, data) => {
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

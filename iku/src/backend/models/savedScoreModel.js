// import connection
import {locationDBModel, savedScoreDBModel} from "../config/db.js";

// Get saved scores by origin and destination
export const getSavedScoresByLocations = (originID, destID, result) => {
    savedScoreDBModel.find({'origin':originID,'destination':destID},(err, data) => {
        if (err){
            console.log(err);
        }
        else{
            console.log(data);
            result(null, data);
        }
    });
}

// Creates a new location using given data
export const createSavedScore = (data, result) => {
    savedScoreDBModel.create(data, (err, data) => {
        if (err){
            console.log(err);
        }
        else{
            console.log(data);
            result(null, data);
        }
    });
}

// Remove a SavedScore by its Object ID
export const removeSavedScore = (_id, result) => {
    savedScoreDBModel.findOneAndDelete({_id:_id},(err, data) => {
        if (err){
            console.log(err);
        }
        else{
            console.log(data);
            result(null, data);
        }
    });
}
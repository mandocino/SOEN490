// import connection
import {locationDBModel} from "../config/db.js";

// Creates a new location using given data
export const createLocation = (data, result) => {
    locationDBModel.create(data, (err, data) => {
        if (err){
            console.log(err);
        }
        else{
            console.log(data);
            result(null, data);
        }
    });
}

// Get locations by user ID
export const getLocationsByUserID = (ID, result) => {
    locationDBModel.find({'user_id':ID},(err, data) => {
        if (err){
            console.log(err);
        }
        else{
            console.log(data);
            result(null, data);
        }
    });
}
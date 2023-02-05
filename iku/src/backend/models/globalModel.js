//import connection
import {globalDBModel} from "../config/db.js";

// Get globals
export const getGlobals = (result) => {
    globalDBModel.findOne((err, data) => {
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

// Update a global data
export const updateGlobals = (data, result) => {
    globalDBModel.findOneAndUpdate({}, data, {
        new: true,
        upsert: true
    }, (err, data) => {
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
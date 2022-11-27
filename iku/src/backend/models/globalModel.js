//import connection
import {globalDBModel} from "../config/db.js";

// Get globals
export const getGlobals = (result) => {
    globalDBModel.findOne((err, data) => {
        if (err){
            console.log(err);
        }
        else{
            console.log(data);
            result(null, data);
        }
    });
}

// Update a global data
export const updateGlobals = (data, result) => {
    globalDBModel.findOneAndUpdate({}, data, (err, data) => {
        if (err){
            console.log(err);
        }
        else{
            console.log(data);
            result(null, data);
        }
    });
}
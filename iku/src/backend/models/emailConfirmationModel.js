// import connection
import {emailConfirmationDBModel} from "../config/db.js";

// Creates a new email confirmation using given data
export const createEmailConfirmation = (data, result) => {
    emailConfirmationDBModel.create(data, (err, data) => {
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

// Attempt to get email confirmation data by email and code
export const findEmailConfirmation = (data, result) => {
    emailConfirmationDBModel.find(data, '_id', (err, data) => {
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

// Delete email confirmation by _id
export const deleteEmailConfirmation = (data, result) => {
    emailConfirmationDBModel.deleteOne(data, (err, data) => {
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
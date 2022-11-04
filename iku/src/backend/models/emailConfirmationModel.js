// import connection
import {emailConfirmationDBModel} from "../config/db.js";

// Creates a new email confirmation using given data
export const createEmailConfirmation = (data, result) => {
    emailConfirmationDBModel.create(data, (err, data) => {
        if (err){
            console.log(err);
        }
        else{
            console.log(data);
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
            console.log(data);
            result(null, data);
        }
    });
}

// Delete email confirmation by _id
export const deleteEmailConfirmation = (_id, result) => {
    emailConfirmationDBModel.deleteOne({_id : _id}, (err, data) => {
        if (err){
            console.log(err);
        }
        else{
            console.log(data);
            result(null, data);
        }
    });
}
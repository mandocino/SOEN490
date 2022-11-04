// import connection
import {passwordResetRequestDBModel} from "../config/db.js";

// Creates a new email confirmation using given data
export const createPasswordResetRequest = (data, result) => {
    passwordResetRequestDBModel.create(data, (err, data) => {
        if (err){
            console.log(err);
        }
        else{
            console.log(data);
            result(null, data);
        }
    });
}

// Modify an existing password reset request, given a user_id and a new code
export const modifyPasswordResetRequest = (data, result) => {
    passwordResetRequestDBModel.findOneAndUpdate({user_id : data.user_id}, {code : data.code}, (err, data) => {
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
export const findPasswordResetRequest = (data, result) => {
    passwordResetRequestDBModel.find(data, '_id', (err, data) => {
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
export const deletePasswordResetRequest = (_id, result) => {
    passwordResetRequestDBModel.deleteOne({_id : _id}, (err, data) => {
        if (err){
            console.log(err);
        }
        else{
            console.log(data);
            result(null, data);
        }
    });
}
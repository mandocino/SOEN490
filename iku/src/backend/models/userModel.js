// import connection
import {userDBModel} from "../config/db.js";

// Get All Users
export const getUsers = (result) => {
    console.log("Get users called: ");
    userDBModel.find((err, data) => {
        if (err){
            console.log(err);
        }
        else{
            console.log(data);
            result(null, data);
        }
    });
}

// Get User by ID
export const getUserByID = (ID, result) => {
    userDBModel.find({'id':ID},(err, data) => {
        if (err){
            console.log(err);
        }
        else{
            console.log(data);
            result(null, data);
        }
    });
}

// Get User ID by email
export const getUserByEmail = (email, result) => {
    userDBModel.find({'email':email}, '_id',(err, data) => {
        if (err){
            console.log(err);
        }
        else{
            console.log(data);
            result(null, data);
        }
    });
}

// Attempt to get user data by login credentials
export const login = (data, result) => {
    // TODO: Should hash password, currently stored in plaintext
    userDBModel.find(data, '_id first_name duration_priority email frequency_priority last_name walk_priority', (err, data) => {
        if (err){
            console.log(err);
        }
        else{
            console.log(data);
            result(null, data);
        }
    });
}

// Creates a new user using given data
export const signup = (data, result) => {
    // TODO: Should hash password, currently stored in plaintext
    userDBModel.create(data, (err, data) => {
        if (err){
            console.log(err);
        }
        else{
            console.log(data);
            result(null, data);
        }
    });
}

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

// Get User by username
export const getUserByUserName = (userName, result) => {
    userDBModel.find({'username':userName},(err, data) => {
        if (err){
            console.log(err);
        }
        else{
            console.log(data);
            result(null, data);
        }
    });
}

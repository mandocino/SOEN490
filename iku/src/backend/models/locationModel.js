// import connection
import {locationDBModel} from "../config/db.js";
import mongoose from "mongoose";

// Creates a new location using given data
export const createLocation = (data, result) => {
    locationDBModel.create(data, (err, data) => {
        if (err){
            console.log(err);
            result(err, data);
        }
        else{
            console.log(data);
            result(null, data);
        }
    });
}

// Get locations by user ID
export const getLocationsByUserID = (ID, result) => {
    locationDBModel.find({'user_id':mongoose.Types.ObjectId(ID)},(err, data) => {
        if (err){
            console.log(err);
        }
        else{
            console.log(data);
            result(null, data);
        }
    });
}

// Modify a location's data by its Object ID
export const modifyLocation = (data, result) => {
    locationDBModel.findOneAndUpdate({_id:data._id},data, {new: true},(err, data) => {
        if (err){
            console.log(err);
            result(err, data);
        }
        else{
            console.log(data);
            result(null, data);
        }
    });
}

// Remove a location by its Object ID
export const removeLocation = (_id, result) => {
    locationDBModel.findOneAndDelete({_id:_id},(err, data) => {
        if (err){
            console.log(err);
            result(err, data);
        }
        else{
            console.log(data);
            result(null, data);
        }
    });
}
// Import function from user Model
import { getUsers, getUserByID, getUserByUserName } from "../models/userModel.js";

// Get All Users
export const showUsers = (req, res) => {
    getUsers((err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Get User by ID
export const showUserByID = (req, res) => {
    getUserByID(req.params.id, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Get User by username
export const showUserByUserName = (req, res) => {
    getUserByUserName(req.params.userName, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

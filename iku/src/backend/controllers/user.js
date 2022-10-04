// Import function from user Model
import { getUsers, getUserByID, getUserByUserName, login, signup } from "../models/userModel.js";

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

// Attempt to get user data by login credentials
export const loginController = (req, res) => {
    const data = req.body;
    login(data, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Create a new user with data
export const signupController = (req, res) => {
    const data = req.body;
    signup(data, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

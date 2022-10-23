// import express
import express from "express";

// import functions from controllers
import { showUsers, showUserByID, showUserByUserName, loginController , signupController } from "../controllers/user.js";
import { addLocation, showLocationsByUserID } from "../controllers/location.js";

// init express router
const router = express.Router();

// Routes

///////////// USER

// Get all data for all users
router.get('/users/', showUsers);

// Get data of a user by their ID
router.get('/userByID/:id', showUserByID);

// Get data for a user by their username
router.get('/userByUserName/:userName', showUserByUserName);

// Attempt to get user data by login credentials
router.post('/login/', loginController);

// Create a new user with data
router.post('/signup/', signupController);

///////////// LOCATION

// Create a new user location with data
router.post('/newlocation/', addLocation);

// Get all locations for given player ID
router.get('/locations/:id', showLocationsByUserID);

// export default router
export default router;
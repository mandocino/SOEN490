// import express
import express from "express";

// import functions from controllers
import { showUsers, showUserByID, showUserByEmail, loginController , signupController, modifyUserByEmail, deleteUserByEmail } from "../controllers/user.js";
import { addLocation, getAddressByCoordinates, showLocationsByUserID, getSuggestions, getCoordinatesByAddress, updateLocation, deleteLocation } from "../controllers/location.js";
import { addEmailConfirmation, getEmailConfirmation, removeEmailConfirmation } from "../controllers/emailConfirmation.js";
import { addPasswordResetRequest, getPasswordResetRequest, updatePasswordResetRequest, removePasswordResetRequest } from "../controllers/passwordResetRequest.js";
import {addSavedScore, showSavedScoresByLocations} from "../controllers/savedScore.js";

// init express router
const router = express.Router();

// Routes

///////////// USER

// Get all data for all users
router.get('/users/', showUsers);

// Get data of a user by their ID
router.get('/userByID/:id', showUserByID);

// Get data for a user by their email
router.get('/userByEmail/:email', showUserByEmail);

// Attempt to get user data by login credentials
router.post('/login/', loginController);

// Create a new user with data
router.post('/signup/', signupController);

// Modify a user by email with data
router.post('/modifyUser/', modifyUserByEmail);

// Delete a user by email
router.post('/deleteUser/', deleteUserByEmail);

///////////// LOCATION

// Create a new user location with data
router.post('/newlocation/', addLocation);

// Get all locations for given player ID
router.get('/locations/:id', showLocationsByUserID);

// Get address from coordinates
router.get('/address/', getAddressByCoordinates);

//Get places suggestion and autocomplete given user input
router.get('/suggestions/', getSuggestions);

//Get Coordinates of specified address
router.get('/coordinates/', getCoordinatesByAddress);

// Update location's data by object id
router.post('/updateLocation/', updateLocation);

// Delete a location by object id
router.post('/deleteLocation/', deleteLocation);

///////////// SAVED SCORE

// Create a new saved score with data
router.post('/newSavedScore/', addSavedScore);

// Get all saved scores from an origin to a destination
router.get('/savedScores/:origin/:destination', showSavedScoresByLocations);

///////////// EMAIL CONFIRMATION

// Create a new email confirmation with data (controller will create code and send email)
router.post('/newEmailConfirmation/', addEmailConfirmation);

// Attempt to get confirmation data by email and code
router.post('/emailConfirmation/', getEmailConfirmation);

// Delete email confirmation by email and code
router.post('/removeEmailConfirmation/', removeEmailConfirmation);

///////////// PASSWORD RESET REQUEST

// Create a new password reset request for email
router.post('/newPasswordResetRequest/', addPasswordResetRequest);

// Attempt to get password reset data by user_id and code
router.post('/passwordResetRequest/', getPasswordResetRequest);

// Update password reset request by user_id, given new code
router.post('/updatePasswordResetRequest/', updatePasswordResetRequest);

// Delete password reset request by user_id and code
router.post('/removePasswordResetRequest/', removePasswordResetRequest);

export default router;
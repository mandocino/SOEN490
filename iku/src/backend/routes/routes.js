// import express
import express from "express";

// import functions from controllers
import {
    showUsers,
    showUserByID,
    showUserByEmail,
    loginController,
    signupController,
    modifyUserByID,
    modifyUserByEmail,
    deleteUserByEmail
} from "../controllers/user.js";
import {
    addLocation,
    getAddressByCoordinates,
    showLocationsByUserID,
    getSuggestions,
    getCoordinatesByAddress,
    updateLocation,
    deleteLocation
} from "../controllers/location.js";
import {addEmailConfirmation, getEmailConfirmation, removeEmailConfirmation} from "../controllers/emailConfirmation.js";
import {
    addPasswordResetRequest, getPasswordResetRequest, updatePasswordResetRequest, removePasswordResetRequest
} from "../controllers/passwordResetRequest.js";
import {
    addSavedScore,
    showSavedScoresByLocations,
    showSavedScoresByOrigin,
    deleteSavedScore,
    deleteSavedScoreByLocations,
    deleteSavedScoreByOrigin,
    editSavedScoreByLocations,
    editSavedScoreByOrigin
} from "../controllers/savedScore.js";
import {getAllRoutesOTP} from "../utils/openTripPlanner.js";
import {modifyGlobals, showGlobals} from "../controllers/global.js";
import {
    addSavedRoutingData,
    deleteSavedRoutingData,
    deleteSavedRoutingDataByLocations,
    editSavedRoutingDataByLocations,
    showSavedRoutingDataByLocations
} from "../controllers/savedRoutes.js";

// init express router
const router = express.Router();

// Routes

///////////// GLOBAL

// Get global data
router.get("/global/", showGlobals);

// Modify global data
router.post("/modifyGlobal/", modifyGlobals);

///////////// USER

// Get all data for all users
router.get("/users/", showUsers);

// Get data of a user by their ID
router.get("/userByID/:id", showUserByID);

// Get data for a user by their email
router.get("/userByEmail/:email", showUserByEmail);

// Attempt to get user data by login credentials
router.post("/login/", loginController);

// Create a new user with data
router.post("/signup/", signupController);

// Modify a user by email with data
router.post("/modifyUserByEmail/", modifyUserByEmail);

// Modify a user by email with ID
router.post("/modifyUserByID/", modifyUserByID);

// Delete a user by email
router.post("/deleteUser/", deleteUserByEmail);

///////////// LOCATION

// Create a new user location with data
router.post("/newlocation/", addLocation);

// Get all locations for given player ID
router.get("/locations/:id", showLocationsByUserID);

// Get address from coordinates
router.get("/address/", getAddressByCoordinates);

//Get places suggestion and autocomplete given user input
router.get("/suggestions/", getSuggestions);

//Get Coordinates of specified address
router.get("/coordinates/", getCoordinatesByAddress);

// Update location's data by object id
router.post("/updateLocation/", updateLocation);

// Delete a location by object id
router.post("/deleteLocation/", deleteLocation);

///////////// SAVED SCORE

// Create a new saved score with data
router.post('/newSavedScore/', addSavedScore);

// Get all saved scores from an origin to a destination
router.get('/savedScores/:origin/:destination', showSavedScoresByLocations);

// Get the overall saved score of an origin
router.get('/savedScores/:origin', showSavedScoresByOrigin);

// Delete a saved score by object id
router.post('/deleteSavedScore/', deleteSavedScore);

// Edit a saved score by origin and destination
router.post('/editSavedScore/:origin/:destination', editSavedScoreByLocations);

// Edit a saved score by origin only
router.post('/editSavedScore/:origin', editSavedScoreByOrigin);

// Delete a saved score by origin and destination
router.post('/deleteSavedScore/:origin/:destination', deleteSavedScoreByLocations);

// Delete a saved score by origin only
router.post('/deleteSavedScore/:origin', deleteSavedScoreByOrigin);

///////////// EMAIL CONFIRMATION

// Create a new email confirmation with data (controller will create code and send email)
router.post("/newEmailConfirmation/", addEmailConfirmation);

// Attempt to get confirmation data by email and code
router.post("/emailConfirmation/", getEmailConfirmation);

// Delete email confirmation by email and code
router.post("/removeEmailConfirmation/", removeEmailConfirmation);

///////////// PASSWORD RESET REQUEST

// Create a new password reset request for email
router.post("/newPasswordResetRequest/", addPasswordResetRequest);

// Attempt to get password reset data by user_id and code
router.post("/passwordResetRequest/", getPasswordResetRequest);

// Update password reset request by user_id, given new code
router.post("/updatePasswordResetRequest/", updatePasswordResetRequest);

// Delete password reset request by ID
router.post("/removePasswordResetRequest/", removePasswordResetRequest);

///////////// ROUTES & OPEN TRIP PLANNER

// Create a new set of routes score with data
router.post('/newRoutingData/', addSavedRoutingData);

// Get all routes from an origin to a destination, on a specific date
router.get('/savedRoutingData/:origin/:destination', showSavedRoutingDataByLocations);

// Delete a set of routes by object id
router.post('/deleteRoutingData/', deleteSavedRoutingData);

// Delete a set of routes by origin and destination
router.post('/deleteRoutingData/:origin/:destination', deleteSavedRoutingDataByLocations);

// Edit a set of routes by origin and destination, on a specific date
router.post('/editRoutingData/:origin/:destination', editSavedRoutingDataByLocations);

//METHOD CALLED IN FRONTEND FOR TESTING PURPOSES
router.get("/routesOTP/", getAllRoutesOTP);

export default router;

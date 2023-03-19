// import functions from controllers
const express = require('express')

const showUsers = require('../controllers/user.js')
const showUserByID = require('../controllers/user.js')
const showUserByEmail = require('../controllers/user.js')
const loginController = require('../controllers/user.js')
const signupController = require('../controllers/user.js')
const modifyUserByID = require('../controllers/user.js')
const modifyUserByEmail = require('../controllers/user.js')
const deleteUserByEmail = require('../controllers/user.js')

const addLocation = require('../controllers/location.js')
const getAddressByCoordinates = require('../controllers/location.js')
const showLocationsByUserID = require('../controllers/location.js')
const getSuggestions = require('../controllers/location.js')
const getCoordinatesByAddress = require('../controllers/location.js')
const updateLocation = require('../controllers/location.js')
const deleteLocation = require('../controllers/location.js')

const addEmailConfirmation = require('../controllers/emailConfirmation.js')
const getEmailConfirmation = require('../controllers/emailConfirmation.js')
const removeEmailConfirmation = require('../controllers/emailConfirmation.js')

const addPasswordResetRequest = require('../controllers/passwordResetRequest.js')
const getPasswordResetRequest = require('../controllers/passwordResetRequest.js')
const updatePasswordResetRequest = require('../controllers/passwordResetRequest.js')
const removePasswordResetRequest = require('../controllers/passwordResetRequest.js')

const addSavedScore = require('../controllers/savedScore.js')
const showSavedScoresByLocations = require('../controllers/savedScore.js')
const showSavedScoresByOrigin = require('../controllers/savedScore.js')
const deleteSavedScore = require('../controllers/savedScore.js')
const deleteSavedScoreByLocations = require('../controllers/savedScore.js')
const deleteSavedScoreByOrigin = require('../controllers/savedScore.js')
const editSavedScoreByLocations = require('../controllers/savedScore.js')
const editSavedScoreByOrigin = require('../controllers/savedScore.js')

const getAllRoutesOTP = require('../utils/openTripPlanner.js')

const modifyGlobals = require('../controllers/global.js')
const showGlobals = require('../controllers/global.js')

const addSavedRoutingData = require('../controllers/savedRoutes.js')
const deleteSavedRoutingData = require('../controllers/savedRoutes.js')
const deleteSavedRoutingDataByLocations = require('../controllers/savedRoutes.js')
const editSavedRoutingDataByLocations = require('../controllers/savedRoutes.js')
const showSavedRoutingDataByLocations = require('../controllers/savedRoutes.js')

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

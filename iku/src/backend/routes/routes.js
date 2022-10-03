// import express
import express from "express";

// import functions from controllers
import { showUsers, showUserByID, showUserByUserName } from "../controllers/user.js";

// init express router
const router = express.Router();

// Routes
router.get('/users/', showUsers);
router.get('/userByID/:id', showUserByID);
router.get('/userByUserName/:userName', showUserByUserName);

// export default router
export default router;
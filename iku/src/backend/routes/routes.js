// import express
import express from "express";

// import functions from controllers
 import { showUsers } from "../controllers/user.js";

// init express router
const router = express.Router();

// Routes
router.get('/users/', showUsers);

// export default router
export default router;
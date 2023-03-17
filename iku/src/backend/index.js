import * as dotenv from 'dotenv' 
dotenv.config()
// import express
import express from "express";
// import cors
import cors from "cors";
// import routes
import Router from "./routes/routes.js";

import {connectToServer} from "./config/db.js";

// init express
const app = express();
app.disable("x-powered-by");

// use express json
app.use(express.json());

// use cors
app.use(cors());

// use router
app.use(Router);

// Connect to DB
connectToServer();

app.listen(5000, () => console.log("Server running at http://localhost:5000"));

//module.exports = app;

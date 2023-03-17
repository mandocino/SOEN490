//import * as dotenv from 'dotenv' 
//dotenv.config()
// import express
//import express from "express";
// import cors
//import cors from "cors";
// import routes
//import Router from "./routes/routes.js";

//import {connectToServer} from "./config/db.js";
const express = require('express')

// init express
const app = express();
//app.disable("x-powered-by");

// use express json
// with payload limit as 10mb


// Connect to DB
//connectToServer();

app.listen(5000, () => console.log("Server running at http://localhost:5000"));

//app.use(express.json({limit: '10mb'}));

app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})

// use cors
//app.use(cors());

// use router
//app.use(Router);

//module.exports = app

// // index.js
// const express = require('express')

// const app = express()
// const PORT = 4000

// app.listen(PORT, () => {
//   console.log(`API listening on PORT ${PORT} `)
// })

// app.get('/', (req, res) => {
//   res.send('Hey this is my API running 🥳')
// })

// app.get('/about', (req, res) => {
//   res.send('This is my about route..... ')
// })

// // Export the Express API
module.exports = app
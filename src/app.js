//import database configuration
require("./config/db");
const express = require("express");
const bodyParser = express.json;
const cors = require("cors");

//create server app
const app = express();

//middlewares
app.use(cors());
app.use(bodyParser());

module.exports = app;

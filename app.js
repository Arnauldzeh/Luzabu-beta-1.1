//import database configuration
require("./src/config/db");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./src/routes");

//create server app
const app = express();

//middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/Beta_luzabu", routes);

module.exports = app;

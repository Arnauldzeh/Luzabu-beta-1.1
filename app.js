//import database configuration
require("./src/config/db");

const express = require("express");
const bodyParser = express.json;
const cors = require("cors");
const patientRoutes = require("./src/Routes/patient");
const doctorRoutes = require("./src/Routes/medecin");
const laboRoutes = require("./src/Routes/Laborantin");

//create server app
const app = express();

//middlewares
app.use(cors());
app.use(bodyParser());

app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/Labo", laboRoutes);

module.exports = app;

const express = require("express");
const router = express.Router();

const patientRoutes = require("../patient");

router.use("/patient", patientRoutes);

module.exports = router;

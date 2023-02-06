const express = require("express");
const router = express.Router();

const patientRoutes = require("../patient");
const adminRoutes = require("../admin");
const doctorRoutes = require("../medecin");

router.use("/patient", patientRoutes);
router.use("/admin", adminRoutes);
router.use("/doctor", doctorRoutes);

module.exports = router;

const express = require("express");
const router = express.Router();

const patientRoutes = require("../patient");
const medecinRoutes = require("../medecin");
const adminRoutes = require("../admin");

//Les différents chemins des utilisateurs
router.use("/patient", patientRoutes);
router.use("/medecin", medecinRoutes);
router.use("/admin", adminRoutes);

module.exports = router;

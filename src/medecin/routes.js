const express = require("express");
const router = express.Router();
const {
  authenticateMedecin,
  getProfile,
  getProfileMedicalPatient,
  newConsultation,
  newExamen,
  newOrdonnance,
  newResultatsLabo,
  newRadiologie,
  getAllConsultations,
} = require("./controller");

const { verifyToken } = require("../middleware/auth");

//Signin
router.post("/signin", authenticateMedecin);
//Consulter profile
router.get("/profile", verifyToken, getProfile);
//Consulter profile Medical
router.get("/profileMedical", verifyToken, getProfileMedicalPatient);
//Enregistrer consultation
router.post("/newConsultation", verifyToken, newConsultation);
//Enregistrer consultation
router.post("/getAllConsultations", verifyToken, getAllConsultations);
//Enregistrer Examen
router.post("/newExamen", verifyToken, newExamen);
//Enregistrer Ordonnance
router.post("/newOrdonnance", verifyToken, newOrdonnance);
//Enregistrer ResultatsLabo
router.post("/newResultatsLabo", verifyToken, newResultatsLabo);
//Enregistrer Radiologie
router.post("/newRadiologie", verifyToken, newRadiologie);
///
///
///

module.exports = router;

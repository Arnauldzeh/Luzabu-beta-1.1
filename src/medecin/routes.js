const express = require("express");
const router = express.Router();
const {
  authenticateMedecin,
  getMedecin,
  getPatient,
  updatePatient,
  editProfileMedecin,
} = require("./controller");

const { verifyToken } = require("../middleware/auth");

//Signin
router.post("/signin", authenticateMedecin);
//Consulter profile
router.get("/profile", verifyToken, getMedecin);
//Consulter profile
router.post("/editProfile", verifyToken, editProfileMedecin);

//Consulter profile Medical
router.get("/profileMedical", verifyToken, getPatient);

//Enregistrer consultation
router.post("/newConsultation", verifyToken, updatePatient);
//Enregistrer Examen
router.post("/newExamen", verifyToken, updatePatient);
//Enregistrer Ordonnance
router.post("/newOrdonnance", verifyToken, updatePatient);
//Enregistrer ResultatsLabo
router.post("/newResultatsLabo", verifyToken, updatePatient);
//Enregistrer Radiologie
router.post("/newRadiologie", verifyToken, updatePatient);

module.exports = router;

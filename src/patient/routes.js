const express = require("express");
const router = express.Router();
const {
  createNewPatient,
  authenticatePatient,
  getProfile,
  editProfile,
  getProfileMedical,
  createMedicalProfile,
  editMedicalProfile,
  getConsultation,
  getOneConsultation,
} = require("./controller");

const { verifyToken } = require("../middleware/auth");

//Signup route
router.post("/signup", createNewPatient);

//Signin
router.post("/signin", authenticatePatient);

//Signup route
router.post("/newmedicalProfile", verifyToken, createMedicalProfile);

//Consulter profile
router.get("/profile", verifyToken, getProfile);

//Consulter profile Medical
router.get("/getprofileMedical", verifyToken, getProfileMedical);

//Afficher toutes les consultations
router.get("/getConsultation", verifyToken, getConsultation);

//Afficher Une consultation
router.get("/getOneConsultation/:id", verifyToken, getOneConsultation);

// //Mettre à jour son profile
router.post("/editProfile", verifyToken, editProfile);
// //Mettre à jour son profile
router.post("/editMedicalProfile", verifyToken, editMedicalProfile);

module.exports = router;

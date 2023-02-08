const express = require("express");
const router = express.Router();
const {
  createNewPatient,
  authenticatePatient,
  getProfile,
  editProfile,
  getProfileMedical,
} = require("./controller");
// const { validateProfile } = require("../middleware/dataValidation");

const { verifyToken } = require("../middleware/auth");

//Signup route
router.post("/signup", createNewPatient);

//Signin
router.post("/signin", authenticatePatient);

//Consulter profile
router.get("/profile", verifyToken, getProfile);

//Consulter profile Medical
router.get("/profileMedical", verifyToken, getProfileMedical);

// //Mettre à jour son profile
router.post("/editProfile", verifyToken, editProfile);

module.exports = router;

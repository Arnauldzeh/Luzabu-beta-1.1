const express = require("express");
const router = express.Router();
const { signup, signin, getPatient, updatePatient } = require("./controller");
const { verifyToken } = require("../middleware/auth");
const { patientUpload } = require("../middleware/multer");

router.post("/signup", signup); //bon👍🏿

router.post("/signin", signin); //bon👍🏿

router.get("/getProfile", verifyToken, getPatient); //bon👍🏿

router.post("/newMedicalProfile", verifyToken, updatePatient);

router.post("/editProfile", verifyToken, updatePatient);

router.post("/editMedicalProfile", verifyToken, updatePatient);

router.get("/getProfileMedical", verifyToken, getPatient);

router.get("/getConsultation", verifyToken, getPatient);

router.get("/getOneConsultation", verifyToken, getPatient);

module.exports = router;

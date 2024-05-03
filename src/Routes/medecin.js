const express = require("express");
const router = express.Router();
const {
  signin,
  getMedecin,
  getPatient,
  updatePatient,
  updateMedecin,
  getAllDoctor,
} = require("../Controller/medecin");

const { verifyToken } = require("../middleware/auth");

// router.post("/signup", signup); //bon👍

router.post("/signin", signin);
router.get("/getMedecin", verifyToken, getMedecin);
router.put("/updateMedecin", verifyToken, updateMedecin);
router.get("/getPatient", verifyToken, getPatient);
router.put("/updatePatient", verifyToken, updatePatient);
router.get("/getAllDoctor", getAllDoctor);

module.exports = router;

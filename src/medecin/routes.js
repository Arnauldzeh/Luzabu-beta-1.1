const express = require("express");
const router = express.Router();
const {
  signin,
  getMedecin,
  getPatient,
  updatePatient,
  updateMedecin,
  getAllDoctor,
} = require("./controller");

const { verifyToken } = require("../middleware/auth");

// router.post("/signup", signup); //bon👍

router.post("/signin", signin); //bon👍

router.get("/getMedecin", verifyToken, getMedecin); //bon👍

router.put("/updateMedecin", verifyToken, updateMedecin); //bon👍

router.get("/getPatient", verifyToken, getPatient); //bon👍

router.put("/updatePatient", verifyToken, updatePatient); //bon👍

router.get("/getAllDoctor", getAllDoctor); //bon👍
module.exports = router;

const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  getPatient,
  updatePatient,
  getAllPatient,
} = require("./controller");
const { verifyToken } = require("../middleware/auth");
const { patientUpload } = require("../middleware/multer");

router.post("/signup", signup); //bon👍

router.post("/signin", signin); //bon👍

router.get("/getPatient", verifyToken, getPatient); //bon👍

router.put("/updatePatient", verifyToken, updatePatient); //bon👍

router.get("/getAllPatient", getAllPatient); //bon👍

module.exports = router;

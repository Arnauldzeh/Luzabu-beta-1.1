const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  getPatient,
  updatePatient,
  getAllPatient,
} = require("../Controller/patient");
const { verifyToken } = require("../middleware/auth");

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/getPatient", verifyToken, getPatient);
router.put("/updatePatient", verifyToken, updatePatient);
router.get("/getAllPatient", getAllPatient);

module.exports = router;

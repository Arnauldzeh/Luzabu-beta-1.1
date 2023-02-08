const express = require("express");
const router = express.Router();
const { authenticateMedecin,Sms, AccesCarnet } = require("./controller");

const { verifyToken } = require("../middleware/auth");

//Signin
router.post("/signin", authenticateMedecin);
router.post("/AccesCarnet", AccesCarnet);
router.get("/sms", Sms);

module.exports = router;

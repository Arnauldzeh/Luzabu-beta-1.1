const express = require("express");
const router = express.Router();
const { authenticateMedecin } = require("./controller");

const { verifyToken } = require("../middleware/auth");

//Signin
router.post("/signin", authenticateMedecin);
router.post("/AccesCarnet", AccesCarnet);
router.get("/sms", Sms);

module.exports = router;

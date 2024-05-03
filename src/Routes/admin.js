const express = require("express");
const router = express.Router();
const {
  NewcardId,
  bloquecardId,
  signupMedecin,
  newMatricule,
  bloqueMatricule,
  unblockMatricule,
  unblockcardId,
} = require("../Controller/admin");
const { doctorUpload } = require("../middleware/multer");

router.post("/NewcardId", NewcardId);
router.post("/blockcardId", bloquecardId);
router.post("/unblockcardId", unblockcardId);
router.post("/signupDoctor", signupMedecin);
router.post("/matricule", newMatricule);
router.post("/blockMatricule", bloqueMatricule);
router.post("/unblockMatricule", unblockMatricule);
module.exports = router;

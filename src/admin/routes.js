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

//Ajouter une nouvelle carte de santé
router.post("/NewcardId", NewcardId);
//bloquer un patient par l'Id de la carte de santé
router.post("/blockcardId", bloquecardId);
//débloquer un medecin par l'Id de la carte de santé
router.post("/unblockcardId", unblockcardId);

//Ajouter un nouveau medecin dans le systeme
router.post("/signupDoctor", signupMedecin);
//Ajouter un nouveau matricule medecin
router.post("/matricule", newMatricule);
//
//bloquer un medecin par l'Id de la carte de santé
router.post("/blockMatricule", bloqueMatricule);
//débloquer un medecin par l'Id de la carte de santé
router.post("/unblockMatricule", unblockMatricule);
module.exports = router;

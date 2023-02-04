const express = require("express");
const router = express.Router();
const {
  NewcardId,
  bloquecardId,
  NouveauMedecin,
  newMatricule,
} = require("./controller");

//Ajouter une nouvelle carte de santé
router.post("/NewcardId", NewcardId);
//bloquer un utilisateur(patient/medecin) par l'Id de la carte de santé
router.post("/bloquecardId", bloquecardId);

//Ajouter un nouveau medecin dans le systeme
router.post("/new_doctor", NouveauMedecin);
//Ajouter un nouveau matricule medecin
router.post("/matricule", newMatricule);

module.exports = router;

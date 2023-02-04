const express = require("express");
const router = express.Router();
const { createNewcardId, bloquecardId } = require("./controller");

//Ajouter une nouvelle carte de santé
router.post("/cardId", createNewcardId);
//bloquer un utilisateur(patient/medecin) par l'Id de la carte de santé
router.post("/bloquecardId", bloquecardId);

//Ajouter un nouveau medecin dans le systeme
router.post("/new_doctor", async (req, res) => {});

module.exports = router;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Identifiant Patients
const IdSchema = new Schema({
  idCarte: {
    type: String,
    required: true,
  },
  patientId: String,
  statutCarte: Boolean,
});

//Identifiants bloqué
idCarte bloquerSchema = new Schema({
  idCarte: String,
});

//Identifiant medeicn
const matriculeSchema = new Schema({
     matricule: String,
});




const Carte = mongoose.model("Cartes", IdSchema);
const Bloquer = mongoose.model("Bloquer", bloquerSchema);
const Matricule = mongoose.model("Matricules", matriculeSchema);

module.exports = { Carte, Bloquer, Matricule };

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
  matricule: String,
});




const Carte = mongoose.model("Cartes", IdSchema);
const bloquer = mongoose.model("Bloquer", bloquerSchema);
const Matricule = mongoose.model("Matricules", matriculeSchema);

module.exports = { Identifiant, bloquer, Matricule };

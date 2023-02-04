const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Identifiant Patients
const IdSchema = new Schema({
  cardId: {
    type: String,
  },
});

//Identifiants bloqué
const bloquerSchema = new Schema({
  cardId: {
    type: String,
  },
});

//matricule medecin
const matriculeSchema = new Schema({
  matricule: {
    type: String,
  },
});

const Identifiant = mongoose.model("Identifiants", IdSchema);
const bloquer = mongoose.model("patientBloqués", bloquerSchema);
const Matricule = mongoose.model("Matricules", matriculeSchema);

module.exports = { Identifiant, bloquer, Matricule };

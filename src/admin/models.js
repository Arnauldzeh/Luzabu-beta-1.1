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
//matricule bloqué
const bloquermatSchema = new Schema({
  matricule: {
    type: String,
  },
});

//schema code sms
const code = new Schema({
  code: String,
});

const Identifiant = mongoose.model("Identifiants", IdSchema);
const bloquer = mongoose.model("patientBloqués", bloquerSchema);
const bloquerMedecin = mongoose.model("medecinBloqués", bloquermatSchema);
const Matricule = mongoose.model("Matricules", matriculeSchema);
const codeSms = mongoose.model('code', code);

module.exports = { Identifiant, bloquer, Matricule, bloquerMedecin,codeSms };

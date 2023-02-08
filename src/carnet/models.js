const mongoose = require("mongoose");
const Patient = require("../patient/model");

const Schema = mongoose.Schema;

//Profile medical
const ProfilMedicalSchema = new Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `Patient`,
  },
  age: {
    type: String,
    default: "N/A",
  },
  taille: {
    type: String,
    default: "N/A",
  },
  poids: {
    type: String,
    default: "N/A",
  },
  groupSanguin: {
    type: String,
    default: "N/A",
  },
  allergies: [String],
  maladieChronique: [String],
  antecedentFamilliaux: [String],
  contactUrgent: [String],
});

//Consultations
const ConsultationSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  temperature: {
    type: String,
  },
  tensionArterielle: {
    type: String,
  },
  symptomes: {
    type: String,
  },
  remarques: {
    type: String,
  },
});

//Examens
const ExamenSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  provenance: {
    type: String,
    required: true,
  },
  typeExamen: {
    type: String,
    required: true,
  },
  symptomes: {
    type: String,
  },
  autre: {
    type: String,
  },

  nomMedecin: {
    type: String,
    required: true,
  },
});

//Ordonances
const OrdonnanceSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  medicaments: {
    nom: String,
    quantite: Number,
    posologie: String,
  },

  hopital: {
    type: String,
    required: true,
  },
  nomMedecin: {
    type: String,
    required: true,
  },
});

//ResultatsLabo
const ResultatsLaboSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  resultats: {
    type: String,
    required: true,
  },
  hopital: {
    type: String,
    required: true,
  },
  nomMedecin: {
    type: String,
    required: true,
  },
});

//Radiologie
const RadiologieSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },

  resultats: {
    type: String,
    required: true,
  },

  remarques: {
    type: String,
  },

  nomMedecin: {
    type: String,
    required: true,
  },
  laboratoire: {
    type: String,
    required: true,
  },
  hopital: {
    type: String,
  },
});

const ProfilMedical = mongoose.model("Profile Medical", ProfilMedicalSchema);
const Consultation = mongoose.model("Consultations", ConsultationSchema);
const Examen = mongoose.model("Examens", ExamenSchema);
const Ordonnance = mongoose.model("Ordonnances", OrdonnanceSchema);
const ResultatsLabo = mongoose.model("ResultatsLabos", ResultatsLaboSchema);
const Radiologie = mongoose.model("Radiologies", RadiologieSchema);

//CARNET
const CarnetSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  cardId: String,
  // consultation: Consultation,
  // examens: Examen,
  // resultatsLabo: ResultatsLabo,
  // ordonnance: Ordonnance,
  // radiologie: Radiologie,
  signatureMedecin: String,
});

const Carnet = mongoose.model("Carnets", CarnetSchema);

module.exports = {
  Carnet,
  ProfilMedical,
  Consultation,
  Examen,
  Ordonnance,
  ResultatsLabo,
  Radiologie,
};

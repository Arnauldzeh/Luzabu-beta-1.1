const mongoose = require("mongoose");
const Patient = require("../patient/model");
const Schema = mongoose.Schema;

//Profile medical
const ProfilMedicalSchema = new Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `Patient`,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  sex: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    required: true,
  },
  age: {
    type: String,
  },
  taille: {
    type: String,
  },
  poids: {
    type: String,
  },
  groupSanguin: {
    type: String,
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

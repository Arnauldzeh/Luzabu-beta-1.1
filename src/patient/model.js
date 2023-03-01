const mongoose = require("mongoose");
const {
  ProfilMedical,
  Consultation,
  Examen,
  Ordonnance,
  ResultatsLabo,
  Radiologie,
  Notification,
} = require("../carnet/models");
const Schema = mongoose.Schema;

const PatientSchema = new Schema({
  cardId: {
    type: String,
    required: true,
    unique: true,
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
  password: {
    type: String,
    required: true,
  },
  medicalProfile: {
    type: [ProfilMedical.schema],
    default: [],
  },
  consultations: {
    type: [Consultation.schema],
    default: [],
  },
  ordonnances: {
    type: [Ordonnance.schema],
    default: [],
  },
  examensGeneraux: {
    type: [Examen.schema],
    default: [],
  },
  examensLaboratoire: {
    type: [ResultatsLabo.schema],
    default: [],
  },
  radiologies: {
    type: [Radiologie.schema],
    default: [],
  },
  notification: {
    type: [Notification.schema],
    default: [],
  },
});

const Patient = mongoose.model("Patients", PatientSchema);

module.exports = { Patient };

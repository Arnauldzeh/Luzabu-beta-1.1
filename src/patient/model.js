const mongoose = require("mongoose");
const {
  PersonalInfos,
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
  userProfile: {
    type: PersonalInfos,
    required: true,
  },
  medicalProfile: {
    type: ProfilMedical,
    default: {},
  },
  consultations: {
    type: [Consultation.schema],
    default: [],
  },

  prescriptions: {
    type: [Ordonnance.schema],
    default: [],
  },
  examinations: {
    type: [Examen.schema],
    default: [],
  },
  labResults: {
    type: [ResultatsLabo.schema],
    default: [],
  },
  radiologies: {
    type: [Radiologie.schema],
    default: [],
  },
  notifications: {
    type: [Notification.schema],
    default: [],
  },
});

const Patient = mongoose.model("Patients", PatientSchema);

module.exports = { Patient };

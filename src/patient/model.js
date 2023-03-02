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

  PersonalInfos: {
    type: PersonalInfos,
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

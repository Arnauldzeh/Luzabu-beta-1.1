const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Informations Médecin
const medecinSchema = new Schema({
  matricule: {
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
  },
  birthdate: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: String,
    required: true,
  },
  generalist: {
    type: String,
    required: true,
  },
  specialist: {
    type: String,
    required: true,
  },

  schoolCertificate: {
    type: String,
    required: true,
  },
  privateAutorisation: {
    type: String,
    required: true,
  },
  hopitalName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Medecin = mongoose.model("Medecins", medecinSchema);

module.exports = { Medecin };

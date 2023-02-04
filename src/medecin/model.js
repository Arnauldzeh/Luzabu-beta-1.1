const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MedecinSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  matricule: {
    type: String,
    required: true,
    unique: true,
  },
   phoneNumber: {
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
    birthdate: {
    type: String,
    required: true,
  };,
    spacility: {
    type: String,
    required: true,
  },
    autorisation: {
    type: String,
    required: true,
  }
});

const Medecin = mongoose.model("Medecins", MedecinSchema);

module.exports = { Medecin };

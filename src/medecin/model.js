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
    type: Date,
    required: true,
  },
  birthPlace: {
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
  city: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },

  certificate: [
    {
      type: String,
      required: true,
    },
  ],
  hopitalName: {
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
  registrationDate: {
    type: Date,
    required: true,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
});

const Medecin = mongoose.model("Medecins", medecinSchema);

module.exports = { Medecin };

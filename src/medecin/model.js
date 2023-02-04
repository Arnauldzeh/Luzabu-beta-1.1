const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Identifiant Médecin
const IdSchema = new Schema({
  matricule: {
    type: String,
    required: true,
  },
  motdepasse: {
    type: String,
  },
  nom_Med: {
    type: String,
    required: true,
    minlength: 3,
  },
  prenom_med: {
    type: String,
    required: true,
  },
  date_naissance_Med: {
    type: String,
    required: true,
  },
  sexe_Med: {
    type: String,
    required: true,
  },
  nationality_Med: {
    type: String,
    required: true,
  },
  password_Med: {
    type: String,
    required: true,
  },
  telephone_Med: {
    type: String,
    required: true,
  },
  generaliste: {
    type: String,
    required: true,
  },
  specialiste: {
    type: String,
    required: true,
  },

  certificat_Etude: {
    type: String,
    required: true,
  },
  autorisation_privee: {
    type: String,
    required: true,
  },
  nom_hopital: {
    type: String,
  },
});

const Medecin = mongoose.model("Medecins", IdSchema);

module.exports = { Medecin };

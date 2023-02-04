const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Identifiants Admin
const IdSchema = new Schema({
  lastName: {
    type: String,
    required : true
  },
  firstName: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
});

//Identifiants bloqué
const bloquerSchema = new Schema({
  cardId: {
    type: String,
  },
  matricule:{
    type: String,
  },
});

const Administrateurs = mongoose.model("Administrateurs", IdSchema);
const bloquer = mongoose.model("Bloques", bloquerSchema);

module.exports = { Identifiant, bloquer };

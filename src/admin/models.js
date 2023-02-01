const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Identifiant Patients
const IdSchema = new Schema({
  cardId: {
    type: String,
  },
});

const Identifiant = mongoose.model("Identifiants", IdSchema);

//admin
const admin = new Schema({
  firstName: {},
  lastName: {},
  email: {},
  password: {},
});

module.exports = { Identifiant };

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LaborantinSchema = new Schema({
  name: String,
  email: String,
  password: String,
});

const Laborantin = mongoose.model("Laborantin", LaborantinSchema);

module.exports = Laborantin;

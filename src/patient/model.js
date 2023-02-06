const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PatientSchema = new Schema({
  idCarte: {
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
    // match:r,
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
});

const Patient = mongoose.model("Patients", PatientSchema);

module.exports = { Patient };

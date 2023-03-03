const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const statisticSchema = new Schema({
  Patients: { type: Number, required: true },
  Doctors: { type: Number, required: true },
  totalConsultations: { type: Number, required: true },
});

const Statistics = mongoose.model("Statistics", statisticSchema);

module.exports = { Statistics };

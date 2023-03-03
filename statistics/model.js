const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const statisticSchema = new Schema({
  totalPatients: { type: Number, required: true },
  totalDoctors: { type: Number, required: true },
  // totalPatientsByNationality: [{ type: String, required: true }],
});

const Statistics = mongoose.model("Statistics", statisticSchema);

module.exports = { Statistics };

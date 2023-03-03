const { Patient } = require("../src/patient/model");
const { Medecin } = require("../src/medecin/model");

const { Statistics } = require("./model");

async function generateStats() {
  try {
    const Patients = await Patient.countDocuments();
    const Doctors = await Medecin.countDocuments();
    // const totalConsultations = await Patient.consultations.countDocuments();

    const updatedStats = await Statistics.findOneAndUpdate(
      {},
      { Patients, Doctors },
      { upsert: true, new: true }
    );

    console.log("Statistiques mises à jour avec succès");
  } catch (err) {
    console.error(err);
  }
}

//Exporter les fonctions
module.exports = {
  generateStats,
};
// planifier la fonction pour s'exécuter toutes les 24 heures
// cron.schedule("0 0 * * *", generateStats);
//toutes les 2 mins
// cron.schedule("*/2 * * * *", generateStats);

///
// const mongoose = require("mongoose");
// const Patient = require("./models/Patient");
// const Statistic = require("./models/Statistic");

// mongoose.connect("mongodb://localhost/your-database-name", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const generateStatistics = async () => {
//   const totalPatients = await Patient.countDocuments();
//   const totalDoctors = await Doctor.countDocuments();
//   const consultationsPerDay = await Consultation.aggregate([
//     {
//       $group: {
//         _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
//         count: { $sum: 1 },
//       },
//     },
//   ]);
//   const patientsByAge = await Patient.aggregate([
//     {
//       $group: {
//         _id: {
//           $switch: {
//             branches: [
//               { case: { $lte: ["$age", 18] }, then: "0-18 ans" },
//               {
//                 case: { $and: [{ $gt: ["$age", 18] }, { $lte: ["$age", 30] }] },
//                 then: "18-30 ans",
//               },
//               {
//                 case: { $and: [{ $gt: ["$age", 30] }, { $lte: ["$age", 50] }] },
//                 then: "30-50 ans",
//               },
//               { case: { $gt: ["$age", 50] }, then: "50+ ans" },
//             ],
//             default: "Unknown",
//           },
//         },
//         count: { $sum: 1 },
//       },
//     },
//   ]);
//   const patientsBySex = await Patient.aggregate([
//     { $group: { _id: "$sex", count: { $sum: 1 } } },
//   ]);
//   const patientsByNationality = await Patient.aggregate([
//     { $group: { _id: "$nationality", count: { $sum: 1 } } },
//   ]);
//   const consultationsByDoctor = await Consultation.aggregate([
//     { $group: { _id: "$doctorId", count: { $sum: 1 } } },
//   ]);

//   const statistics = new Statistic({
//     totalPatients,
//     totalDoctors,
//     consultationsPerDay,
//     patientsByAge,
//     patientsBySex,
//     patientsByNationality,
//     consultationsByDoctor,
//   });

//   await statistics.save();
//   console.log("Statistics generated successfully!");
//   mongoose.connection.close();
// };

// generateStatistics();

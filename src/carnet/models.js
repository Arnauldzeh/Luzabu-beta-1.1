const mongoose = require("mongoose");
const Patient = require("../patient/model");

const Schema = mongoose.Schema;

//Profile medical
const ProfilMedicalSchema = new Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `Patient`,
  },
  age: {
    type: String,
    default: "N/A",
  },
  height: {
    type: String,
    default: "N/A",
  },
  weight: {
    type: String,
    default: "N/A",
  },
  bloodGroup: {
    type: String,
    default: "N/A",
  },

  allergies: [
    {
      type: { type: String },
      manifestation: { type: String },
    },
  ],
  chronicIllnesses: [String],
  familyHistories: [String],
  emergencyContacts: [
    {
      name: {
        type: String,
        default: "N/A",
      },
      telephone: {
        type: String,
        default: "N/A",
      },
      profession: {
        type: String,
        default: "N/A",
      },
      sex: {
        type: String,
        default: "N/A",
      },
      address: {
        type: String,
        default: "N/A",
      },
      link: {
        type: String,
        default: "N/A",
      },
    },
  ],
});

// Consultations
const ConsultationSchema = new Schema({
  patientCardId: {
    type: String,
  },
  doctorName: {
    type: String,
  },
  time: {
    type: String,
  },
  date: {
    type: String,
  },
  age: {
    type: String,
  },
  reasonForConsultation: {
    type: String,
  },
  height: {
    type: String,
  },
  temperature: {
    type: String,
  },
  bloodPressure: {
    type: String,
  },
  weight: {
    type: String,
  },
  pulse: {
    type: String,
  },
  oxygenSaturation: {
    type: String,
  },
  symptoms: {
    type: [String],
  },
  comments: {
    type: [String],
  },
  diagnosis: {
    type: [String],
  },
  remarks: {
    type: [String],
  },
});

//Examens
const ExamenSchema = new Schema({
  idconsulation: {
    type: String,
  },
  nomMedecin: {
    type: String,
  },
  heure: {
    type: String,
  },
  date: {
    type: String,
  },
  patientCardId: {
    type: String,
  },
  nom: {
    type: String,
    required: true,
  },
  consigne: {
    type: String,
    required: true,
  },
  // Autres champs nécessaires
});

//Ordonances
const OrdonnanceSchema = new Schema({
  nomMedecin: {
    type: String,
  },
  heure: {
    type: String,
  },
  date: {
    type: String,
  },
  patientCardId: {
    type: String,
  },
  medicaments: [
    {
      nom: {
        type: String,
        required: true,
      },
      famille: {
        type: String,
        required: true,
      },
      forme: {
        type: String,
        required: true,
      },
      quantité: {
        type: String,
        required: true,
      },
      posologie: {
        type: String,
        required: true,
      },
      observation: {
        type: String,
        required: true,
      },
    },
  ],
});

//ResultatsLabo
const ResultatsLaboSchema = new Schema({
  nomMedecin: {
    type: String,
  },
  heure: {
    type: String,
  },
  date: {
    type: String,
  },
  patientCardId: {
    type: String,
  },
  examenLabo: [
    {
      typeDeTeste: {
        type: String,
        required: true,
      },
      resultats: {
        type: String,
        required: true,
      },
      nomDuLabo: {
        type: String,
        required: true,
      },
      remarques: {
        type: String,
        required: true,
      },
    },
  ],

  hopital: {
    type: String,
    required: true,
  },
});

//Radiologie
const RadiologieSchema = new Schema({
  nomMedecin: {
    type: String,
  },
  heure: {
    type: String,
  },
  date: {
    type: String,
  },
  patientCardId: {
    type: String,
  },

  radiologie: [
    {
      nom: {
        type: String,
        required: true,
      },
      resultats: {
        type: String,
        required: true,
      },
      nomDuLabo: {
        type: String,
        required: true,
      },
      remarques: {
        type: String,
        required: true,
      },
    },
  ],
  hopital: {
    type: String,
  },
});

const ProfilMedical = mongoose.model("Profile Medicals", ProfilMedicalSchema);
const Consultation = mongoose.model("Consultations", ConsultationSchema);
const Examen = mongoose.model("Examens", ExamenSchema);
const Ordonnance = mongoose.model("Ordonnances", OrdonnanceSchema);
const ResultatsLabo = mongoose.model("ResultatsLabos", ResultatsLaboSchema);
const Radiologie = mongoose.model("Radiologies", RadiologieSchema);

module.exports = {
  ProfilMedical,
  Consultation,
  Examen,
  Ordonnance,
  ResultatsLabo,
  Radiologie,
};

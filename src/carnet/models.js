const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Information Personnel
const PersonalInfosSchema = new Schema({
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

//Profile medical
const ProfilMedicalSchema = new Schema({
  height: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  bloodGroup: {
    type: String,
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
      },
      phoneNumber: {
        type: String,
      },
      profession: {
        type: String,
      },
      sex: {
        type: String,
      },
      address: {
        type: String,
      },
      link: {
        type: String,
      },
    },
  ],
});

// Consultations
const ConsultationSchema = new Schema({
  doctorMatricule: {
    type: String,
  },
  doctorName: {
    type: String,
  },

  date: {
    type: Date,
    required: true,
    default: Date.now,
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
//Notification
const NotificationSchema = new Schema({
  doctorMatricule: {
    type: String,
  },
  nomMedecin: {
    type: String,
  },
  patientCardId: {
    type: String,
  },
  date: {
    type: String,
  },
  activity: {
    type: String,
  },
});

const PersonalInfos = PersonalInfosSchema;
const ProfilMedical = ProfilMedicalSchema;
const Consultation = ConsultationSchema;
const Examen = ExamenSchema;
const Ordonnance = OrdonnanceSchema;
const ResultatsLabo = ResultatsLaboSchema;
const Radiologie = RadiologieSchema;
const Notification = NotificationSchema;

module.exports = {
  PersonalInfos,
  ProfilMedical,
  Consultation,
  Examen,
  Ordonnance,
  ResultatsLabo,
  Radiologie,
  Notification,
};

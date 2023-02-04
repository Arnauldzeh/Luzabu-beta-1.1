onst mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Consultation = Schema({
    temperature: String,
    tensionArterielle: String,
    symptomes: String,
    remarques: String,
    date: Date.now()
});

const Examen = Schema({
    provenance: {
        type: String,
        required: true
    },
    typeExamen: {
        type: String,
        required: true
    },
    symptomes: String,
    autre: String,
    nomMedecin: {
        type: String,
        required: true
    },
    date: Date.now(),
});

const Ordonnance = Schema({
    medicaments: {
        nom: String,
        quantite: Number,
        posologie: String,
    },
    date: Date.now(),
    hopital: {
        type: String,
        required: true
    },
    nomMedecin: {
        type: String,
        required: true
    },
});

const ResultatsLabo = Schema({
    resultats: {
        type: String,
        required: true
    },
    hopital: S{
        type: String,
        required: true
    },
    nomMedecin: {
        type: String,
        required: true
    },
    date: Date.now(),
});

const Radiologie = Schema({
    resultats: {
        type: String,
        required: true
    },
    remarques: String,
    nomMedecin: {
        type: String,
        required: true
    },
    laboratoire: {
        type: String,
        required: true
    },
    hopital: String,
    date: Date.now(),
});

const Carnet = new Schema({
    date: Date.now(),
    idCarnet: ObjectId,
    consultation: Consultation,
    examens: Examen,
    resultatsLabo: ResultatsLabo,
    ordonnance: Ordonnance,
    radiologie: Radiologie,
    signatureMedecin: String,
});

const Carnet = mongoose.model("Carnets", Carnet);

module.exports = { Carnet };

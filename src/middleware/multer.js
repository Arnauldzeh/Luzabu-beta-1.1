const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Définition du dossier de stockage pour les patients
const patientStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images/patients");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

// Définition du dossier de stockage pour les médecins
const doctorStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images/doctors");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

// Middleware multer pour les fichiers des patients
const patientUpload = multer({ storage: patientStorage }).single("image");

// Middleware multer pour les fichiers des médecins
const doctorUpload = multer({ storage: doctorStorage }).single("image");

module.exports = { patientUpload, doctorUpload };

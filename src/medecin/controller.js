const { Medecin } = require("./model");
const { bloquerMedecin } = require("../admin/models");
const { cryptage, verifyHashedData } = require("../services/cryptage");
const { createToken } = require("../services/creerToken");
const jwt = require("jsonwebtoken");
//
const { Patient } = require("../patient/model");
const {
  ProfilMedical,
  Consultation,
  Examen,
  Ordonnance,
  ResultatsLabo,
  Radiologie,
} = require("../carnet/models");
const { bloquer } = require("../admin/models");

//

//
//signin
const authenticateMedecin = async (req, res) => {
  try {
    let { matricule, password } = req.body;
    const fetchedMedecin = await Medecin.findOne({ matricule });
    const isBlockedmatricule = await bloquerMedecin.findOne({ matricule });

    if (isBlockedmatricule) {
      return res.status(401).json({
        message: "Access denied due to some reasons!!",
      });
    } else if (!fetchedMedecin) {
      return res.status(400).json({ message: "Invalid matricule" });
    } else {
      const hashedPassword = fetchedMedecin.password;
      const passwordMatch = await verifyHashedData(password, hashedPassword);
      if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }
      //generation du token en utilisant le matricule et l'identifiant de la bd
      const tokenData = {
        matricule: fetchedMedecin.matricule,
        medecinId: fetchedMedecin._id,
      };
      const token = await createToken(tokenData);

      return res.status(200).json({
        token,
        message: "User login successfully",
      });
    }
  } catch (error) {
    return res.status(401).send({ error: "An error occured" });
  }
};

//Afficher profile
const getProfile = async (req, res) => {
  try {
    //vérification de l'identité du médecin par son matricule entré
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
      return res.status(401).send("Authentication token is required!!");
    }
    //decodage du token pour récuperer le matricule ou l'_Id
    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
    const medecin = await Medecin.findOne({
      matricule: decodedToken.matricule,
    });

    // const medecin = await Medecin.findById(
    //   decodedToken.matricule
    //   //_id: decodedToken.medecinId,
    // );

    if (!medecin) {
      return res.status(404).send("No Doctor found!!");
    } else {
      return res.status(200).json({
        matricule: medecin.matricule,
        firstName: medecin.firstName,
        lastName: medecin.lastName,
        email: medecin.email,
        birthdate: medecin.birthdate,
        sex: medecin.sex,
        nationality: medecin.nationality,
        phoneNumber: medecin.phoneNumber,
        generalist: medecin.generalist,
        specialist: medecin.specialist,
        schoolCertificate: medecin.schoolCertificate,
        privateAutorisation: medecin.privateAutorisation,
        hopitalName: medecin.hopitalName,
      });
    }
  } catch (error) {
    return res.status(401).send({ error: "An error occured" });
  }
};
// Afficher le profil médical d'un patient
const getProfileMedicalPatient = async (req, res) => {
  try {
    const { cardId } = req.body;
    const fetchedPatient = await Patient.findOne({ cardId });
    const isBlockedCardId = await bloquer.findOne({ cardId });

    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
      return res.status(401).send("Authentication token is required!!");
    }

    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
    const medecin = await Medecin.findOne({
      matricule: decodedToken.matricule,
    });

    //

    if (!medecin) {
      return res.status(404).send("No Doctor found!!");
    } else {
      if (!fetchedPatient) {
        console.log("Returning error: No Patient found!!");
        return res.status(404).json({ error: "No Patient found!!" });
      } else if (isBlockedCardId) {
        console.log("Returning error: This account has been suspended!!");
        return res
          .status(400)
          .json({ error: "This account has been suspended!!" });
      } else {
        const profileMedical = await ProfilMedical.findOne({
          patientId: fetchedPatient._id,
        });

        if (!profileMedical) {
          console.log("Returning error: No medical profile found!!");
          return res.status(404).send("No medical profile found!!");
        }

        return res.status(200).json({
          firstName: fetchedPatient.firstName,
          lastName: fetchedPatient.lastName,
          birthdate: fetchedPatient.birthdate,
          sex: fetchedPatient.sex,
          profession: fetchedPatient.profession,
          age: profileMedical.age,
          height: profileMedical.height,
          weight: profileMedical.weight,
          bloodGroup: profileMedical.bloodGroup,
          allergies: profileMedical.allergies,
          chronicIllnesses: profileMedical.chronicIllnesses,
          familyHistories: profileMedical.familyHistories,
          emergencyContacts: profileMedical.emergencyContacts,
        });
      }
    }
  } catch (error) {
    console.error("Caught error:", error);
    return res.status(401).send({ error: "An error occured" });
  }
};

//////////////////////////////////////////*****SMS*****/////////////////////////////////////////////////////

//Consultations

// Définir la fonction de contrôleur pour enregistrer une consultation
const newConsultation = async (req, res) => {
  try {
    // Récupérer les données de consultation à partir du corps de la requête
    let {
      patientCardId,

      time,
      date,
      age,
      reasonForConsultation,
      height,
      temperature,
      bloodPressure,
      weight,
      pulse,
      oxygenSaturation,
      symptoms,
      comments,
      diagnosis,
      remarks,
    } = req.body;

    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
      return res.status(401).send("Authentication token is required!!");
    }

    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);

    // Récupérer le médecin connecté à partir de la session utilisateur
    const medecin = await Medecin.findOne({
      matricule: decodedToken.matricule,
    });

    // Concaténer le prénom et le nom du médecin pour obtenir le nom complet
    const doctorName = `Dr. ${medecin.firstName} ${medecin.lastName}`;
    //
    doctorMatricule = medecin.matricule;
    // Obtenir l'heure et la date actuelles
    date = new Date().toLocaleDateString();
    time = new Date().toLocaleTimeString();
    // Créer une nouvelle instance de consultation à partir des données de la requête
    const nouvelleConsultation = new Consultation({
      patientCardId,
      doctorMatricule,
      doctorName,
      time,
      date,
      age,
      reasonForConsultation,
      height,
      temperature,
      bloodPressure,
      weight,
      pulse,
      oxygenSaturation,
      symptoms,
      comments,
      diagnosis,
      remarks,
    });

    // Enregistrer la nouvelle consultation dans la base de données
    await nouvelleConsultation.save();

    // Répondre avec un message de succès
    res
      .status(200)
      .json({ message: "La consultation a été enregistrée avec succès." });
  } catch (error) {
    // Gérer les erreurs et renvoyer une réponse d'erreur appropriée
    console.error(error);
    res.status(500).json({
      error:
        "Une erreur est survenue lors de l'enregistrement de la consultation.",
    });
  }
};

//Afficher toutes les consultations effectué par un medecin

//Afficher toutes les consultations
const getAllConsultations = async (req, res) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["authorization"];
    if (!token) {
      return res.status(401).send("Authentication token is required!!");
    }
    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
    // Récupérer le médecin connecté à partir de la session utilisateur
    const medecin = await Medecin.findOne({
      matricule: decodedToken.matricule,
    });

    if (!medecin) {
      return res.status(404).send("No user found!!");
    }

    const consultations = await Consultation.find({
      doctorMatricule: decodedToken.matricule,
    }); // Ajout de .toArray() pour obtenir un tableau de consultations

    if (!consultations) {
      return res.status(404).send("No consultation found!!");
    }

    const consultationsData = consultations.map((consultation) => ({
      // id: consultation._id,
      // time: consultation.time,
      // date: consultation.date,
      // doctorName: consultation.doctorName,
      consultation,
    }));

    return res.status(200).json(consultationsData);
  } catch (error) {
    console.error("Caught error:", error);
    return res.status(401).send("An error occured, try again");
  }
};

//examens

// Définir la fonction de contrôleur pour enregistrer un examen
const newExamen = async (req, res) => {
  try {
    // Récupérer les données de l'examen à partir du corps de la requête
    const { patientCardId, nom, consigne } = req.body;

    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
      return res.status(401).send("Authentication token is required!!");
    }

    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);

    // Récupérer le médecin connecté à partir de la session utilisateur
    const medecin = await Medecin.findOne({
      matricule: decodedToken.matricule,
    });

    // Concaténer le prénom et le nom du médecin pour obtenir le nom complet
    const nomMedecin = `Dr. ${medecin.firstName} ${medecin.lastName}`;

    // Créer une nouvelle instance d'examen à partir des données de la requête
    const nouvelExamen = new Examen({
      patientCardId,
      nomMedecin,
      heure: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      examen: { nom, consigne },
    });

    // Enregistrer le nouvel examen dans la base de données
    await nouvelExamen.save();

    // Répondre avec un message de succès
    res.status(200).json({ message: "L'examen a été enregistré avec succès." });
  } catch (error) {
    // Gérer les erreurs et renvoyer une réponse d'erreur appropriée
    console.error(error);
    res.status(500).json({
      error: "Une erreur est survenue lors de l'enregistrement de l'examen.",
    });
  }
};

//ordonnance
// Définir la fonction de contrôleur pour enregistrer une ordonnance
const newOrdonnance = async (req, res) => {
  try {
    // Récupérer les données de l'ordonnance à partir du corps de la requête
    const {
      heure,
      date,
      patientCardId,
      nom,
      famille,
      forme,
      quantité,
      posologie,
      observation,
    } = req.body;

    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
      return res.status(401).send("Authentication token is required!!");
    }

    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);

    // Récupérer le médecin connecté à partir de la session utilisateur
    const medecin = await Medecin.findOne({
      matricule: decodedToken.matricule,
    });

    // Ajouter l'initial "Dr." devant le nom du médecin
    const nomMedecin = `Dr. ${medecin.firstName} ${medecin.lastName}`;

    // Créer une nouvelle instance d'ordonnance à partir des données de la requête
    const nouvelleOrdonnance = new Ordonnance({
      nomMedecin,
      heure,
      date,
      patientCardId,
      medicaments: {
        nom,
        famille,
        forme,
        quantité,
        posologie,
        observation,
      },
    });

    // Enregistrer la nouvelle ordonnance dans la base de données
    await nouvelleOrdonnance.save();

    // Répondre avec un message de succès
    res
      .status(200)
      .json({ message: "L'ordonnance a été enregistrée avec succès." });
  } catch (error) {
    // Gérer les erreurs et renvoyer une réponse d'erreur appropriée
    console.error(error);
    res.status(500).json({
      error:
        "Une erreur est survenue lors de l'enregistrement de l'ordonnance.",
    });
  }
};
//ResultatLabo
// Définir la fonction de contrôleur pour enregistrer une ordonnance
const newResultatsLabo = async (req, res) => {
  try {
    // Récupérer les données de l'ordonnance à partir du corps de la requête
    const {
      heure,
      date,
      patientCardId,
      typeDeTeste,
      resultats,
      nomDuLabo,
      remarques,
    } = req.body;

    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
      return res.status(401).send("Authentication token is required!!");
    }

    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);

    // Récupérer le médecin connecté à partir de la session utilisateur
    const medecin = await Medecin.findOne({
      matricule: decodedToken.matricule,
    });

    // Ajouter l'initial "Dr." devant le nom du médecin
    const nomMedecin = `Dr. ${medecin.firstName} ${medecin.lastName}`;

    // Créer une nouvelle instance d'ordonnance à partir des données de la requête
    const nouveauResultatsLabo = new ResultatsLabo({
      nomMedecin,
      heure,
      date,
      patientCardId,
      examenLabo: {
        typeDeTeste,
        resultats,
        nomDuLabo,
        remarques,
      },
    });

    // Enregistrer la nouvelle ordonnance dans la base de données
    await nouveauResultatsLabo.save();

    // Répondre avec un message de succès
    res
      .status(200)
      .json({ message: "L'ordonnance a été enregistrée avec succès." });
  } catch (error) {
    // Gérer les erreurs et renvoyer une réponse d'erreur appropriée
    console.error(error);
    res.status(500).json({
      error:
        "Une erreur est survenue lors de l'enregistrement de l'ordonnance.",
    });
  }
};
//Radiologie
// Définir la fonction de contrôleur pour enregistrer une ordonnance
const newRadiologie = async (req, res) => {
  try {
    // Récupérer les données de l'ordonnance à partir du corps de la requête
    const { heure, date, patientCardId, nom, resultats, nomDuLabo, remarques } =
      req.body;

    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
      return res.status(401).send("Authentication token is required!!");
    }

    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);

    // Récupérer le médecin connecté à partir de la session utilisateur
    const medecin = await Medecin.findOne({
      matricule: decodedToken.matricule,
    });

    // Ajouter l'initial "Dr." devant le nom du médecin
    const nomMedecin = `Dr. ${medecin.firstName} ${medecin.lastName}`;

    // Créer une nouvelle instance d'ordonnance à partir des données de la requête
    const nouvelleRadiologie = new Radiologie({
      nomMedecin,
      heure,
      date,
      patientCardId,
      radiologie: {
        nom,
        resultats,
        nomDuLabo,
        remarques,
      },
    });

    // Enregistrer la nouvelle ordonnance dans la base de données
    await nouvelleRadiologie.save();

    // Répondre avec un message de succès
    res
      .status(200)
      .json({ message: "L'ordonnance a été enregistrée avec succès." });
  } catch (error) {
    // Gérer les erreurs et renvoyer une réponse d'erreur appropriée
    console.error(error);
    res.status(500).json({
      error:
        "Une erreur est survenue lors de l'enregistrement de l'ordonnance.",
    });
  }
};
// Afficher le profil médical d'un patient
const getConsultation = async (req, res) => {
  try {
    const { cardId } = req.body;
    const fetchedPatient = await Patient.findOne({ cardId });
    const isBlockedCardId = await bloquer.findOne({ cardId });

    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
      return res.status(401).send("Authentication token is required!!");
    }

    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
    const medecin = await Medecin.findOne({
      matricule: decodedToken.matricule,
    });

    //

    if (!medecin) {
      return res.status(404).send("No Doctor found!!");
    } else {
      if (!fetchedPatient) {
        console.log("Returning error: No Patient found!!");
        return res.status(404).json({ error: "No Patient found!!" });
      } else if (isBlockedCardId) {
        console.log("Returning error: This account has been suspended!!");
        return res
          .status(400)
          .json({ error: "This account has been suspended!!" });
      } else {
        const profileMedical = await ProfilMedical.findOne({
          patientId: fetchedPatient._id,
        });

        if (!profileMedical) {
          console.log("Returning error: No medical profile found!!");
          return res.status(404).send("No medical profile found!!");
        }

        return res.status(200).json({
          firstName: fetchedPatient.firstName,
          lastName: fetchedPatient.lastName,
          birthdate: fetchedPatient.birthdate,
          sex: fetchedPatient.sex,
          profession: fetchedPatient.profession,
          age: profileMedical.age,
          height: profileMedical.height,
          weight: profileMedical.weight,
          bloodGroup: profileMedical.bloodGroup,
          allergies: profileMedical.allergies,
          chronicIllnesses: profileMedical.chronicIllnesses,
          familyHistories: profileMedical.familyHistories,
          emergencyContacts: profileMedical.emergencyContacts,
        });
      }
    }
  } catch (error) {
    console.error("Caught error:", error);
    return res.status(401).send({ error: "An error occured" });
  }
};

module.exports = {
  authenticateMedecin,
  getProfile,
  getProfileMedicalPatient,
  newConsultation,
  newExamen,
  newOrdonnance,
  newResultatsLabo,
  newRadiologie,
  getAllConsultations,
};

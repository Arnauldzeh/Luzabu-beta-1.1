const { Medecin } = require("./model");
const { bloquerMedecin } = require("../admin/models");
const { cryptage, verifyHashedData } = require("../services/cryptage");
const { createToken } = require("../services/creerToken");
const jwt = require("jsonwebtoken");
//
const { Patient } = require("../patient/model");
const { ProfilMedical } = require("../carnet/models");
const { bloquer } = require("../admin/models");

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

//Afficher son profile
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

//Mettre à jour le profile patient
const editProfile = async (req, res) => {
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

    if (!medecin) {
      return res.status(404).json({ error: "User not found!!" });
    }

    let {
      firstName,
      lastName,
      email,
      birthdate,
      birthPlace,
      sex,
      nationality,
      phoneNumber,
      city,
      qualification,
      certificate,
      hopitalName,
      profilePicture,
      password,
    } = req.body;

    if (firstName) {
      medecin.firstName = firstName.trim();
    }
    if (lastName) {
      medecin.lastName = lastName.trim();
    }
    if (email) {
      medecin.email = email.trim();
    }
    if (birthdate) {
      medecin.birthdate = birthdate.trim();
    }
    if (birthPlace) {
      medecin.birthPlace = birthPlace.trim();
    }
    if (sex) {
      medecin.sex = sex.trim();
    }

    if (nationality) {
      medecin.nationality = nationality.trim();
    }
    if (phoneNumber) {
      medecin.phoneNumber = phoneNumber.trim();
    }
    if (city) {
      medecin.city = city.trim();
    }
    if (qualification) {
      medecin.qualification = qualification.trim();
    }
    if (certificate) {
      medecin.certificate = certificate;
    }

    if (profilePicture) {
      medecin.profilePicture = profilePicture.trim();
    }
    if (hopitalName) {
      medecin.hopitalName = hopitalName.trim();
    }
    if (password) {
      medecin.password = await cryptage(password);
    }

    const updatedDoctor = await medecin.save();
    console.error({ message: " Profil updated successfully" });
    return res.status(200).json({ message: "Profil updated successfully" });
  } catch (error) {
    console.error("Caught error:", error);
    return res.status(404).json({ error: "An error occured" });
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

const updatePatient = async (req, res) => {
  try {
    const { cardId, ...updateData } = req.body;
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
        const updatedPatient = await Patient.findOneAndUpdate(
          { cardId },
          { $push: updateData },
          { new: true }
        );
        return res.status(200).json({
          message: "Patient updated successfully",
          NewPatient: updatedPatient,
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};

module.exports = {
  authenticateMedecin,
  getProfile,
  getProfileMedicalPatient,
  updatePatient,
  editProfile,
};

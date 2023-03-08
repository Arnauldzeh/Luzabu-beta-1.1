const { Medecin } = require("./model");
const { bloquerMedecin } = require("../admin/models");
const { cryptage, verifyHashedData } = require("../services/cryptage");
const { createToken } = require("../services/creerToken");
const jwt = require("jsonwebtoken");
//
const { Patient } = require("../patient/model");
const { bloquer } = require("../admin/models");

//Create neww Doctor
const signup = async (req, res, next) => {
  try {
    let {
      matricule,
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
      registrationDate,
    } = req.body;

    //removing blank spaces
    matricule = matricule.trim();
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    birthPlace = birthPlace.trim();
    sex = sex.trim();
    nationality = nationality.trim();
    phoneNumber = phoneNumber.trim();
    city = city.trim();
    qualification = qualification.trim();
    hopitalName = hopitalName.trim();
    registrationDate = registrationDate.trim();

    //testing empty fields
    if (
      !(
        matricule &&
        firstName &&
        lastName &&
        email &&
        birthdate &&
        birthPlace &&
        sex &&
        nationality &&
        phoneNumber &&
        qualification &&
        certificate &&
        city &&
        hopitalName &&
        profilePicture &&
        password &&
        registrationDate
      )
    ) {
      return res.status(400).json({ error: "Empty input fields!!!" });
      // } else if (!/^[a-zA-Z ]*$/.test(firstName, lastName)) {
      //   return res.status(400).json({ error: "Invalid name!!!" });
      // }
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      return res.status(400).json({ error: "Invalid email!!!" });
    } else if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must contain atleast 8 caracters!!!" });
    } else {
      const existingMedecin = await Medecin.findOne({ matricule });
      const existingEmail = await Medecin.findOne({ email });

      if (existingMedecin) {
        return res
          .status(400)
          .json({ error: "A doctor already used this data" });
      } else if (existingEmail) {
        return res.status(400).json({ error: "email already used" });
      }

      //hash password with the cryptage function in the services folder
      const hashedPassword = await cryptage(password);
      const newMedecin = new Medecin({
        matricule,
        firstName,
        lastName,
        email,
        birthdate,
        birthPlace,
        sex,
        nationality,
        phoneNumber,
        qualification,
        certificate,
        city,
        hopitalName,
        profilePicture,
        password: hashedPassword,
        registrationDate,
      });
      const addedDoctor = await newMedecin.save();
      return res
        .status(200)
        .json({ message: "User registered successfully", addedDoctor });
    }
  } catch (error) {
    console.log({ message: error });
    return res.status(500).json({ error: "An error occured" });
  }
};

const signin = async (req, res) => {
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
const getMedecin = async (req, res) => {
  try {
    //vérification de l'identité du médecin par son matricule entré
    const token = req.headers.authorization.split(" ")[1]

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
      return res.status(200).json({ medecin });
    }
  } catch (error) {
    return res.status(401).send({ error: "An error occured" });
  }
};

//Mettre à jour le profile Medecin
const updateMedecin = async (req, res) => {
  try {
    //vérification de l'identité du médecin par son matricule entré
        const token = req.headers.authorization.split(" ")[1]
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

// RECUPERER L'OBJET PATIENT
const getPatient = async (req, res) => {
  try {
    const { cardId } = req.body;
    const patient = await Patient.findOne({ cardId });
    const isBlockedCardId = await bloquer.findOne({ cardId });

       const token = req.headers.authorization.split(" ")[1]
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
      if (!patient) {
        console.log("Returning error: No Patient found!!");
        return res.status(404).json({ error: "No Patient found!!" });
      } else if (isBlockedCardId) {
        console.log("Returning error: This account has been suspended!!");
        return res
          .status(400)
          .json({ error: "This account has been suspended!!" });
      } else {
        return res.status(200).json({ patient });
      }
    }
  } catch (error) {
    console.error("Caught error:", error);
    return res.status(401).send({ error: "An error occured" });
  }
};

// const updatePatient = async (req, res) => {
//   try {
//     const patient = req.body;

//     const token = req.headers.authorization.split(" ")[1];
//     if (!token) {
//       return res.status(401).send("Authentication token is required!!");
//     }

//     const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
//     const fetchpatient = await Patient.findOne({
//       cardId: decodedToken.cardId,
//     });
//     // console.log(decodedToken.cardId);
//     const isBlockedCardId = await bloquer.findOne({
//       cardId: decodedToken.cardId,
//     });

//     if (!fetchpatient) {
//       console.log("Returning error: No Patient found!!");
//       return res.status(404).json({ error: "No Patient found!!" });
//     } else if (isBlockedCardId) {
//       console.log("Returning error: This account has been suspended!!");
//       return res
//         .status(400)
//         .json({ error: "This account has been suspended!!" });
//     } else if (!patient) {
//       return res.status(400).json({ error: "Invalid update data" });
//     }

//     const updatedPatient = await Patient.findOneAndUpdate(
//       { cardId: decodedToken.cardId },
//       { $set: patient },
//       { new: true }
//     );

//     return res.status(200).json({
//       message: "Patient updated successfully",
//       patient: updatedPatient,
//     });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ message: "Internal server error", error: error });
//   }
// };

//MISE A JOUR DU PATIENT
const updatePatient = async (req, res) => {
  try {
    const { cardId, patient } = req.body;
    const fetchedPatient = await Patient.findOne({ cardId });
    const isBlockedCardId = await bloquer.findOne({ cardId });

       const token = req.headers.authorization.split(" ")[1]
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
          { $set: patient },
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
  signup,
  signin,
  getMedecin,
  getPatient,
  updatePatient,
  updateMedecin,
};

const { Patient } = require("../Models/patient");
const { Identifiant, bloquer } = require("../Models/admin");
const { cryptage, verifyHashedData } = require("../services/cryptage");
const { createToken } = require("../services/creerToken");
const jwt = require("jsonwebtoken");
const { validatePassword } = require("../services/validate");

const signup = async (req, res, next) => {
  try {
    let {
      cardId,
      firstName,
      lastName,
      email,
      birthdate,
      sex,
      profession,
      nationality,
      address,
      phoneNumber,
      profilePicture,
      password,
    } = req.body;

    //removing blank spaces
    cardId = cardId.trim();
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    birthdate = birthdate.trim();
    sex = sex.trim();
    profession = profession.trim();
    nationality = nationality.trim();
    address = address.trim();
    phoneNumber = phoneNumber.trim();
    profilePicture = profilePicture.trim();
    password = password;
    if (
      !(
        cardId &&
        firstName &&
        lastName &&
        email &&
        birthdate &&
        sex &&
        profession &&
        nationality &&
        address &&
        phoneNumber &&
        profilePicture &&
        password
      )
    ) {
      console.log("Returning error: Empty input fields!!!");
      return res.status(400).json({ error: "Empty input fields!!!" });
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      console.log("Returning error: Invalid email!!!");
      return res.status(400).json({ error: "Invalid email!!!" });
    } else if (password.length < 8) {
      console.log(
        "Returning error: Password must contain atleast 8 caracters!!!"
      );
      return res
        .status(400)
        .json({ error: "Password must contain atleast 8 caracters!!!" });
    } else {
      const existingNewId = await Identifiant.findOne({ cardId });
      const existingPatient = await Patient.findOne({ cardId });
      const existingEmail = await Patient.findOne({
        "userProfile.email": email,
      });
      if (!existingNewId) {
        console.log("Returning error: this card does'nt exist!!!");
        return res.status(400).json({ error: "this card does'nt exist" });
      } else if (existingPatient) {
        console.log("Returning error: Card already used!!");
        return res.status(400).json({ error: "Card already used" });
      } else if (existingEmail) {
        console.log("Returning error: email already used!!");
        return res.status(400).json({ error: "email already used" });
      } else if (!validatePassword(password)) {
        console.log(
          "Returning error: Password must contain at least 8 characters"
        );
        return res.status(400).json({
          error:
            "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character",
        });
      }
      //hash password with the cryptage function in the services folder
      const hashedPassword = await cryptage(password);
      const newPatient = new Patient({
        cardId,
        password: hashedPassword,
        userProfile: {
          firstName,
          lastName,
          email,
          birthdate,
          sex,
          profession,
          nationality,
          address,
          phoneNumber,
          profilePicture,
        },
      });
      await newPatient.save();

      return res.status(201).json({
        message: "User registered successfully!! ",
      });
    }
  } catch (error) {
    console.error("Caught error:", error);
    return res.status(400).json({
      error: "An error occured,try again",
    });
  }
};

const signin = async (req, res) => {
  try {
    const { cardId, password } = req.body;
    const fetchedPatient = await Patient.findOne({ cardId });

    if (!fetchedPatient) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    const isBlocked = fetchedPatient.blocked;
    if (isBlocked) {
      return res.status(400).json({ message: "Access denied!!" });
    } else {
      const hashedPassword = fetchedPatient.password;
      const passwordMatch = await verifyHashedData(password, hashedPassword);
      if (!passwordMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
      //generation du token en utilisant l'id de la carte cardId et l'identifiant de la bd
      const tokenData = {
        cardId: fetchedPatient.cardId,
        patientId: fetchedPatient._id,
      };
      const token = await createToken(tokenData);

      return res.status(200).json({
        token,
        message: "User login successfully",
      });
    }
  } catch (error) {
    console.error("Caught error:", error);
    return res.status(500).json({ error: "An error occured" });
  }
};

// RECUPERER L'OBJET PATIENT
const getPatient = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).send("Authentication token is required!!");
    }
    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
    const patient = await Patient.findOne({ cardId: decodedToken.cardId });

    const isBlocked = patient.blocked;
    if (isBlocked) {
      return res.status(400).json({ message: "Access denied!!" });
    } else if (!patient) {
      console.log("Returning error: No Patient found!!");
      return res.status(404).json({ error: "No Patient found!!" });
    } else {
      return res.status(200).json(patient);
    }
  } catch (error) {
    console.error("Caught error:", error);
    return res.status(401).send({ error: "An error occured" });
  }
};

const updatePatient = async (req, res) => {
  try {
    const patient = req.body;

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).send("Authentication token is required!!");
    }

    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
    const fetchpatient = await Patient.findOne({
      cardId: decodedToken.cardId,
    });
    // console.log(decodedToken.cardId);
    const isBlocked = fetchpatient.blocked;
    if (isBlocked) {
      return res.status(400).json({ message: "Access denied!!" });
    } else if (!fetchpatient) {
      console.log("Returning error: No Patient found!!");
      return res.status(404).json({ error: "No Patient found!!" });
    } else if (!patient) {
      return res.status(400).json({ error: "Invalid update data" });
    }

    const updatedPatient = await Patient.findOneAndUpdate(
      { cardId: decodedToken.cardId },
      { $set: patient },
      { new: true }
    );

    return res.status(200).json({
      message: "Patient updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};

// RECUPERER TOUT LES PATIENTS DU SYSTEME
const getAllPatient = async (req, res) => {
  try {
    const patients = await Patient.find({}); // récupérer tous les patients de la base de données

    return res.status(200).json(patients); // renvoyer les patients dans la réponse HTTP
  } catch (error) {
    console.error("Caught error:", error);
    return res.status(500).send({ error: "An error occured" }); // gérer l'erreur
  }
};

//Exporter les fonctions
module.exports = {
  signup,
  signin,
  getPatient,
  updatePatient,
  getAllPatient,
};

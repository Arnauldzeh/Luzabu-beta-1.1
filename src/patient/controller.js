const { Patient } = require("./model");
const { Identifiant, bloquer } = require("../admin/models");
const { cryptage, verifyHashedData } = require("../services/cryptage");
const { createToken } = require("../services/creerToken");
const jwt = require("jsonwebtoken");

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
    } else if (!/^[a-zA-Z ]*$/.test(firstName, lastName)) {
      console.log("Returning error: Invalid name!!!");
      return res.status(400).json({ error: "Invalid name!!!" });
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
      }

      //hash password with the cryptage function in the services folder
      const hashedPassword = await cryptage(password);
      const newPatient = new Patient({
        cardId,
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
          password: hashedPassword,
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

//signin
const signin = async (req, res) => {
  try {
    const { cardId, password } = req.body;
    const fetchedPatient = await Patient.findOne({ cardId });
    const isBlockedcardId = await bloquer.findOne({ cardId });

    if (isBlockedcardId) {
      return res.status(401).json({
        message: "Access denied due to some reasons!!",
      });
    } else if (!fetchedPatient) {
      return res.status(400).json({ message: "Invalid credentials" });
    } else {
      const hashedPassword = fetchedPatient.userProfile.password;
      const passwordMatch = await verifyHashedData(password, hashedPassword);
      if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }
      //generation du token en utilisant le matricule et l'identifiant de la bd
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
    return res.status(500).json({ error });
  }
};

// RECUPERER L'OBJET PATIENT
const getPatient = async (req, res) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
      return res.status(401).send("Authentication token is required!!");
    }
    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
    const patient = await Patient.findOne({ cardId: decodedToken.cardId });
    const isBlockedCardId = await bloquer.findOne({
      cardId: decodedToken.cardId,
    });

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
  } catch (error) {
    console.error("Caught error:", error);
    return res.status(401).send({ error: "An error occured" });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { ...updateData } = req.body;

    const token =
      req.body.token ||
      req.query.token ||
      req.headers["x-access-token"] ||
      req.headers["authorisation"];

    if (!token) {
      return res.status(401).send("Authentication token is required!!");
    }

    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
    const patient = await Patient.findOne({
      cardId: decodedToken.cardId,
    });
    const isBlockedCardId = await bloquer.findOne({
      cardId: decodedToken.cardId,
    });

    if (!patient) {
      console.log("Returning error: No Patient found!!");
      return res.status(404).json({ error: "No Patient found!!" });
    } else if (isBlockedCardId) {
      console.log("Returning error: This account has been suspended!!");
      return res
        .status(400)
        .json({ error: "This account has been suspended!!" });
    } else {
      const updatedPatient = await Patient.findOneAndUpdate(
        { cardId: decodedToken.cardId },
        {
          $set: {
            "userProfile.firstName": updateData.userProfile.firstName,
            "userProfile.lastName": updateData.userProfile.lastName,
            "userProfile.email": updateData.userProfile.email,
            "userProfile.birthdate": updateData.userProfile.birthdate,
            "userProfile.sex": updateData.userProfile.sex,
            "userProfile.profession": updateData.userProfile.profession,
            "userProfile.nationality": updateData.userProfile.nationality,
            "userProfile.address": updateData.userProfile.address,
            "userProfile.phoneNumber": updateData.userProfile.phoneNumber,
            "userProfile.profilePicture": updateData.userProfile.profilePicture,
            "userProfile.password": updateData.userProfile.password,
          },

          $push: {
            medicalProfile: updateData.medicalProfile,
            consultations: updateData.consultations,
            prescriptions: updateData.prescriptions,
            examinations: updateData.examinations,
            labResults: updateData.labResults,
            radiologies: updateData.radiologies,
            notifications: updateData.notifications,
          },
        },
        { new: true }
      );

      return res.status(200).json({
        message: "Patient updated successfully",
        // NewPatient: updatedPatient,
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};

//Exporter les fonctions
module.exports = {
  signup,
  signin,
  getPatient,
  updatePatient,
};

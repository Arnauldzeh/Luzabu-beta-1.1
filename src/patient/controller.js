const { Patient } = require("./model");
const { Identifiant, bloquer } = require("../admin/models");
const { cryptage, verifyHashedData } = require("../services/cryptage");
const { createToken } = require("../services/creerToken");
const jwt = require("jsonwebtoken");
const {
  validateProfile,
  validateSignup,
  validateSignin,
} = require("../middleware/dataValidation");

//Create neww patient
const createNewPatient = async (req, res, next) => {
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

    //empty fields
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
      return res.status(400).json({ error: "Empty input fields!!!" });
    } else if (!/^[a-zA-Z ]*$/.test(firstName, lastName)) {
      return res.status(400).json({ error: "Invalid name!!!" });
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      return res.status(400).json({ error: "Invalid email!!!" });
    } else if (password.length < 8) {
      return res.status(400).json({ error: "Invalid password!!!" });
    } else {
      //checking if CardId belongs to the system
      //checking if patient already exists
      //checking if CardId is already used
      const existingNewId = await Identifiant.findOne({ cardId });
      const existingPatient = await Patient.findOne({ cardId });
      const existingEmail = await Patient.findOne({ email });

      if (!existingNewId) {
        return res.status(400).json({ error: "Id card does'nt exist" });
      } else if (existingPatient) {
        return res.status(400).json({ error: "Id card already used" });
      } else if (existingEmail) {
        return res.status(400).json({ error: "email already used" });
      }

      //hash password with the cryptage function in the services folder
      const hashedPassword = await cryptage(password);
      const newPatient = new Patient({
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
        password: hashedPassword,
      });
      await newPatient.save();
      res.status(201).json({ message: "User registered successfully!!" });
    }
  } catch (error) {
    return res.status(500).json({ error: "The server crashed" });
  }
};

//signin
const authenticatePatient = async (req, res) => {
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
      const hashedPassword = fetchedPatient.password;
      const passwordMatch = await verifyHashedData(password, hashedPassword);
      if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }
      const tokenData = { patientId: fetchedPatient._id, cardId };
      const token = await createToken(tokenData);

      return res.status(200).json({
        token,
        message: "User login successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

//Afficher profile
const getProfile = async (req, res) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
      return res.status(401).send("Authentication token is required!!");
    }
    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
    const patient = await Patient.findById({ _id: decodedToken.patientId });
    if (!patient) {
      return res.status(404).send("No user found!!");
    }
    return res.status(200).json({
      cardId: patient.cardId,
      firstName: patient.firstName,
      lastName: patient.lastName,
      birthdate: patient.birthdate,
      sex: patient.sex,
      profession: patient.profession,
      nationality: patient.nationality,
      address: patient.address,
      phoneNumber: patient.phoneNumber,
      profilePicture: patient.profilePicture,
    });
  } catch (error) {
    return res.status(401).send("Invalid token provided");
  }
};

//Mettre à jour le profile patient
const editProfile = async (req, res) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
      return res.status(401).send("Authentication token is required!!");
    }
    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
    const patient = await Patient.findById({ _id: decodedToken.patientId });
    if (!patient) {
      return res.status(404).json({ error: "User not found!!" });
    }

    const {
      firstName,
      lastName,
      birthdate,
      sex,
      profession,
      nationality,
      address,
      phoneNumber,
      profilePicture,
      password,
    } = req.body;

    if (firstName) {
      patient.firstName = firstName;
    }
    if (lastName) {
      patient.lastName = lastName;
    }
    if (birthdate) {
      patient.birthdate = birthdate;
    }
    if (password) {
      patient.password = await cryptage(password);
    }
    if (sex) {
      patient.sex = sex;
    }
    if (profession) {
      patient.profession = profession;
    }
    if (nationality) {
      patient.nationality = nationality;
    }
    if (address) {
      patient.address = address;
    }
    if (phoneNumber) {
      patient.phoneNumber = phoneNumber;
    }
    if (profilePicture) {
      patient.profilePicture = profilePicture;
    }

    const updatedPatient = await patient.save();
    return res.status(200).json("Profil updated successfully");
  } catch (error) {
    return res.status(404).json("Invalid token");
  }
};

//Exporter les fonctions
module.exports = {
  createNewPatient,
  authenticatePatient,
  getProfile,
  editProfile,
};

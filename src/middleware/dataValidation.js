const { Patient } = require("../patient/model");
const { Medecin } = require("../medecin/model");
const { check, validationResult } = require("express-validator");

const validateProfile = async (req, res) => {
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
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const validateSignup = async (req, res) => {
  try {
    //getting data from form body
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
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const validateSignin = async (req, res) => {
  try {
    let { cardId, matricule, password } = req.body;

    //validation de longeur du cardId
    if (!(cardId || matricule || cardId.trim().length === 0)) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    // Validation de la longueur du mot de passe
    if (!password || password.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
const validateMedSignin = async (req, res) => {
  try {
    let { matricule, password } = req.body;

    //validation de longeur du cardId
    if (!(matricule || matricule.trim().length === 0)) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    // Validation de la longueur du mot de passe
    if (!password || password.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const validatecardId = async (req, res) => {
  try {
    //getting data from form body
    let { cardId } = req.body;

    cardId = cardId.trim();

    if (!cardId) {
      return res.status(200).json({ error: "Empty credentials" });
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const validateMatricule = async (req, res) => {
  try {
    //getting data from form body
    let { matricule } = req.body;

    matricule = matricule.trim();

    if (!matricule) {
      return res.status(200).json({ error: "Empty credentials" });
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const validatebloquecardId = async (req, res) => {
  try {
    //getting data from form body
    let { cardId } = req.body;

    cardId = cardId.trim();

    if (!cardId) {
      return res.status(400).json({ error: "Empty credentials" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};
const validatebloquematricule = async (req, res) => {
  try {
    //getting data from form body
    let { matricule } = req.body;

    matricule = matricule.trim();

    if (!matricule) {
      return res.status(400).json({ error: "Empty credentials" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const validateMedecin = async (req, res) => {
  try {
    //getting data from form body
    let {
      matricule,
      firstName,
      lastName,
      birthdate,
      sex,
      nationality,
      phoneNumber,
      generalist,
      specialist,
      schoolCertificate,
      privateAutorisation,
      hopitalName,
      password,
    } = req.body;
    //removing blank spaces
    matricule = matricule.trim();
    firstName = firstName.trim();
    lastName = lastName.trim();
    birthdate = birthdate.trim();
    sex = sex.trim();
    nationality = nationality.trim();
    phoneNumber = phoneNumber.trim();
    generalist = generalist.trim();
    specialist = specialist.trim();
    schoolCertificate = schoolCertificate.trim();
    privateAutorisation = privateAutorisation.trim();
    hopitalName = hopitalName.trim();
    password = password;

    //testing empty fields
    if (
      !(
        matricule ||
        firstName ||
        lastName ||
        birthdate ||
        sex ||
        nationality ||
        phoneNumber ||
        generalist ||
        specialist ||
        schoolCertificate ||
        privateAutorisation ||
        hopitalName ||
        password
      )
    ) {
      throw Error("Un ou plusieurs champs vides!!!");
      //testing email,names,password
      //name test
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

module.exports = {
  validateSignup,
  validateProfile,
  validateSignin,
  validatecardId,
  validatebloquecardId,
  validateMatricule,
  validatebloquematricule,
  validateMedecin,
  validateMedSignin,
};

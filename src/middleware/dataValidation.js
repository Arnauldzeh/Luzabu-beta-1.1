const { Patient } = require("../patient/model");
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
//   check("firstName")
//     .optional()
//     .isLength({ min: 2 })
//     .withMessage("Name must contain atleast 2 caracters"),
//   check("lastName").optional().isLength({ min: 2 }),
//   // check("birthdate")
//   //   .isDate()
//   //   .withMessage("birthdate doit être une date valide"),
//   check("sex")
//     .optional()
//     .isIn(["Male", "Female", "male", "female", "F", "M", "m", "f"]),
//   check("profession").optional().isLength({ min: 2 }),
//   check("nationality").optional().isLength({ min: 2 }),
//   check("address").optional().isString(),
//   check("phoneNumber").optional().isMobilePhone(),
//   check("profilePicture").optional().isString(),
//   check("password").optional().isLength({ min: 8 }),
//   async (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   },

const validateSignup = async (req, res) => {
  try {
    //getting data from form body
    let {
      cardId,
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

    //removing blank spaces
    cardId = cardId.trim();
    firstName = firstName.trim();
    lastName = lastName.trim();
    birthdate = birthdate.trim();
    sex = sex.trim();
    profession = profession.trim();
    nationality = nationality.trim();
    address = address.trim();
    phoneNumber = phoneNumber.trim();
    profilePicture = profilePicture.trim();
    password = password;
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const validateSignin = async (req, res) => {
  try {
    let { cardId, password } = req.body;

    //validation de longeur du cardId
    if (!(cardId || cardId.trim().length === 0)) {
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

module.exports = {
  validateSignup,
  validateProfile,
  validateSignin,
  validatecardId,
  validatebloquecardId,
  validateMatricule,
};

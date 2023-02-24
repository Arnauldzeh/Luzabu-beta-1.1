const { Patient } = require("./model");
const { ProfilMedical, Consultation } = require("../carnet/models");
const { Identifiant, bloquer } = require("../admin/models");
const { cryptage, verifyHashedData } = require("../services/cryptage");
const { createToken } = require("../services/creerToken");
const jwt = require("jsonwebtoken");

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
      //checking if CardId belongs to the system
      //checking if patient already exists
      //checking if CardId is already used
      const existingNewId = await Identifiant.findOne({ cardId });
      const existingPatient = await Patient.findOne({ cardId });
      const existingEmail = await Patient.findOne({ email });

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
      // create new profile medical
      // const newProfilMedical = new ProfilMedical({
      //   patient: newPatient._id,
      // });
      await newPatient.save();
      // await newProfilMedical.save();

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
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).send("Authentication token is required!!");
    }
    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
    // const patient = await Patient.findById({ _id: decodedToken.patientId });
    const patient = await Patient.findOne({ cardId: decodedToken.cardId });

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

//
const getProfileMedical = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //       req.body.token || req.query.token || req.headers["authorization"];
    if (!token) {
      console.log("Returning error: Authentication token is required!!");
      return res.status(401).send("Authentication token is required!!");
    }
    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
    const profileMedical = await ProfilMedical.findOne({
      patientId: decodedToken.patientId,
    });
    if (!profileMedical) {
      console.log("Returning error: No profile medical found!!");
      return res.status(404).send("No profile medical found!!");
    }
    const patient = await Patient.findById({ _id: profileMedical.patient });
    if (!patient) {
      console.log("Returning error: No patient found!!");
      return res.status(404).send("No patient found!!");
    }
    return res.status(200).json({
      cardId: patient.cardId,
      firstName: patient.firstName,
      lastName: patient.lastName,
      birthdate: patient.birthdate,
      sex: patient.sex,
      phoneNumber: patient.phoneNumber,
      profilePicture: patient.profilePicture,
      profession: patient.profession,
      nationality: patient.nationality,
      address: patient.address,
      age: profileMedical.age,
      height: profileMedical.height,
      weight: profileMedical.weight,
      bloodGroup: profileMedical.bloodGroup,
      allergies: profileMedical.allergies,
      chronicIllnesses: profileMedical.chronicIllnesses,
      familyHistories: profileMedical.familyHistories,
      emergencyContacts: profileMedical.emergencyContacts,
    });
  } catch (error) {
    console.error("Caught error:", error);
    return res.status(401).send("Invalid token provided");
  }
};

//Mettre à jour le profile patient
const editProfile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //       req.body.token || req.query.token || req.headers["authorization"];
    if (!token) {
      return res.status(401).send("Authentication token is required!!");
    }
    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
    // const patient = await Patient.findById({ _id: decodedToken.patientId });
    const patient = await Patient.findOne({ cardId: decodedToken.cardId });

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
    console.error({ message: " Profil updated successfully" });
    return res.status(200).json("Profil updated successfully");
  } catch (error) {
    console.error("Caught error:", error);
    return res.status(404).json("Invalid token");
  }
};

//Create medicalProfile
const createMedicalProfile = async (req, res) => {
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
  const existingProfile = await ProfilMedical.findOne({ patient: patient._id });
  if (existingProfile) {
    return res
      .status(409)
      .json({ error: "Medical profile already exists for the patient!!" });
  } else {
    const {
      age,
      weight,
      height,
      bloodGroup,
      allergies,
      chronicIllnesses,
      familyHistories,
      emergencyContacts,
    } = req.body;
    const profile = new ProfilMedical({
      patient: patient._id,
      age,
      weight,
      height,
      bloodGroup,
      allergies,
      chronicIllnesses,
      familyHistories,
      emergencyContacts,
    });
  }

  try {
    const savedProfile = await profile.save();
    //Medical Profile created successfully
    res.json(savedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//modifier medical profile
const editMedicalProfile = async (req, res) => {
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

  const profileMedical = await ProfilMedical.findOne({
    patientId: patient._id,
  });
  if (!profileMedical) {
    return res.status(404).json({ error: "Medical profile not found!!" });
  }

  const {
    age,
    height,
    weight,
    bloodGroup,
    chronicIllnesses,
    familyHistories,
    allergies,
    emergencyContacts,
  } = req.body;

  if (!age && !height && !weight && !bloodGroup) {
    return res.status(400).json({ error: "Fields are required!!" });
  }

  if (age !== undefined) {
    profileMedical.age = age;
  }

  if (height !== undefined) {
    profileMedical.height = height;
  }

  if (weight !== undefined) {
    profileMedical.weight = weight;
  }

  if (bloodGroup !== undefined) {
    profileMedical.bloodGroup = bloodGroup;
  }

  if (chronicIllnesses !== undefined) {
    if (!Array.isArray(chronicIllnesses)) {
      return res
        .status(400)
        .json({ error: "Invalid input for chronicIllnesses array!!" });
    }
    profileMedical.chronicIllnesses = chronicIllnesses;
  }

  if (familyHistories !== undefined) {
    if (!Array.isArray(familyHistories)) {
      return res
        .status(400)
        .json({ error: "Invalid input for familyHistories array!!" });
    }
    profileMedical.familyHistories = familyHistories;
  }

  if (allergies !== undefined) {
    if (!Array.isArray(allergies)) {
      return res
        .status(400)
        .json({ error: "Invalid input for allergies array!!" });
    }
    allergies.forEach((allergy) => {
      const { id, field, value } = allergy;
      const allergyIndex = profileMedical.allergies.findIndex(
        (allergy) => allergy._id.toString() === id
      );
      if (allergyIndex >= 0) {
        profileMedical.allergies[allergyIndex][field] = value;
      } else {
        return res.status(400).json({
          error: "Invalid object ID provided for allergies array!!",
        });
      }
    });
  }

  if (emergencyContacts !== undefined) {
    if (!Array.isArray(emergencyContacts)) {
      return res
        .status(400)
        .json({ error: "Invalid input for emergencyContacts array!!" });
    }
    emergencyContacts.forEach((contact) => {
      const { id, field, value } = contact;
      const contactIndex = profileMedical.emergencyContacts.findIndex(
        (contact) => contact._id.toString() === id
      );
      if (contactIndex >= 0) {
        profileMedical.emergencyContacts[contactIndex][field] = value;
      } else {
        return res.status(400).json({
          error: "Invalid object ID provided for emergencyContacts array!!",
        });
      }
    });
  }

  try {
    const savedProfile = await profileMedical.save();
    return res.status(200).json(savedProfile);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Afficher toutes les consultations
const getConsultation = async (req, res) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
      return res.status(401).send("Authentication token is required!!");
    }
    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
    const patient = await Patient.findOne({ cardId: decodedToken.cardId });

    if (!patient) {
      return res.status(404).send("No user found!!");
    }

    const consultations = await Consultation.find({
      patientCardId: decodedToken.cardId,
    }); // Ajout de .toArray() pour obtenir un tableau de consultations

    if (!consultations) {
      return res.status(404).send("No consultation found!!");
    }

    const consultationsData = consultations.map((consultation) => ({
      id: consultation._id,
      heure: consultation.heure,
      date: consultation.date,
      nomMedecin: consultation.nomMedecin,
    }));

    return res.status(200).json(consultationsData);
  } catch (error) {
    console.error("Caught error:", error);
    return res.status(401).send("Invalid token provided");
  }
};

//afficher une consultation specifique
//Afficher les informations d'une consultation
const getOneConsultation = async (req, res) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
      return res.status(401).send("Authentication token is required!!");
    }
    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
    const patient = await Patient.findOne({ cardId: decodedToken.cardId });
    if (!patient) {
      return res.status(404).send("No user found!!");
    }

    const consultationId = req.params.id; // Récupération de l'id de la consultation à afficher
    //const consultationId = req.params["id"];

    const consultation = await Consultation.findOne({
      _id: consultationId,
      patientCardId: decodedToken.cardId,
    });

    if (!consultation) {
      console.log("Returning error: No consultation found!!");
      return res.status(404).send("No consultation found!!");
    }

    return res.status(200).json({
      consultation,
    });
  } catch (error) {
    console.error("Caught error:", error);
    return res.status(401).send("Invalid token provided");
  }
};

//Exporter les fonctions
module.exports = {
  createNewPatient,
  authenticatePatient,
  getProfile,
  editProfile,
  getProfileMedical,
  createMedicalProfile,
  editMedicalProfile,
  getConsultation,
  getOneConsultation,
};

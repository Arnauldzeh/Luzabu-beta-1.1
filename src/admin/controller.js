const { Identifiant, bloquer, Matricule, bloquerMedecin } = require("./models");
const { Medecin } = require("../medecin/model");
const { cryptage } = require("../services/cryptage");

//Create neww patient
const NewcardId = async (req, res) => {
  try {
    const { cardId } = req.body;

    if (!cardId) {
      return res.status(400).json({ error: "Empty input fields!!!" });
    } else {
      //checking if CardId belongs to the system
      //checking if patient already exists
      const existingcardId = await Identifiant.findOne({ cardId });

      if (existingcardId) {
        console.log("Returning error: Card already used!!");
        return res.status(404).json({ error: "cardId already exist" });
      }
      const newcardId = new Identifiant({
        cardId,
      });
      const createdcardId = await newcardId.save();
      return res.status(200).json({ message: "cardId added successfully" });
    }
  } catch (error) {
    throw error;
  }
};

//Add doctor matricule
const newMatricule = async (req, res) => {
  try {
    const { matricule } = req.body;

    if (!matricule) {
      return res.status(400).json({ error: "Empty input fields!!!" });
    } else {
      const existingMatricule = await Matricule.findOne({ matricule });

      if (existingMatricule) {
        return res.status(404).json({ error: "matricule already exist" });
      }
      const newMat = new Matricule({
        matricule,
      });
      const createdMatricule = await newMat.save();
      return res.status(200).json({ message: "matricule added successfully" });
    }
  } catch (error) {
    throw error;
  }
};

//block a patient
const bloquecardId = async (req, res) => {
  try {
    const { cardId } = req.body;

    if (!cardId) {
      return res.status(400).json({ error: "Empty input fields!!!" });
    } else {
      const existingcardId = await Identifiant.findOne({ cardId });

      //checking if CardId belongs to the blocked collection
      //checking if patient is already blocked
      const isBlockedcardId = await bloquer.findOne({ cardId });
      if (!existingcardId) {
        return res.status(404).json({ error: "Id not found" });
      } else if (isBlockedcardId) {
        return res.status(200).json({ message: "Id already blocked" });
      } else {
        const newcardId = new bloquer({
          cardId,
        });
        const blockedcardId = await newcardId.save();
        return res.status(200).json({ message: "User blocked successfully" });
      }
    }
  } catch (error) {
    throw error;
  }
};
//block a patient
const bloqueMatricule = async (req, res) => {
  try {
    const { matricule } = req.body;

    if (!matricule) {
      return res.status(400).json({ error: "Empty input fields!!!" });
    } else {
      const existingmatricule = await Matricule.findOne({ matricule });

      //checking if CardId belongs to the blocked collection
      //checking if patient is already blocked
      const blockedMatricule = await bloquerMedecin.findOne({ matricule });
      if (!existingmatricule) {
        return res.status(404).json({ error: "Matricule not found" });
      } else if (blockedMatricule) {
        return res.status(401).json({ message: "Matricule already blocked" });
      } else {
        const newMatricule = new bloquerMedecin({
          matricule,
        });
        const blockedmatricule = await newMatricule.save();
        return res
          .status(200)
          .json({ message: "Matricule blocked successfully" });
      }
    }
  } catch (error) {
    throw error;
  }
};

const unblockMatricule = async (req, res) => {
  try {
    let { matricule } = req.body;
    matricule = matricule.trim();
    if (!matricule) {
      return res.status(400).json({ error: "Empty input fields!!!" });
    } else {
      const blockedMat = await bloquerMedecin.findOne({ matricule });

      if (!blockedMat) {
        return res.status(404).json({ error: "Matricule not found" });
      } else {
        await bloquerMedecin.deleteOne({ matricule });
        return res
          .status(200)
          .json({ message: "Matricule unblocked successfully" });
      }
    }
  } catch (error) {
    throw error;
  }
};
const unblockcardId = async (req, res) => {
  try {
    let { cardId } = req.body;
    cardId = cardId.trim();
    if (!cardId) {
      return res.status(400).json({ error: "Empty input fields!!!" });
    } else {
      const blockedCardId = await bloquer.findOne({ cardId });

      if (!blockedCardId) {
        return res.status(404).json({ error: "cardId not found" });
      } else {
        await bloquer.deleteOne({ cardId });
        return res
          .status(200)
          .json({ message: "cardId unblocked successfully" });
      }
    }
  } catch (error) {
    throw error;
  }
};

//
//Create neww Doctor
const NouveauMedecin = async (req, res, next) => {
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
        password
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
      const existingMatricule = await Matricule.findOne({ matricule });
      const existingMedecin = await Medecin.findOne({ matricule });
      const existingEmail = await Medecin.findOne({ email });

      if (!existingMatricule) {
        return res.status(400).json({ error: "Matricule does'nt exist" });
      } else if (existingMedecin) {
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

//
module.exports = {
  NewcardId,
  bloquecardId,
  unblockcardId,
  NouveauMedecin,
  newMatricule,
  bloqueMatricule,
  unblockMatricule,
};

//TO DO
//get any id and block the corresponding account

const Patient = require("./model");
const { cryptage } = require("../services/cryptage");

const createNewPatient = async (data) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      cardId,
      sex,
      profession,
      nationality,
      phoneNumber,
    } = data;

    //checking if patient already exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      throw Error("Un Patient avec cet email exist deja");
    }

    //hash password with the cryptage function in the services folder
    const hashedPassword = await cryptage(password);
    const newPatient = new Patient({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      cardId,
      sex,
      profession,
      nationality,
      phoneNumber,
    });
    const createdPatient = await newPatient.save();
    return createdPatient;
  } catch (error) {
    throw error;
  }
};

module.exports = { createNewPatient };

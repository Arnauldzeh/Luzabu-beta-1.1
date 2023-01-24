const Patient = require("./model");
const { cryptage, verifyHashedData } = require("../services/cryptage");
const { createToken } = require("../services/creerToken");

const authenticatePatient = async (data) => {
  try {
    const { cardId, password } = data;
    const fetchedPatient = await Patient.findOne({
      cardId,
    });

    if (!fetchedPatient) {
      throw Error("L'Identifiants invalides!!");
    }

    const hashedPassword = fetchedPatient.password;
    //utiliser la fonction du controller pour comparer les mot de passe
    const passwordMatch = await verifyHashedData(password, hashedPassword);
    if (!passwordMatch) {
      throw Error("Mot de passe invalide!!");
    }

    //si le mdp est bon, alors on crée le token en utilisant la fonction du service
    const tokenData = { patientId: fetchedPatient._id, cardId };
    const token = await createToken(tokenData);

    //assign patient token to the etched patient data
    fetchedPatient.token = token;
    return fetchedPatient;
  } catch (error) {
    throw error;
  }
};

//Create neww patient
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

module.exports = { createNewPatient, authenticatePatient };

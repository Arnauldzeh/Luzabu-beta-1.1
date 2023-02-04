const { Identifiant, bloquer, Matricule } = require("./models");
const {
  validatecardId,
  validateMatricule,
  validatebloquecardId,
} = require("../middleware/dataValidation");
const { Medecin } = require("../medecin/model");

//Create neww patient
const NewcardId = async (req, res) => {
  await validatecardId(req);
  try {
    const { cardId } = req.body;

    //checking if CardId belongs to the system
    //checking if patient already exists
    const existingcardId = await Identifiant.findOne({ cardId });

    if (existingcardId) {
      return res.status(404).json({ error: "cardId already exist" });
    }
    const newcardId = new Identifiant({
      cardId,
    });
    const createdcardId = await newcardId.save();
    return res.status(200).json({ message: "cardId added successfully" });
  } catch (error) {
    throw error;
  }
};

//Add doctor matricule
const newMatricule = async (req, res) => {
  await validateMatricule(req);
  try {
    const { matricule } = req.body;

    //checking if CardId belongs to the system
    //checking if patient already exists
    const existingMatricule = await Matricule.findOne({ matricule });

    if (existingMatricule) {
      return res.status(404).json({ error: "matricule already exist" });
    }
    const newMat = new Matricule({
      matricule,
    });
    const createdMatricule = await newMat.save();
    return res.status(200).json({ message: "matricule added successfully" });
  } catch (error) {
    throw error;
  }
};

//block a user
const bloquecardId = async (req, res) => {
  await validatebloquecardId(req);
  try {
    const { cardId } = req.body;

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
  } catch (error) {
    throw error;
  }
};

//
//Ajouter un médecin
const NouveauMedecin = async (req, res) => {
  try {
    let {
      matricule,
      nom_Med,
      prenom_med,
      sexe_Med,
      nationality_Med,
      date_naissance_Med,
      telephone_Med,
      generaliste,
      specialiste,
      certificat_Etude,
      autorisation_privee,
      nom_hopital,
    } = req.body;

    matricule = matricule.trim();
    nom_Med = nom_Med.trim();
    prenom_med = prenom_med.trim();
    sexe_Med = sexe_Med.trim();
    nationality_Med = nationality_Med.trim();
    date_naissance_Med = date_naissance_Med.trim();
    telephone_Med = telephone_Med.trim();
    generaliste = generaliste.trim();
    specialiste = specialiste.trim();
    certificat_Etude = certificat_Etude.trim();
    autorisation_privee = autorisation_privee.trim();
    nom_hopital = nom_hopital.trim();

    if (
      !(
        matricule &&
        nom_Med &&
        prenom_med &&
        sexe_Med &&
        nationality_Med &&
        date_naissance_Med &&
        telephone_Med &&
        (generaliste || specialiste) &&
        certificat_Etude &&
        autorisation_privee &&
        nom_hopital
      )
    ) {
      return res.status(401).send("Un ou plusieurs champs sont vides !");
    } else {
      //Vérifie si ce medecin existe déjà dans la base de donnée
      const medecinexiste = await Medecin.findOne({
        autorisation_privee: autorisation_privee,
      });
      // if(!medecinexiste){
      //   throw Error("Ce matricule à déjà été enregistré")
      // }
      console.log(autorisation_privee);
      if (medecinexiste) {
        return res
          .status(401)
          .send("Un médecin avec cette autorisation à déjà été enregistré");
      }

      //On hache le mot de passe
      const hashedMatricule = await cryptage(matricule);

      const medecin = new Medecin({
        matricule: hashedMatricule,
        nom_Med,
        prenom_med,
        sexe_Med,
        nationality_Med,
        date_naissance_Med,
        telephone_Med,
        generaliste,
        specialiste,
        certificat_Etude,
        autorisation_privee,
        nom_hopital,
      });

      medecin
        .save()
        .then(() => {
          res.status(200).send("Médecin ajouté !");
        })
        .catch((error) => {
          res
            .status(401)
            .send("Une érreur est survenus pendant l'ajout du médecin !");
        });
    }
  } catch (error) {
    throw error;
  }
};
module.exports = {
  NewcardId,
  bloquecardId,
  NouveauMedecin,
  newMatricule,
};

//TO DO
//get any id and block the corresponding account

const { Identifiant, bloquer } = require("./models");
const {
  validatecardId,
  validatebloquecardId,
} = require("../middleware/dataValidation");

//Create neww patient
const createNewcardId = async (req, res) => {
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

module.exports = { createNewcardId, bloquecardId };

//TO DO
//get any id and block the corresponding account

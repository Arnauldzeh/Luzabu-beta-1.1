const { Identifiant } = require("./models");

//Create neww patient
const createNewcardId = async (data) => {
  try {
    const { cardId } = data;

    //checking if CardId belongs to the system
    //checking if patient already exists
    const existingcardId = await Identifiant.findOne({ cardId });

    if (existingcardId) {
      throw Error("Cet Identifiant exist deja");
    }
    const newcardId = new Identifiant({
      cardId,
    });
    const createdcardId = await newcardId.save();
    return createdcardId;
  } catch (error) {
    throw error;
  }
};

module.exports = { createNewcardId };

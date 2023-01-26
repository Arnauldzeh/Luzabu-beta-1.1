const express = require("express");
const router = express.Router();
const { createNewcardId } = require("./controller");

//Signup route
router.post("/cardId", async (req, res) => {
  try {
    //getting data from form body
    let { cardId } = req.body;

    cardId = cardId.trim();

    if (!cardId) {
      throw Error("Un ou plusieurs champs vides!!!");
    } else {
      // good credentials, create new user function in controller file
      const newcardId = await createNewcardId({
        cardId,
      });
      res.status(200).json(newcardId);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;

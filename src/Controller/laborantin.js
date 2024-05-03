const Laborantin = require("../Models/laborantin");
const { cryptage, verifyHashedData } = require("../services/cryptage");
const { createToken } = require("../services/creerToken");

const signup = async (req, res, next) => {
  try {
    let { name, email, password } = req.body;

    const existingLaborantin = await Laborantin.findOne({ email });

    if (existingLaborantin) {
      console.error("User with the provided email already exist");
      return res.status(400).json({
        message: "User with the provided email already exist",
      });
    }
    const hashedPassword = await cryptage(password);
    const newLaborantin = new Laborantin({
      name,
      email,
      password: hashedPassword,
    });

    const createdLaborantin = await newLaborantin.save();
    return res.status(400).json({ createdLaborantin });
  } catch (error) {
    console.error("Caught error:", error);
    return res.status(400).json({
      error: "An error occured,try again",
    });
  }
};

const signin = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    const fetchedLaborantin = await Laborantin.findOne({ email });

    if (!fetchedLaborantin) {
      console.error("invallid credentials");
      return res.status(400).json({
        message: "invallid credentials",
      });
    }
    const tokenData = {
      laborantinId: fetchedLaborantin._id,
      email: fetchedLaborantin.email,
    };
    const token = await createToken(tokenData);

    fetchedLaborantin.token = token;
    return res.status(200).json({ fetchedLaborantin });
  } catch (error) {
    console.error("Caught error:", error);
    return res.status(400).json({
      error: "An error occured,try again",
    });
  }
};

module.exports = { signup, signin };

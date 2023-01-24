const bcrypt = require("bcrypt");

const cryptage = async (data, saltRounds = 10) => {
  try {
    const crypté = await bcrypt.hash(data, saltRounds);
    return crypté;
  } catch (error) {
    throw error;
  }
};

module.exports = { cryptage };

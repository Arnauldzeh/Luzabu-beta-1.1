const jwt = require("jsonwebtoken");
const { TOKEN_KEY } = process.env;

//verifier le token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(403).send("An authentication token is required");
  }
  //si le token existe on verifie sa validité
  try {
    const decodedToken = await jwt.verify(token, TOKEN_KEY);
    req.currentUser = decodedToken;
  } catch (error) {
    return res.status(401).send("Invalid Token provided");
  }
  //le token etant valide...
  return next();
};

module.exports = { verifyToken };

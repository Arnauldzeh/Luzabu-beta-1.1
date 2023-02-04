const jwt = require("jsonwebtoken");
const {Patient} = require("../patient/model");

const verifieToken = async (req, res) => {
    try {
        const token =
            req.body.token || req.query.token || req.headers["x-access-token"];
        if (!token) {
    return res.status(401).send("Jeton d'authentification requis");
}else{
    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
    const patient = await Patient.findById({ _id: decodedToken.patientId });
    return patient;
}
}catch (error) {
    return res.status(401).send("Token invalide");
}

}

module.exports = {verifieToken}

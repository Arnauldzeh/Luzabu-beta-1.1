const {Carte} = require("../admin/models");

const activerCarte = (patient, idCarte) => {
    const Obj = {
        statutCarte: "En Service",
        IdUser: patient._id
    };

    Carte.updateOne({idCarte: idCarte}, {...Obj, idCarte: idCarte})
        .then()
        .catch();
}

module.exports = { activerCarte };

const { Medecin } = require("./model");
const { bloquerMedecin } = require("../admin/models");
const { cryptage, verifyHashedData } = require("../services/cryptage");
const { createToken } = require("../services/creerToken");
const jwt = require("jsonwebtoken");
const { validateMedSignin } = require("../middleware/dataValidation");
const {Carnet} = require("../carnet/models");
const { codeSms } = require("../admin/models");

//signin
const authenticateMedecin = async (req, res) => {
  try {
    let { matricule, password } = req.body;
    const fetchedMedecin = await Medecin.findOne({ matricule });
    const isBlockedmatricule = await bloquerMedecin.findOne({ matricule });

    if (isBlockedmatricule) {
      return res.status(401).json({
        message: "Access denied due to some reasons!!",
      });
    } else if (!fetchedMedecin) {
      return res.status(400).json({ message: "Invalid matricule" });
    } else {
      const hashedPassword = fetchedMedecin.password;
      const passwordMatch = await verifyHashedData(password, hashedPassword);
      if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }
      const tokenData = { medecinId: fetchedMedecin._id, matricule };
      const token = await createToken(tokenData);

      return res.status(200).json({
        token,
        message: "User login successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};



//////////////////////////////////////////*****SMS*****/////////////////////////////////////////////////////
const orangeSms = require('../services/Orange-sms/orangeSms') // Le chemin à l'intérieur de require() dépend de la structure du dossier de votre application ;

const Sms = (req, res) => {
    const sms = require("../services/genereCodeSMS");

    const code = sms();
    const saveCode = new codeSms({
        code,
    }).save()

    const options = {
        authorization_header:"Basic Q05tZHphU282ZjlQUE9obFJGODY2RGlHR0JzQlk2ckE6UUMzZTJrTmRiSG9rakdBeg==", // String; Must be in this form Basic xxxxxxxxxxxxxxxx take it on your Orange Application
        area_code:"+2370000", // String; Telephony code of your country Ex: +237
        sender_number: 658900293, // Number; Le numéro auquel vous envoyez un message sans indicatif régional
        sender_phone: 658900293, // Number; Votre numéro sans l'indicatif régional, ce numéro doit être le même que celui que vous avez saisi lors de votre inscription sur le site Orange
        sms_body: "LUZABU E-HOSPITAL => code: " + code // String; Your message text to send, not much than 160 characters otherwise Orange will cut it
    };

    orangeSms.then((responseOrangeSms)=>{
        console.log(responseOrangeSms);
        /* Devrait sortir un objet comme {message:sms sent},{message:401} (401 est un exemple de status code d'erreur
           {message:You have to provide all the keys of the object},{message:the object key must not have a value like null or undefined}
           {message:One or more object keys are incorrectly written}, {message: The parameter must be an object}
           You can interpret the message and continue to write your code
        */
    }).catch((error)=>{
        console.log(options);
    });
};
///////////////////////////////////////////////////////////////////////////////////////////////////

const AccesCarnet = (req, res) => {
    let { codeSMS, cardId } = req.body;

    if(!codeSMS){
        return res.status(401).json({message: 'Entres le code envoyer au patient !'})
    }else{
        const codesms = codeSms.findOne({code: codeSMS});
        if(codeSMS != codesms.codesms){
            return res.status(401).json({message: 'Le code entrer est incorrect !'})
        }else{
            if(!cardId){
                return res.status(401).json({message: 'Entres le code envoyer au patient !'})
            }else {
                Carnet.findOne({cardId: cardId})
                    .then( carnet => {res.status(401).json(carnet)})
                    .cache(error => res.status(401).json({message: 'Entres le code envoyer au patient !'}))
            }
        }
    }
}



module.exports = { authenticateMedecin,AccesCarnet,Sms };

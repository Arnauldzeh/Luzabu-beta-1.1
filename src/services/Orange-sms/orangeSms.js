module.exports = (dataObject)=>{
 return new Promise((resolve)=>{
   // ici on fait quelques vérifications sur la structure de données passée en paramètre
   // First we check if dataObject is an object
     console.log(dataObject);
   if(typeof(dataObject) === "object" && dataObject.constructor === Object){
       console.log("2");
     // Deuxièmement, nous vérifions si dataObject a toutes les clés requises et si les clés ne sont pas égales à null ou undefined
     const dataObjectKeys = Object.keys(dataObject);
       console.log("3");
     if(dataObjectKeys.length !== 5){
         console.log("4");
       resolve({message:"Vous devez fournir toutes les clés de l'objet"});
     }else{
         console.log("5");
       if(dataObjectKeys.includes('authorization_header') === true && dataObjectKeys.includes('area_code') === true || dataObjectKeys.includes('sender_number') === true || dataObjectKeys.includes('sender_phone') === true || dataObjectKeys.includes('sms_body') === true){
           console.log("6");
           const dataObjectValues = Object.values(dataObject);
           console.log("7");
       	 if(dataObjectValues.includes(null) === true || dataObjectValues.includes(undefined) === true){
             console.log("8");
         	resolve({message:"la clé d'objet ne doit pas avoir une valeur telle que null ou undefined"});
       	 }else{
             console.log("9");
       	 	// Good to Go
       	 	require("./orangeSmsApi.js")(dataObject)
       	 	.then((responseOrangeSmsApi)=>{
                console.log("10");
              resolve(responseOrangeSmsApi);
       	 	});
             console.log("31");
         }
       }else{
         resolve({message:"One or more object keys are incorrectly written"});
       }
     }
   }else{
   	 resolve({message:"The parameter must be an object"});
   }
 });
};

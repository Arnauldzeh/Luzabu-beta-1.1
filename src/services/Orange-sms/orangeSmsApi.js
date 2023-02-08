module.exports = (orangeApiOptions)=>{
    console.log("11");
  return new Promise((resolve)=>{
      console.log("12");
  	 const request = require('request');
      console.log("13");
     const getToken = require('./getToken.js')(orangeApiOptions.authorization_header);
      console.log("14");
           getToken.then((response)=>{
               console.log("15");
             const headers = {
               'Authorization': `Bearer ${response}`,
               'Content-Type': 'application/json'};
             const body = {
                outboundSMSMessageRequest: {
                address : `tel:${orangeApiOptions.area_code}${orangeApiOptions.sender_number}`, 
                senderAddress : `tel:${orangeApiOptions.area_code}${orangeApiOptions.sender_phone}`,
                outboundSMSTextMessage: {
                message :  orangeApiOptions.sms_body  
             }}};
               console.log("111");
             const options = {
                uri: `https://api.orange.com/smsmessaging/v1/outbound/tel:${orangeApiOptions.area_code}${orangeApiOptions.sender_phone}/requests`,
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)};
               console.log("222");
             const sendSmsRequest = request(options, (error, response, body)=> {
                 console.log("333");
               if (!error && response.statusCode == 201) {
                   console.log("444");
                 resolve({message:'sms sent'});
               }else {
                   console.log("5555");
                 resolve({message:response.statusCode});
               }
             });
           }).catch((error)=>{ 
             console.log(error.body);
           });
  });
}

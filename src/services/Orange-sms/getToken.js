//const request = require("request");

module.exports = (orangeAuthorizationHeader)=>{
    console.log("16");
    return new Promise((resolve)=>{
        console.log("17");
      const https = require('https');
      let credentials= orangeAuthorizationHeader;
      let postData = "";
        console.log("18");
      postData += "grant_type=client_credentials";
        let options = {
            host: 'api.orange.com',
            path: '/oauth/v2/token'
        };
        console.log("19");
        options['method'] = 'POST';
        options['headers'] = {
            'Authorization': credentials,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept':'application/json',
            'Content-Length': Buffer.byteLength(postData)
        };
        console.log("20");
        let req = https.request(options, (response)=> {
            console.log("21");
            response.setEncoding('utf8');
            console.log("22");
            let responseData = '';
            response.on ('data', (data)=> { responseData += data; });
            console.log("23");
            response.on ('end', ()=> {
                console.log("24");
              responseData = JSON.parse(responseData);
                console.log("25");
              resolve(responseData.access_token);
                console.log("26");
            });
       })
       .on('error', (e)=> { console.log(e); console.log("27");});
        console.log("28");
       req.write(postData);
        console.log("29");
       req.end();
        console.log("30");
    });
};

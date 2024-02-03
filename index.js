
    let callPayapi = () => {
        
      var amount = document.getElementById("myText").value;

      var saltkey = document.getElementById("salt").value;

      var index = document.getElementById("index").value;

      var merchantId = document.getElementById("mid").value;

      var mTid = document.getElementById("mTid").value;

      var mUid = document.getElementById("mUid").value;

      var redirectUrl = document.getElementById("redirect").value;

      var redirectMode = document.getElementById("mode").value;

      var callbackUrl = document.getElementById("callback").value;

      var mobileNumber = document.getElementById("mobile").value;
      
      var payload = requestPayload(amount, merchantId, mTid, mUid, redirectUrl, redirectMode, callbackUrl, mobileNumber);

      var finalHeaders = requestHeaders(payload, saltkey, index);

      const prodUrl = 'https://api.phonepe.com/apis/hermes/pg/v1/pay';

      const uatUrl = 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';

      var environmentSelected = '';

      if (document.getElementById('prod').checked) {
        environmentSelected = prodUrl;
      }
      
      if (document.getElementById('uat').checked) {
        environmentSelected = uatUrl;
      }
       
      const options = {
        method:  'post',
        url: environmentSelected,
        headers: finalHeaders,
           data: {request : payload}
          };
              
        axios
          .request(options)
            .then(function (response) {
                  console.log(response.data);
                  url = response.data.data.instrumentResponse.redirectInfo.url;
                  window.location = url;
              })
              .catch(function (error) {
                  console.error(error);
              });
}

let requestPayload = (amount, merID, mTid, mUid, redirectUrl, redirectMode, callbackUrl, mobileNumber) => {

var jsonPayload = {
  merchantId: merID,
  merchantTransactionId: mTid,
  merchantUserId: mUid,
  amount: Number(amount*100),
  redirectUrl: redirectUrl,
  redirectMode: redirectMode,
  callbackUrl: callbackUrl,
  mobileNumber: mobileNumber,
  paymentInstrument: {
    type: "PAY_PAGE"
  }
};

let objJsonStr = JSON.stringify(jsonPayload);
console.log('js object', jsonPayload);
console.log('json object', objJsonStr);
let objJsonB64 = btoa(objJsonStr);
return objJsonB64;

}

let requestHeaders = (objJsonB64, salt, index) => {

var finalxVerify = buildXverify(index, salt, objJsonB64);

console.log (finalxVerify);

var header = {
    accept: 'application/json',
 'Content-Type' : 'application/json' ,
 'X-VERIFY' : finalxVerify
    };

return header;

}


let buildXverify = (index, salt, objJsonB64) => {
var endpoint = '/pg/v1/pay';
var string2 = '###';
var input = objJsonB64 + endpoint + salt; //concatenating the values
var xVerify = sha256(input); //conversion to sha 256
var finalxVerify = xVerify + string2 + index; //final checksum
return finalxVerify;

}
 

let printXverify = () => {

  var amount = document.getElementById("myText").value;

  var salt = document.getElementById("salt").value;

  var index = document.getElementById("index").value;

  var merID = document.getElementById("mid").value;

  var mTid = document.getElementById("mTid").value;

  var payload = requestPayload(amount, merID, mTid);

  var finalxVerify = buildXverify(index, salt, payload);


  console.log(finalxVerify);
  document.getElementById('xverify').innerHTML = finalxVerify;
}


let printBase64 = () => {

  var amount = document.getElementById("myText").value;

  var merchantId = document.getElementById("mid").value;

  var mTid = document.getElementById("mTid").value;

  var mUid = document.getElementById("mUid").value;

  var redirectUrl = document.getElementById("redirect").value;

  var redirectMode = document.getElementById("mode").value;

  var callbackUrl = document.getElementById("callback").value;

  var mobileNumber = document.getElementById("mobile").value;

  var payload = requestPayload(amount, merchantId, mTid, mUid, redirectUrl, redirectMode, callbackUrl, mobileNumber);

  console.log(payload);
  document.getElementById('base64').innerHTML = payload;
}

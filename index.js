
    let callPayapi = () => {
        
      var amount = document.getElementById("myText").value;

      var payload = requestPayload(amount);

      var finalHeaders = requestHeaders(payload);

      var url = '';
       
      const options = {
        method:  'post',
        url: 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay',
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

let requestPayload = (amount) => {

var jsonPayload = {
  merchantId: "PGTESTPAYUAT",
  merchantTransactionId: "MT7850590068188104",
  merchantUserId: "MUID123",
  amount: Number(amount*100),
  redirectUrl: "https://webhook.site/redirect-url",
  redirectMode: "REDIRECT",
  callbackUrl: "https://webhook.site/callback-url",
  mobileNumber: "9999999999",
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

let requestHeaders = (objJsonB64) => {
var endpoint = '/pg/v1/pay';
var string2 = '###';
var salt = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';

var input = objJsonB64 + endpoint + salt; //concatenating the values

var xVerify = sha256(input); //conversion to sha 256

var finalxVerify = xVerify + string2 + '1'; //final checksum
 
var header = {
    accept: 'application/json',
 'Content-Type' : 'application/json' ,
 'X-VERIFY' : finalxVerify
    };


return header;

}
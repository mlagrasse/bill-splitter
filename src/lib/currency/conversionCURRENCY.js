var https = require('https');

function convert(toCurrency, obj, cb) {
  var apiKey = 'd9beeebfbc03720db0ac'; // Limité a 100 requetes / jour

  let fromCurrency = 'EUR';
  toCurrency = encodeURIComponent(toCurrency);
  var query = fromCurrency + '_' + toCurrency;

  var url = 'https://free.currconv.com/api/v7/convert?q='
    + query + '&compact=ultra&apiKey=' + apiKey;

  https.get(url, function (res) {
    var body = '';

    res.on('data', function (chunk) {
      body += chunk;
    });

    res.on('end', function () {
      try {
        var jsonObj = JSON.parse(body);
        var val = jsonObj[query];

        if (val) {
          let factures = obj.factures;
          for (let facture in factures) {
            factures[facture].montant *= val;
            factures[facture].aPayer *= val;
          }
          cb(obj);
        } else {
          var err = new Error("Value not found for " + query);
          console.log(err);
          cb(err);
        }
      } catch (e) {
        console.log("Parse error: ", e);
        cb(e);
      }
    });
  }).on('error', function (e) {
    console.log("Got an error: ", e);
    cb(e);
  });
}

module.exports = {
  convert : convert,
};
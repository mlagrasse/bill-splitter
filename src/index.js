const escapeHtml = require('escape-html');
const dao = require('./dao/dao.js');
const currencyLib = require('./lib/currency/conversionCURRENCY.js');

exports.user = (req, res) => {

  switch (req.method) {
    case 'POST':
      let params = req.body;
      try {
        dao.inscription(params);
        res.status(201).json({ok : true});
      } catch (err) {
        res.status(400).json({ok : false, err : err, message : "Impossible de créer l'utilisateur"});
      } finally {
        res.end();
      }
      break;
    case 'GET':
      if (req.query.oid) {
        dao.getUser(req.query.oid)
        .then((user) => {
          currencyLib.convert(req.query.devise, user, (x) => {
            res.status(200).json({ok : true, user : x}).end();
          })
        })
        .catch((err) => res.status(500).end());
      } else {
        dao.getUsers().then((users) => {
          res.status(200).json({ok : true, users : users}).end();
        })
        .catch((err) => res.status(500).end());
      }
      break;
    case 'PUT':
      break;
    case 'DELETE':
      break;
  }

}

exports.facture = (req, res) => {
  switch (req.method) {
    case 'POST':
      let params = req.body;
      try {
        dao.creerFacture(params);
        res.status(201).json({ok : true});
      } catch (err) {
        res.status(400).json({ok : false, err : err, message : "Impossible de créer la facture"});
      } finally {
        res.end();
      }
      break;
    case 'GET':
      break;
    case 'PUT':
      break;
    case 'DELETE':
      break;
  }

}


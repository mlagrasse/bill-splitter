const { Pool } = require('pg');

const connectionName =
  process.env.INSTANCE_CONNECTION_NAME || 'projet-web-enseirb-matmeca:europe-west1:projet-api';
const dbUser = process.env.SQL_USER || 'api';
const dbPassword = process.env.SQL_PASSWORD || 'api';
const dbName = process.env.SQL_NAME || 'api';

const pgConfig = {
  max: 3,
  user: dbUser,
  password: dbPassword,
  database: dbName,
};

if (process.env.NODE_ENV === 'production') {
  pgConfig.host = `/cloudsql/${connectionName}`;
}

// pgConfig.hostname = 'localhost';
// pgConfig.port = 5432;

const pool = new Pool(pgConfig);

var creerFacture = function(params) {

	let sqlFacture = "INSERT INTO facture (emetteur_id, montant) VALUES ( $1, $2 ) RETURNING oid;";
  let paramsSqlFacture = [params.emetteur, params.montant];
  
  let sqlAssoc = "INSERT INTO user_facture (facture_id, member_id) VALUES ( $1, $2 );";

  pool.query(sqlFacture, paramsSqlFacture)
    .then((resSql) => {
      let factureOid = resSql.rows[0].oid;
      for (let userOid of params.users) {
        let paramsSqlAssoc = [factureOid, userOid];
        pool.query(sqlAssoc, paramsSqlAssoc);
      }
    });
	
	return;
}


module.exports = {
	creerFacture : creerFacture,
};

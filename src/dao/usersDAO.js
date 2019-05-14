const { Pool } = require('pg');

 // Spécifier les paramètres de connexion SQL
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

var inscription = async function(userDetails) {

	let sql = "INSERT INTO user_login (username, email) VALUES ( $1, $2 ) ;";
	
	let paramssql = [userDetails.name, userDetails.email];
	await pool.query(sql, paramssql);
	
	return;
}

var getUsers = function() {
	let sql = "SELECT oid, username FROM user_login;"

	return pool.query(sql).then(resSql => resSql.rows);
}

var getUser = function(oid) {
	let sqlDetailUser = `SELECT u.username, u.email, f.montant, f.oid as facture_oid, f.emetteur_id
		FROM user_login u 
			RIGHT JOIN user_facture uf ON u.oid = uf.member_id
			RIGHT JOIN facture f ON uf.facture_id = f.oid
		WHERE u.oid = $1;`;

	let sqlNbOfMemberPerInvoice = `SELECT f.oid, count(uf.member_id) as nb_member
	FROM facture f
		RIGHT JOIN user_facture uf ON uf.facture_id = f.oid
	GROUP BY f.oid;`;

	return pool.query(sqlDetailUser, [oid]).then(resSql => resSql.rows)
		.then(user => {
			let userReduce = user.reduce((accu, item) => {
				accu.name = item.username;
				accu.email = item.email;
				if (!accu.factures)
					accu.factures = {};
				accu.factures[item.facture_oid] = {
					montant : item.montant,
					emetteur : item.emetteur_id
				};
				return accu;
			}, {});
			return userReduce;
		}).then(async user => {
			let factures = (await pool.query(sqlNbOfMemberPerInvoice)).rows;
			factures.map(item => {
				user.factures[item.oid].nbMember = item.nb_member;
				user.factures[item.oid].aPayer = user.factures[item.oid].montant / item.nb_member;
			});
			return user;
		}).catch(console.log)
}

module.exports = {
	inscription : inscription,
	getUsers : getUsers,
	getUser : getUser,
};

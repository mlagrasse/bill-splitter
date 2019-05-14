-- CREATE ROLE api WITH LOGIN PASSWORD 'api';
-- CREATE DATABASE api OWNER api;

CREATE TABLE user_login (
	oid SERIAL PRIMARY KEY,
    username CHARACTER VARYING(50) UNIQUE NOT NULL,
	email CHARACTER VARYING(50) UNIQUE NOT NULL
);

CREATE TABLE facture (
    oid SERIAL PRIMARY KEY,
    emetteur_id INTEGER REFERENCES user_login(oid),
    montant INTEGER NOT NULL
);

CREATE TABLE user_facture (
    oid SERIAL PRIMARY KEY,
    facture_id INTEGER REFERENCES facture(oid),
    member_id INTEGER REFERENCES user_login(oid)
);

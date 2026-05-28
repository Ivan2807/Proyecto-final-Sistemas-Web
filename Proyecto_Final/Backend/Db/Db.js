const {Pool} = require('pg');
require('dotenv').config();

const db = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

const creaciondeTablas = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS juegos (
      id            TEXT PRIMARY KEY,
      nombre        TEXT NOT NULL,
      categoriaId   TEXT,
      estado        TEXT,
      puntuacion    REAL,
      fechaRegistro TEXT,
      fechaActividad TEXT,
      notas         TEXT,
      atributos     TEXT,
      activo        INTEGER NOT NULL DEFAULT 1
    );
  `);

await db.query(`
  CREATE TABLE IF NOT EXISTS registros (
    id      TEXT PRIMARY KEY,
    itemId  TEXT NOT NULL REFERENCES juegos(id),
    fecha   TEXT NOT NULL,
    valor   REAL NOT NULL,
    notas   TEXT
  );
`);
  console.log('Tablas creadas o ya existen');
};

module.exports = {db, pool: db, creaciondeTablas};
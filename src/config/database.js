const dotenv = require('dotenv');
const pg = require('pg');
dotenv.config();

module.exports = {
    dialect: process.env.DB_DIALECT,
    dialectModule: pg,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    define: {
      timespamps: true,
      underscored: true,
      underscoredAll: true,
    },
}

console.log(process.env.DB_DIALECT)

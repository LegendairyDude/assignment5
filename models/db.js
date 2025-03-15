const { Pool } = require("pg");
require('dotenv').config()

//db hosted on render, if no inventory shows db may have been shut down by render
//active as of 03/15

module.exports = new Pool({
    connectionString: process.env.DB_CONNECTION,
    ssl: { rejectUnauthorized: false }
  });
const mysql = require("mysql");
const util = require("util");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.db_host,
    database: process.env.db_name,
    user: process.env.db_user,
    // pass: process.env.db_pass,
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0
});

//  check connection:
pool.getConnection((err) => {
    err
      ? console.warn("No conectado", { error: err.message })
      : console.log("Conexión establecida...");
  });

pool.query = util.promisify(pool.query)

module.exports = pool;






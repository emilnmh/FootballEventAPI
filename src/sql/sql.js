const { Client } = require("pg");
require("dotenv").config();



module.exports.query = async function(query, param = null) {
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      })
    client.connect()
    const res = await client.query(query, param);
    client.end()
    return res;
}

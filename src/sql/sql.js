const { Pool } = require("pg");
require("dotenv").config();



module.exports.query = async function(query, param = null) {
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        max: 1,
        idleTimeoutMillis: 10000,
        connectionTimeoutMillis: 2000,
    });
    const client = await pool.connect();

    const res = await client.query(query);

    client.release();
    return res;
}

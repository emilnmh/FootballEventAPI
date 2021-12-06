const { Pool } = require("pg");
const ServerError = require("../../lib/error");
require("dotenv").config();

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

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getFields = async (options) => {
  try {
    const client = await pool.connect();

    const query = "SELECT * FROM fields";
    const res = await client.query(query);

    client.release();

    return {
      status: 200,
      data: res.rows,
    };
  } catch (error) {
    console.log(error);
    throw new ServerError({
      status: 500,
      error: "Server Error",
    });
  }
};

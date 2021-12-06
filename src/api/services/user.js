const { Pool } = require("pg");
const ServerError = require("../../lib/error");
const bcrypt = require("bcryptjs");

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
 * @param {Object} options.body User to be created
 * @throws {Error}
 * @return {Promise}
 */
module.exports.createUser = async (options) => {
  if (
    options.body !== undefined &&
    options.body.password &&
    options.body.password.length >= 7 &&
    options.body.username
  ) {
    try {
      const client = await pool.connect();

      const salt = bcrypt.genSaltSync(parseInt(process.env.PWD_SALT));
      const hashPassword = bcrypt.hashSync(options.body.password, salt);

      const query = "INSERT INTO users (username, password) VALUES ($1, $2)";
      const values = [options.body.username, hashPassword];

      const res = await client.query(query, values);
      client.release();

      return {
        status: 200,
        data: res.rows[0],
        message: "OK",
      };
    } catch (error) {
      if (error.code === "23505") {
        return {
          status: 400,
          error: "Username already exists",
        };
      } else {
        console.log(error);
        throw new ServerError({
          status: 500,
          error: "Server Error",
        });
      }
    }
  } else {
    return {
      status: 400,
      error: "Invalid input",
    };
  }
};
